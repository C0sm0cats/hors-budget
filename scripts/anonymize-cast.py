from __future__ import annotations

import base64
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {'.js', '.cjs', '.mjs', '.html', '.css', '.md', '.json', '.yml', '.yaml', '.txt', '.xml'}
SKIP_DIRS = {'.git', 'node_modules'}

# Technical runtime identifiers are role-based. Display labels contain functions only.
GROUPS = [
    {
        'ascii': ('kevin', 'keke'),
        'accented': ('kévin', 'kéké'),
        'runtime': 'projectDirector',
        'display': 'DIRECTEUR DE PROJETS',
    },
    {
        'ascii': ('charline', 'chacha'),
        'accented': (),
        'runtime': 'businessManager',
        'display': 'BUSINESS MANAGER',
    },
    {
        'ascii': ('julien', 'juju'),
        'accented': (),
        'runtime': 'techServicesDirector',
        'display': 'DIRECTEUR TECHNOLOGIES SERVICES',
    },
    {
        'ascii': ('rodolphe', 'roro'),
        'accented': (),
        'runtime': 'regionalDirector',
        'display': 'DIRECTEUR RÉGION GRAND OUEST',
    },
]

SPECIAL_REPLACEMENTS = {
    'globalThis.JulienBoss': 'globalThis.TechServicesBoss',
    'JulienBoss': 'TechServicesBoss',
    'julienBoss': 'techServicesBoss',
    'julien-boss': 'tech-services-boss',
}

KNOWN_RENAMES = {
    'julien-boss.js': 'tech-services-boss.js',
    'tests/julien-dialogue.test.cjs': 'tests/tech-services-dialogue.test.cjs',
    'tests/julien-timing.test.cjs': 'tests/tech-services-timing.test.cjs',
    'tests/rodolphe-dialogue.test.cjs': 'tests/regional-director-dialogue.test.cjs',
    'plaques/keke.png': 'plaques/projectDirector.png',
    'plaques/chacha.png': 'plaques/businessManager.png',
    'plaques/juju.png': 'plaques/techServicesDirector.png',
    'plaques/roro.png': 'plaques/regionalDirector.png',
}


def anonymize_text(text: str) -> str:
    for old, new in SPECIAL_REPLACEMENTS.items():
        text = text.replace(old, new)

    # Lower-case ASCII occurrences are implementation identifiers, including camelCase prefixes.
    for group in GROUPS:
        for old in group['ascii']:
            text = text.replace(old, group['runtime'])

    # Any remaining case/accent spelling is human-facing and becomes a role label.
    for group in GROUPS:
        variants = [*group['ascii'], *group['accented']]
        pattern = re.compile(r'(?<![\w])(?:' + '|'.join(re.escape(v) for v in variants) + r')(?![\w])', re.IGNORECASE)
        text = pattern.sub(group['display'], text)
    return text


def rewrite_generator(text: str) -> str:
    people = """const people={
  projectDirector:{name:'DIRECTION PROJETS',role:['DIRECTEUR DE PROJETS']},
  businessManager:{name:'DÉVELOPPEMENT COMMERCIAL',role:['BUSINESS MANAGER']},
  techServicesDirector:{name:'TECHNOLOGIES & SERVICES',role:['DIRECTEUR TECHNOLOGIES SERVICES','PAYS DE LA LOIRE']},
  regionalDirector:{name:'DIRECTION RÉGIONALE',role:['DIRECTEUR RÉGION','GRAND OUEST']}
};"""
    text, count = re.subn(r"const people=\{.*?\n\};", people, text, count=1, flags=re.DOTALL)
    if count != 1:
        raise RuntimeError('Unable to rewrite office plaque definitions')
    return text


def iter_text_files():
    for path in ROOT.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        yield path


def rename_known_paths():
    for old_rel, new_rel in KNOWN_RENAMES.items():
        old = ROOT / old_rel
        new = ROOT / new_rel
        if old.exists():
            new.parent.mkdir(parents=True, exist_ok=True)
            if new.exists():
                new.unlink()
            old.rename(new)


def rewrite_files():
    for path in iter_text_files():
        original = path.read_text(encoding='utf-8')
        updated = anonymize_text(original)
        if path == ROOT / 'scripts/generate-office-plaques.cjs':
            updated = rewrite_generator(updated)
        if updated != original:
            path.write_text(updated, encoding='utf-8')


def regenerate_plaques():
    from PIL import Image, ImageDraw, ImageFont

    definitions = {
        'projectDirector': ('DIRECTION PROJETS', ['DIRECTEUR DE PROJETS']),
        'businessManager': ('DÉVELOPPEMENT COMMERCIAL', ['BUSINESS MANAGER']),
        'techServicesDirector': ('TECHNOLOGIES & SERVICES', ['DIRECTEUR TECHNOLOGIES SERVICES', 'PAYS DE LA LOIRE']),
        'regionalDirector': ('DIRECTION RÉGIONALE', ['DIRECTEUR RÉGION', 'GRAND OUEST']),
    }
    font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    plaques_dir = ROOT / 'plaques'
    plaques_dir.mkdir(exist_ok=True)
    output = {}

    for key, (title, roles) in definitions.items():
        width, height = 720, 260
        image = Image.new('RGB', (width, height), '#d8c69a')
        draw = ImageDraw.Draw(image)
        draw.rounded_rectangle((12, 12, width - 12, height - 12), radius=18, fill='#162832', outline='#806b45', width=5)
        draw.rounded_rectangle((24, 24, width - 24, height - 24), radius=12, outline='#e8d7a9', width=2)
        try:
            title_font = ImageFont.truetype(font_path, 42)
            role_font = ImageFont.truetype(font_path, 25)
        except OSError:
            title_font = role_font = ImageFont.load_default()

        lines = [(title, title_font, '#f4e3b6')]
        lines += [(role, role_font, '#eef2ee') for role in roles]
        boxes = [draw.textbbox((0, 0), text, font=font) for text, font, _ in lines]
        heights = [box[3] - box[1] for box in boxes]
        total = sum(heights) + 18 * (len(lines) - 1)
        y = (height - total) / 2
        for (text, font, color), box, line_h in zip(lines, boxes, heights):
            line_w = box[2] - box[0]
            draw.text(((width - line_w) / 2, y - box[1]), text, font=font, fill=color)
            y += line_h + 18

        path = plaques_dir / f'{key}.png'
        image.save(path, optimize=True)
        payload = base64.b64encode(path.read_bytes()).decode('ascii')
        output[key] = {
            'name': title,
            'role': roles,
            'width': width,
            'height': height,
            'padding': 48,
            'png': 'data:image/png;base64,' + payload,
        }

    data = "'use strict';\n// Role-based office plaques; no personal identities are embedded in runtime data.\nglobalThis.OfficePlaqueAssets=" + json.dumps(output, ensure_ascii=False, separators=(',', ':')) + ';\n'
    (ROOT / 'office-plaques-data.js').write_text(data, encoding='utf-8')


def write_guard_test():
    # Numeric code points avoid embedding the forbidden identities in the repository itself.
    forbidden_codes = [
        [107, 101, 118, 105, 110],
        [107, 101, 107, 101],
        [99, 104, 97, 114, 108, 105, 110, 101],
        [99, 104, 97, 99, 104, 97],
        [106, 117, 108, 105, 101, 110],
        [106, 117, 106, 117],
        [114, 111, 100, 111, 108, 112, 104, 101],
        [114, 111, 114, 111],
    ]
    test = f"""const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const blocked={forbidden_codes!r}.map(code=>String.fromCodePoint(...code));
const normalize=s=>s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
const textExt=new Set(['.js','.cjs','.mjs','.html','.css','.md','.json','.yml','.yaml','.txt','.xml']);
function walk(dir,out=[]){
  for(const entry of fs.readdirSync(dir,{{withFileTypes:true}})){{
    if(entry.name==='.git'||entry.name==='node_modules')continue;
    const full=path.join(dir,entry.name),rel=path.relative(root,full);
    out.push(rel);
    if(entry.isDirectory())walk(full,out);
    else if(textExt.has(path.extname(entry.name).toLowerCase()))out.push(fs.readFileSync(full,'utf8'));
  }}
  return out;
}}
test('repository contains no personal cast identities in paths or text',()=>{{
  const corpus=normalize(walk(root).join('\\n'));
  for(const word of blocked)assert.equal(corpus.includes(word),false,'forbidden cast identity found');
}});
"""
    (ROOT / 'tests/anonymized-cast.test.cjs').write_text(test, encoding='utf-8')


def main():
    rename_known_paths()
    rewrite_files()
    regenerate_plaques()
    write_guard_test()


if __name__ == '__main__':
    main()
