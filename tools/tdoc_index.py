#!/usr/bin/env python3
"""Read-only TDOC identifier inventory. Does not execute discovered artifacts."""
import argparse,hashlib,json,pathlib,re,sys
PAT=re.compile(r"(?i)(?<![a-z0-9])tdoc[-_ ]0*([0-9]{1,6})(?![0-9])")
SKIP={".git","node_modules",".venv","venv","__pycache__","dist","build"}
EXTS={".md",".txt",".json",".yml",".yaml",".sh",".py",".js",".ts",".html",".ini"}
def main():
 p=argparse.ArgumentParser()
 p.add_argument("--root",default=".")
 p.add_argument("--output")
 p.add_argument("--max-bytes",type=int,default=2_000_000)
 args=p.parse_args()
 root=pathlib.Path(args.root).resolve()
 found={}
 scanned=0
 for file in sorted(root.rglob("*")):
  if not file.is_file() or file.is_symlink() or any(x in SKIP for x in file.relative_to(root).parts) or file.suffix.lower() not in EXTS:
   continue
  if file.stat().st_size>args.max_bytes:
   continue
  data=file.read_bytes()
  decoded=data.decode("utf-8",errors="replace")
  scanned+=1
  matches=set()
  for text in [file.name,decoded]:
   matches.update(int(x) for x in PAT.findall(text) if int(x)<=10124)
  if not matches: continue
  relative=file.relative_to(root).as_posix()
  record={"path":relative,"sha256":hashlib.sha256(data).hexdigest(),
          "bytes":len(data),"filename_identifiers":[int(x) for x in PAT.findall(file.name) if int(x)<=10124]}
  for n in matches: found.setdefault(str(n),[]).append(record)
 # References are not proofs of document existence; avoid thousands of synthetic slots.
 evidence=[{"id":int(k),"references":v} for k,v in sorted(found.items(),key=lambda kv:int(kv[0]))]
 report={"schema":"uniomni.tdoc.inventory.v1","range":{"from":0,"through":10124,"slots":10125},
         "scanned_files":scanned,"referenced_identifiers":len(evidence),
         "unreferenced_slots":10125-len(evidence),"records":evidence,
         "notice":"Matches are references or filenames only; document existence, authenticity, execution readiness and chronology remain unverified."}
 serialized=json.dumps(report,indent=2,ensure_ascii=False)
 if args.output: pathlib.Path(args.output).write_text(serialized+"\n",encoding="utf-8")
 else: print(serialized)
 return 0
if __name__=="__main__": sys.exit(main())
