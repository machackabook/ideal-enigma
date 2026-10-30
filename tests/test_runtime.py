import importlib.util,json,pathlib,tempfile,threading,unittest,urllib.request,urllib.error,zipfile
ROOT=pathlib.Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('uni',ROOT/'runtime/uniomni.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Contracts(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.r=m.Runtime(self.tmp.name)
 def tearDown(self): self.tmp.cleanup()
 def test_ledger_tamper_retains_evidence(self):
  self.r.event('test',{'ok':True});raw=self.r.ledger.read_bytes();self.r.ledger.write_bytes(raw.replace(b'true',b'false'));broken=self.r.ledger.read_bytes()
  with self.assertRaises(ValueError):self.r.event('later',{})
  self.assertEqual(self.r.ledger.read_bytes(),broken)
 def test_ingest_dedup_and_escaping(self):
  a=self.r.ingest('"\n title','payload');b=self.r.ingest('other','payload');self.assertEqual(a,b)
  self.assertEqual(m.verify_ledger(self.r.ledger)['entries'],1)
  self.assertEqual(len(list((self.r.root/'vault/conversations').iterdir())),1)
 def test_cycle_skips_symlink_and_heals_shadow(self):
  self.r.ingest('note','real text');(self.r.root/'vault/escape').symlink_to('/etc',target_is_directory=True)
  first=self.r.cycle();self.assertEqual(len(first['mesh']['nodes']),1)
  shadow=self.r.root/'snapshots/shadow/runtime/app.js';shadow.write_text('corrupt')
  self.r.cycle();self.assertEqual(shadow.read_bytes(),(ROOT/'runtime/app.js').read_bytes())
 def test_unconfigured_molt_fails(self):
  import os
  old=os.environ.pop('GEMINI_API_KEY',None)
  try:
   with self.assertRaises(ValueError):self.r.molt('hello')
  finally:
   if old:os.environ['GEMINI_API_KEY']=old
 def test_server_access_boundaries(self):
  server=m.Server(('127.0.0.1',0),m.Handler);server.runtime=self.r
  thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();url=f'http://127.0.0.1:{server.server_port}'
  # Explicitly bypass HTTP proxy only for this local test, not network policy.
  opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
  def request(path,headers=None,data=None):
   req=urllib.request.Request(url+path,headers=headers or {},data=data)
   try:
    with opener.open(req,timeout=5) as r:return r.status,r.read()
   except urllib.error.HTTPError as e:return e.code,e.read()
  try:
   self.assertEqual(request('/api/health')[0],200)
   self.assertEqual(request('/api/cycle',data=b'{}')[0],401)
   auth={'Authorization':'Bearer '+self.r.token,'Content-Type':'application/json'}
   self.assertEqual(request('/api/cycle',{**auth,'Origin':'https://evil.example'},b'{}')[0],403)
   self.assertEqual(request('/api/health',{'Host':'evil.example'})[0],403)
   self.assertEqual(request('/api/ingest',auth,json.dumps({'title':'ok','text':'real input'}).encode())[0],200)
   self.assertEqual(request('/api/cycle',auth,b'{}')[0],200)
  finally:server.shutdown();server.server_close();thread.join()
 def test_epub_container(self):
  target=pathlib.Path(self.tmp.name)/'guide.epub';m.export_epub(target)
  import xml.etree.ElementTree as E
  with zipfile.ZipFile(target) as z:
   self.assertEqual(z.namelist()[0],'mimetype');self.assertEqual(z.getinfo('mimetype').compress_type,0)
   for name in z.namelist():
    if name.endswith(('.xml','.opf','.xhtml')):E.fromstring(z.read(name))
if __name__=='__main__':unittest.main()
