let previousBlob;
const el=id=>document.getElementById(id);
async function call(path,body){
 const res=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+el('token').value},body:JSON.stringify(body)});
 const obj=await res.json(); if(!res.ok)throw Error(obj.error||'Operation failed'); return obj;
}
for(const button of document.querySelectorAll('button[data-action]'))button.addEventListener('click',async()=>{
 const action=button.dataset.action; button.disabled=true;
 try{
  let result;
  if(action==='ingest')result=await call('/api/ingest',{title:el('title').value,text:el('source').value});
  if(action==='cycle'){
   result=await call('/api/cycle',{}); el('mesh').replaceChildren();
   for(const node of result.mesh.nodes){const p=document.createElement('p');p.textContent=`${node.cluster} / ${node.path} · ${node.bytes} bytes`;el('mesh').append(p);}
  }
  if(action==='memory')result=await call('/api/memory/status',{});
  if(action==='molt'){
   result=await call('/api/molt',{source:el('source').value,use_memory:el('memory').checked});
   // A restrictive CSP lives inside the sandboxed document as well as on the host.
   const policy='<meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;; style-src &#39;unsafe-inline&#39;; img-src data:; form-action &#39;none&#39;; base-uri &#39;none&#39;">';
   const next=URL.createObjectURL(new Blob([policy,result.html],{type:'text/html'}));
   el('preview').src=next;if(previousBlob)URL.revokeObjectURL(previousBlob);previousBlob=next;
   result={sha256:result.sha256,memory_notes:result.memory_notes,preview:'sandboxed'};
  }
  el('receipt').textContent=JSON.stringify(result,null,2);
 }catch(e){el('receipt').textContent=e.message;}finally{button.disabled=false;}
});
