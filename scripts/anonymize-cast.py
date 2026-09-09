from __future__ import annotations

import os
import re
import shutil
import unicodedata
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
        'slug': 'project-director',
    },
    {
        'ascii': ('charline', 'chacha'),
        'accented': (),
        'runtime': 'businessManager',
        'display': 'BUSINESS MANAGER',
        'slug': 'business-manager',
    },
    {
        'ascii': ('julien', 'juju'),
        'accented': (),
        'runtime': 'techServicesDirector',
        'display': 'DIRECTEUR TECHNOLOGIES SERVICES',
        'slug': 'tech-services-director',
    },
    {
        'ascii': ('rodolphe', 'roro'),
        'accented': (),
        'runtime': 'regionalDirector',
        'display': 'DIRECTEUR RÉGION GRAND OUEST',
        'slug': 'regional-director',
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
    write_guard_test()


if __name__ == '__main__':
    main()
