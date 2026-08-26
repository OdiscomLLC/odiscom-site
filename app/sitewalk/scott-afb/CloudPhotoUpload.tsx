'use client';
import {useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';
const ids=['general','access1','access2','access3','carrier1','carrier2','carrier3','carrier4','carrier5','mdf1','mdf2','mdf3','mdf4','mdf5','fiber1','fiber2','fiber3','fiber4','fiber5','fiber6','idf1820a','idf1820b','idf1830a','idf1830b','idf1850a','idf1850b','idf7','idf8','wifi1','wifi2','wifi3','wifi4','wifi5','wifi6','cable1','cable2','cable3','cable4','power1','power2','power3','power4','ops1','ops2','ops3','ops4','ops5','sla1','sla2','sla3','q1','q2','q3','q4','q5','q6','q7','q8','evidence1','evidence2','evidence3'];
export default function CloudPhotoUpload(){
 const [msg,setMsg]=useState('Ready for field photos');const [count,setCount]=useState(0);const [bad,setBad]=useState(false);
 useEffect(()=>{const h=async(ev:Event)=>{const input=ev.target as HTMLInputElement;if(input?.type!=='file'||!input.accept.includes('image'))return;const file=input.files?.[0];if(!file)return;
  const all=Array.from(document.querySelectorAll<HTMLInputElement>('input[type="file"][accept*="image"]'));const itemId=ids[Math.max(0,all.indexOf(input))]||'general';const attendee=(document.querySelector('input[placeholder="Bruce / attendee name"]') as HTMLInputElement|null)?.value||'';const building=(document.querySelector('select') as HTMLSelectElement|null)?.value||'All Buildings';const capturedAt=new Date().toISOString();const mime=(file.type||'image/jpeg').toLowerCase();
  setBad(false);setMsg('Authorizing cloud upload…');
  try{
   const auth=await fetch('/api/sitewalk/scott-afb/photos',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:file.name||'photo.jpg',mime,size:file.size,itemId,attendee,building,capturedAt})});const a=await auth.json().catch(()=>({}));if(!auth.ok)throw new Error(a.error||`Authorization failed (${auth.status})`);
   const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!key)throw new Error('Public cloud upload configuration is missing.');
   setMsg('Uploading photo directly to cloud…');
   const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
   const {error:uploadError}=await supabase.storage.from('scott-afb-sitewalk').uploadToSignedUrl(a.path,a.token,file,{contentType:mime});if(uploadError)throw uploadError;
   setMsg('Saving photo details…');
   const meta=await fetch('/api/sitewalk/scott-afb/photos',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({path:a.path,attendee,building,itemId,originalName:file.name||'photo.jpg',mime,size:file.size,capturedAt})});const m=await meta.json().catch(()=>({}));if(!meta.ok)throw new Error(m.error||`Photo uploaded but metadata failed (${meta.status})`);
   setCount(n=>n+1);setMsg('✓ Photo saved to Odiscom cloud');
  }catch(e){setBad(true);setMsg(`⚠ ${e instanceof Error?e.message:'Upload failed - photo remains on phone'}`)}
 };document.addEventListener('change',h,true);return()=>document.removeEventListener('change',h,true)},[]);
 return <div style={{position:'fixed',right:12,bottom:12,zIndex:9999,maxWidth:330,padding:'10px 12px',borderRadius:12,background:bad?'#8f1d14':'#0b1f3a',color:'#fff',boxShadow:'0 4px 18px #0004',fontFamily:'Arial,sans-serif',fontSize:13}}><b>☁ Odiscom Cloud</b><div style={{marginTop:3}}>{msg}</div><div style={{fontSize:11,opacity:.8,marginTop:2}}>{count} uploaded this session</div></div>
}
