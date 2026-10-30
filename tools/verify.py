#!/usr/bin/env python3
import hashlib,json,pathlib,sys
root=pathlib.Path(__file__).resolve().parent.parent
manifest=json.loads((root/'release.json').read_text())
bad=[]
for name,want in manifest['files'].items():
 p=root/name
 if p.is_symlink() or not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=want: bad.append(name)
if bad: sys.exit('Integrity mismatch: '+', '.join(bad))
print('Verified',len(manifest['files']),'release files; SHA-256 manifest is not an authorship signature.')
