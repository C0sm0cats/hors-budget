from __future__ import annotations

import base64
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {'.js', '.cjs', '.mjs', '.html', '.css', '.md', '.json', '.yml', '.yaml', '.txt', '.xml'}
SKIP_DIRS = {'.git', 'node_modules'}

GROUPS = [
    {'ascii': ('kevin', 'keke'), 'accented': ('kévin', 'kéké'), 'runtime': 'projectDirector', 'display': 'DIRECTEUR DE PROJETS'},
    {'ascii': ('charline', 'chacha'), 'accented': (), 'runtime': 'businessManager', 'display': 'BUSINESS MANAGER'},
    {'ascii': ('julien', 'juju'), 'accented': (), 'runtime': 'techServicesDirector', 'display': 'DIRECTEUR TECHNOLOGIES SERVICES'},
    {'ascii': ('rodolphe', 'roro'), 'accented': (), 'runtime': 'regionalDirector', 'display': 'DIRECTEUR RÉGION GRAND OUEST'},
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
    for group in GROUPS:
        for old in group['ascii']:
            text = text.replace(old, group['runtime'])
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


def rewrite_role_tests():
    canonical = """const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const game=fs.readFileSync('game.js','utf8');
test('main cast uses role-based runtime keys',()=>{
  assert.match(game,/CAST=\\{projectDirector:/);
  assert.match(game,/,businessManager:\\{/);
  assert.match(game,/CAST\\.techServicesDirector=\\{/);
  assert.match(game,/,regionalDirector:\\{/);
  assert.match(game,/person\\(moving,'projectDirector'/);
  assert.match(game,/person\\(moving,'businessManager'/);
  assert.match(game,/person\\(moving,'techServicesDirector'/);
  assert.match(game,/person\\(moving,'regionalDirector'/);
});
"""
    (ROOT / 'tests/canonical-cast-keys.test.cjs').write_text(canonical, encoding='utf-8')

    invariants = ROOT / 'tests/redesign-invariants.test.cjs'
    if invariants.exists():
        text = invariants.read_text(encoding='utf-8')
        text = text.replace('Le pipeline est vert. Les signatures sont plus nuancées.', 'Le pipeline est vert. Les signatures utilisent une palette plus prudente.')
        invariants.write_text(text, encoding='utf-8')


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
        lines = [(title, title_font, '#f4e3b6')] + [(role, role_font, '#eef2ee') for role in roles]
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
        output[key] = {'name': title, 'role': roles, 'width': width, 'height': height, 'padding': 48, 'png': 'data:image/png;base64,' + payload}

    data = "'use strict';\n// Role-based office plaques; no personal identities are embedded in runtime data.\nglobalThis.OfficePlaqueAssets=" + json.dumps(output, ensure_ascii=False, separators=(',', ':')) + ';\n'
    (ROOT / 'office-plaques-data.js').write_text(data, encoding='utf-8')


def write_guard_test():
    forbidden_codes = [
        [107, 101, 118, 105, 110], [107, 101, 107, 101],
        [99, 104, 97, 114, 108, 105, 110, 101], [99, 104, 97, 99, 104, 97],
        [106, 117, 108, 105, 101, 110], [106, 117, 106, 117],
        [114, 111, 100, 111, 108, 112, 104, 101], [114, 111, 114, 111],
    ]
    test = """const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const blocked=__BLOCKED__.map(code=>String.fromCodePoint(...code));
const normalize=s=>s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
const textExt=new Set(['.js','.cjs','.mjs','.html','.css','.md','.json','.yml','.yaml','.txt','.xml']);
function inspect(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name==='.git'||entry.name==='node_modules')continue;
    const full=path.join(dir,entry.name),rel=path.relative(root,full);
    const pathText=normalize(rel);
    for(const word of blocked)assert.equal(pathText.includes(word),false,'forbidden cast identity in path: '+rel);
    if(entry.isDirectory())inspect(full);
    else if(textExt.has(path.extname(entry.name).toLowerCase())){
      const content=normalize(fs.readFileSync(full,'utf8'));
      for(const word of blocked)assert.equal(content.includes(word),false,'forbidden cast identity in file: '+rel);
    }
  }
}
test('repository contains no personal cast identities in paths or text',()=>inspect(root));
""".replace('__BLOCKED__', json.dumps(forbidden_codes))
    (ROOT / 'tests/anonymized-cast.test.cjs').write_text(test, encoding='utf-8')


def main():
    rename_known_paths()
    rewrite_files()
    rewrite_role_tests()
    regenerate_plaques()
    write_guard_test()


if __name__ == '__main__':
    main()
