#!/usr/bin/env python3
import argparse,pathlib,shutil,subprocess,sys
root=pathlib.Path(__file__).resolve().parent.parent
p=argparse.ArgumentParser();p.add_argument('extension',choices=['koopman','mathematica','iso']);p.add_argument('--output');a,rest=p.parse_known_args()
subprocess.run([sys.executable,str(root/'tools/verify.py')],check=True)
if a.extension=='koopman':
 args=rest[1:] if rest[:1]==['--'] else rest
 subprocess.run([sys.executable,str(root/'layers/gaia_adaptive_koopman_v1.py'),*args],check=True)
elif a.extension=='mathematica':
 print('wolframscript:',shutil.which('wolframscript') or 'unavailable')
 print('Define AdvancedLiftDictionary[x_List, config_Association], then Get the preserved WL patch. No arbitrary notebook is auto-run.')
else:
 if not a.output: p.error('--output required')
 tool=shutil.which('xorriso')
 if not tool: sys.exit('Install xorriso separately; no disk has been written')
 subprocess.run([tool,'-as','mkisofs','-o',str(pathlib.Path(a.output).resolve()),str(root)],check=True)
