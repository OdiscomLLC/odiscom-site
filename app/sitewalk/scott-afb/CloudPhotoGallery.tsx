'use client';
import {useState} from 'react';
type Photo={id:string;attendee:string;building:string;item_id:string;original_name:string;mime_type:string;size_bytes:number;captured_at:string;uploaded_at:string;url:string|null};
export default function CloudPhotoGallery(){
 const [open,setOpen]=useState(false),[loading,setLoading]=useState(false),[photos,setPhotos]=useState<Photo[]>([]),[error,setError]=useState('');
 async function load(){setOpen(true);setLoading(true);setError('');try{const r=await fetch('/api/sitewalk/scott-afb/photos',{cache:'no-store'});const j=await r.json();if(!r.ok)throw new Error(j.error||'Could not retrieve photos');setPhotos(j.photos||[])}catch(e){setError(e instanceof Error?e.message:'Could not retrieve photos')}finally{setLoading(false)}}
 return <>
  <button onClick={load} style={{position:'fixed',left:12,bottom:68,zIndex:9998,border:0,borderRadius:12,padding:'12px 16px',background:'#0b1f3a',color:'#fff',fontWeight:700,fontSize:15,boxShadow:'0 4px 18px #0004'}}>📷 Cloud Photos</button>
  {open&&<div style={{position:'fixed',inset:0,zIndex:10000,background:'#0009',padding:12,overflow:'auto'}} onClick={()=>setOpen(false)}>
   <div onClick={e=>e.stopPropagation()} style={{maxWidth:900,margin:'30px auto',background:'#f7f9fc',borderRadius:16,padding:16,color:'#10213a'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:14}}><div><b style={{fontSize:22}}>📷 Scott AFB Cloud Photos</b><div style={{fontSize:13,opacity:.7}}>FA440726QJC05 · private Odiscom storage</div></div><button onClick={()=>setOpen(false)} style={{fontSize:24,border:0,background:'transparent'}}>✕</button></div>
    <button onClick={load} style={{padding:'8px 12px',marginBottom:12}}>↻ Refresh</button>
    {loading&&<p>Retrieving cloud photos…</p>}{error&&<p style={{color:'#9b1c14'}}>{error}</p>}
    {!loading&&!error&&photos.length===0&&<p>No cloud photos yet.</p>}
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>{photos.map(p=><a key={p.id} href={p.url||'#'} target="_blank" rel="noreferrer" style={{display:'block',textDecoration:'none',color:'inherit',background:'#fff',border:'1px solid #d9e0e8',borderRadius:12,overflow:'hidden'}}>{p.url&&<img src={p.url} alt={p.original_name||'Site walk photo'} style={{width:'100%',height:180,objectFit:'cover',display:'block'}}/>}<div style={{padding:10,fontSize:13}}><b>{p.building||'All Buildings'} · {p.item_id}</b><div>{new Date(p.captured_at||p.uploaded_at).toLocaleString()}</div>{p.attendee&&<div>Field rep: {p.attendee}</div>}<div style={{opacity:.65,marginTop:3}}>{p.original_name} · {(Number(p.size_bytes||0)/1048576).toFixed(1)} MB</div></div></a>)}</div>
   </div>
  </div>}
 </>
}
