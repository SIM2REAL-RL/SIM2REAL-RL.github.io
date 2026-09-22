#!/usr/bin/env python3
"""Index real, local media assets for the static site. Python 3.9+, standard library only.

Run from any directory: python3 path/to/tools/prepare.py
--check validates without writing. --strict also requires all seven ours-real clips.
This script does not generate footage, invent results, or alter content.js.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIDEO_EXTS = ('.mp4', '.webm', '.m4v')
IMAGE_EXTS = ('.jpg', '.png', '.webp', '.jpeg')


def read_assignment(path: Path, variable: str) -> dict:
    text = path.read_text(encoding='utf-8')
    marker = variable + ' = '
    if marker not in text:
        raise ValueError(f'{path.relative_to(ROOT)} must contain "{marker}".')
    payload = text.split(marker, 1)[1].strip().removesuffix(';').strip()
    try:
        result = json.loads(payload)
    except json.JSONDecodeError as exc:
        raise ValueError(f'{path.relative_to(ROOT)}: keep the data JSON-compatible (double quotes, no trailing commas). {exc}') from exc
    if not isinstance(result, dict):
        raise ValueError(f'{path.name} must define an object.')
    return result


def safe_file(relative: str) -> Path:
    if not isinstance(relative, str) or not relative:
        raise ValueError('Empty or invalid asset path.')
    if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', relative) or relative.startswith('/') or '..' in relative.split('/'):
        raise ValueError(f'Use a relative same-site asset path, not {relative!r}.')
    p = ROOT.joinpath(relative).resolve()
    if ROOT not in p.parents:
        raise ValueError(f'Asset is outside the site folder: {relative!r}.')
    return p


def scan(stem: Path, extensions: tuple[str, ...]) -> str:
    for ext in extensions:
        p = stem.with_suffix(ext)
        if p.is_file() and p.stat().st_size > 0:
            if ROOT not in p.resolve().parents:
                raise ValueError(f'Asset symlink escapes the site folder: {p}')
            return p.relative_to(ROOT).as_posix()
    return ''


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Validate existing paths and index without writing.')
    parser.add_argument('--strict', action='store_true', help='Fail unless every task has an ours-real recording.')
    args = parser.parse_args()
    errors: list[str] = []
    warnings: list[str] = []
    content = read_assignment(ROOT / 'assets/js/content.js', 'window.SITE_CONTENT')
    tasks, methods = content['tasks'], content['methods']
    for label, items in [('task', tasks), ('method', methods)]:
        ids = [x['id'] for x in items]
        if len(ids) != len(set(ids)) or any(not re.fullmatch(r'[a-z0-9-]+', s) for s in ids):
            errors.append(f'Use unique lowercase alphanumeric/hyphen {label} IDs.')
    if len(tasks) != 7:
        warnings.append('This layout contains static seven-task wording. Update index.html when changing the number of tasks.')
    index = {'overview': scan(ROOT / 'assets/videos/overview', VIDEO_EXTS),
             'paper': 'assets/paper.pdf' if (ROOT / 'assets/paper.pdf').is_file() and (ROOT / 'assets/paper.pdf').stat().st_size > 0 else '',
             'posters': {}, 'videos': {}, 'figures': {}}
    recognized = set()
    for task in tasks:
        tid = task['id']
        if not re.fullmatch(r'[a-z0-9-]+', tid):
            continue
        poster = scan(ROOT / 'assets/posters' / tid, IMAGE_EXTS)
        if poster:
            index['posters'][tid] = poster; recognized.add(poster)
        for method in methods:
            mid = method['id']
            if not re.fullmatch(r'[a-z0-9-]+', mid):
                continue
            for domain in ('real', 'sim'):
                source = scan(ROOT / 'assets/videos' / tid / f'{mid}-{domain}', VIDEO_EXTS)
                if source:
                    index['videos'].setdefault(tid, {}).setdefault(mid, {})[domain] = source
                    recognized.add(source)
                override = task.get('media', {}).get(mid, {}).get(domain, '')
                if override:
                    target = safe_file(override)
                    if not target.is_file() or target.stat().st_size == 0:
                        errors.append(f'Missing or empty configured media: {override}')
                    else:
                        recognized.add(target.relative_to(ROOT).as_posix())
            result = task.get('results', {}).get(mid)
            if result is not None:
                if not isinstance(result, dict):
                    errors.append(f'{tid}/{mid}: a result must be null or an object.'); continue
                s, n = result.get('successes'), result.get('trials')
                if type(s) is not int or type(n) is not int or n <= 0 or not 0 <= s <= n:
                    errors.append(f'{tid}/{mid}: require integers 0 <= successes <= trials, trials > 0.')
        if args.strict and not (index['videos'].get(tid, {}).get('ours', {}).get('real') or task.get('media', {}).get('ours', {}).get('real')):
            errors.append(f'Missing required demo: assets/videos/{tid}/ours-real.mp4')
    for key, name in [('interactions', 'learning-interactions'), ('time', 'learning-time')]:
        source = scan(ROOT / 'assets/figures' / name, ('.png', '.jpg', '.webp'))
        if source:
            index['figures'][key] = source
    for key in ('overview', 'paper'):
        if index[key]: recognized.add(index[key])
    for p in (ROOT / 'assets/videos').rglob('*'):
        if not p.is_file(): continue
        relative = p.relative_to(ROOT).as_posix()
        if p.suffix.lower() in VIDEO_EXTS and relative not in recognized:
            warnings.append(f'Unindexed video (check name/extension or alternate encoding): {relative}')
    for p in ROOT.rglob('*'):
        if not p.is_file() or '.git' in p.parts: continue
        size = p.stat().st_size
        if size > 100 * 1024**2: errors.append(f'File exceeds 100 MiB: {p.relative_to(ROOT)}')
        elif size > 25 * 1024**2: warnings.append(f'File exceeds the web-upload limit of 25 MiB: {p.relative_to(ROOT)}')
    if args.check:
        existing = read_assignment(ROOT / 'assets/js/media-index.js', 'window.SITE_MEDIA')
        if existing != index:
            errors.append('The media index is stale. Run python3 tools/prepare.py before uploading.')
    if errors:
        for msg in errors: print('ERROR:', msg, file=sys.stderr)
        for msg in warnings: print('WARNING:', msg)
        return 1
    if not args.check:
        text = ('/* Generated by tools/prepare.py. Local assets only; missing media stay empty. */\n'
                'window.SITE_MEDIA = ' + json.dumps(index, ensure_ascii=False, indent=2) + ';\n')
        (ROOT / 'assets/js/media-index.js').write_text(text, encoding='utf-8')
    videos = sum(len(domains) for group in index['videos'].values() for domains in group.values())
    cells = sum(task.get('results', {}).get(method['id']) is not None for task in tasks for method in methods)
    print(f'{"Validated" if args.check else "Updated"}: assets/js/media-index.js')
    print(f'{len(tasks)} tasks | {videos} indexed task videos | {len(index["posters"])} posters | {cells} reported result cells')
    print('Paper linked:', bool(index['paper']), '| Overview linked:', bool(index['overview']))
    for msg in warnings: print('WARNING:', msg)
    if not videos: print('No recordings found. The page will display labeled placeholders, not broken players.')
    print('Ready for local preview. Publication and anonymity still require manual review.')
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (ValueError, KeyError, OSError, TypeError) as exc:
        print(f'ERROR: {exc}', file=sys.stderr)
        raise SystemExit(1)
