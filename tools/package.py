#!/usr/bin/env python3
"""Build the single-paste SS installer from a reviewed local tree."""
import base64,gzip,hashlib,io,json,pathlib,tarfile
root=pathlib.Path(__file__).resolve().parent.parent
files=sorted(p for p in root.rglob('*') if p.is_file() and '.git' not in p.parts and '__pycache__' not in p.parts and p.name not in ('UNIOMNI_STAGE0.sh','release.json'))
manifest={'version':'1.0.0','files':{str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in files}}
(root/'release.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
buf=io.BytesIO()
with tarfile.open(fileobj=buf,mode='w') as t:
 for p in files+[root/'release.json']:
  data=p.read_bytes(); info=tarfile.TarInfo(str(p.relative_to(root)));info.size=len(data);info.mode=0o600;info.mtime=0;t.addfile(info,io.BytesIO(data))
payload=gzip.compress(buf.getvalue(),mtime=0);h=hashlib.sha256(payload).hexdigest()
header='''#!/usr/bin/env bash
# [SS][TDOC-UNIOMNI-STAGE0-V1.0]
# Copyright: The Architect / Nexus / Cryptic News LLC
# Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia
set -euo pipefail
umask 077
command -v python3 >/dev/null || { echo 'Python 3.10+ required (Termux: pkg install python; Debian: apt install python3).'; exit 1; }
SELF="${BASH_SOURCE[0]}"
exec python3 - "$SELF" "$@" <<'UNIOMNI_PY'
import base64,gzip,hashlib,io,os,pathlib,shlex,subprocess,sys,tarfile,tempfile
if sys.version_info < (3,10): sys.exit('Python 3.10+ required')
os.umask(0o077)
self=pathlib.Path(sys.argv[1]).resolve()
payload=base64.b64decode(self.read_text().split('__UNIOMNI_PAYLOAD__\\n',1)[1])
if hashlib.sha256(payload).hexdigest()!='PAYLOAD_SHA': sys.exit('Installer payload integrity failure')
base=pathlib.Path(os.environ.get('AE',str(pathlib.Path.home()/'Æ'))).expanduser().resolve()
release=base/'uniomni-releases'/'1.0.0-PAYLOAD_SHORT'
if not release.exists():
 release.parent.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory(dir=release.parent) as tmp:
  stage=pathlib.Path(tmp)/'release';stage.mkdir()
  with tarfile.open(fileobj=io.BytesIO(gzip.decompress(payload))) as t:
   for item in t:
    p=pathlib.PurePosixPath(item.name)
    if not item.isfile() or p.is_absolute() or '..' in p.parts: sys.exit('Unsafe archive member')
    dest=stage.joinpath(*p.parts);dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(t.extractfile(item).read())
  subprocess.run([sys.executable,str(stage/'tools/verify.py')],check=True)
  stage.rename(release)
subprocess.run([sys.executable,str(release/'tools/verify.py')],check=True)
bin=base/'bin';bin.mkdir(parents=True,exist_ok=True)
launcher=bin/'uniomni'
launcher.write_text('#!/usr/bin/env bash\\nexec '+shlex.quote(sys.executable)+' '+shlex.quote(str(release/'runtime/uniomni.py'))+' "$@"\\n');launcher.chmod(0o700)
auto=base/'autonomous';auto.mkdir(parents=True,exist_ok=True)
saved=auto/'UNIOMNI_STAGE0.sh'
if self!=saved.resolve(): saved.write_bytes(self.read_bytes());saved.chmod(0o700)
# Freedesktop registration is valid for Crostini Linux apps, not a ChromeOS-wide guarantee.
if sys.platform.startswith('linux') and not os.environ.get('PREFIX','').startswith('/data/data/com.termux'):
 apps=pathlib.Path.home()/'.local/share/applications';apps.mkdir(parents=True,exist_ok=True)
 handler=bin/'uniomni-open'
 handler.write_text('#!/usr/bin/env bash\\nexec xdg-open http://127.0.0.1:6080/\\n');handler.chmod(0o700)
 execpath='"'+str(handler).replace('\\\\','\\\\\\\\').replace('"','\\\\"').replace('%','%%')+'" %u'
 (apps/'uniomni.desktop').write_text('[Desktop Entry]\\nType=Application\\nName=UNIOMNI\\nExec='+execpath+'\\nMimeType=x-scheme-handler/uniomni;\\nNoDisplay=true\\n')
 import shutil
 if shutil.which('xdg-mime'): subprocess.run(['xdg-mime','default','uniomni.desktop','x-scheme-handler/uniomni'],check=False)
print('Installed:',release,'\\nCommand:',launcher,'\\nStart:',launcher,'serve',flush=True)
subprocess.run([str(launcher),'cycle'],check=True,stdout=subprocess.DEVNULL)
if '--serve' in sys.argv: os.execv(str(launcher),[str(launcher),'serve'])
UNIOMNI_PY
exit 0
__UNIOMNI_PAYLOAD__
'''.replace('PAYLOAD_SHA',h).replace('PAYLOAD_SHORT',h[:12])
(root/'UNIOMNI_STAGE0.sh').write_text(header+base64.b64encode(payload).decode()+'\n')
print('Packaged',len(files),'files; payload',h)
