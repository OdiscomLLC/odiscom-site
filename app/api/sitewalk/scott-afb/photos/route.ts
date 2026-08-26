import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET='scott-afb-sitewalk';
const SOLICITATION='FA440726QJC05';
const MAX_BYTES=20*1024*1024;
const ALLOWED=new Set(['image/jpeg','image/png','image/webp','image/heic','image/heif']);
function clean(v:string){return v.replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80)||'unknown'}
function client(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return null;return {url,supabase:createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}}

// Small JSON request only. Returns a short-lived signed upload token; image bytes never pass through Vercel.
export async function POST(req:NextRequest){
 const c=client();if(!c)return NextResponse.json({error:'Photo storage is not configured.'},{status:503});
 try{
  const body=await req.json();const name=String(body.name||'photo.jpg'),mime=String(body.mime||'image/jpeg').toLowerCase(),size=Number(body.size||0),attendee=String(body.attendee||''),building=String(body.building||'All Buildings'),itemId=String(body.itemId||'general'),capturedAt=String(body.capturedAt||new Date().toISOString());
  if(size<=0||size>MAX_BYTES)return NextResponse.json({error:'Image must be 20 MB or smaller.'},{status:413});
  if(!ALLOWED.has(mime))return NextResponse.json({error:'Unsupported image type.'},{status:415});
  const ext=(name.split('.').pop()||mime.split('/').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
  const path=`${clean(building)}/${clean(itemId)}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const {data,error}=await c.supabase.storage.from(BUCKET).createSignedUploadUrl(path);if(error)throw error;
  return NextResponse.json({ok:true,path,token:data.token,supabaseUrl:c.url,meta:{solicitation:SOLICITATION,attendee,building,itemId,originalName:name,mime,size,capturedAt}});
 }catch(e){console.error('Create signed sitewalk upload failed',e);return NextResponse.json({error:e instanceof Error?e.message:'Could not authorize upload.'},{status:500})}
}

// Called after direct Storage upload to persist searchable report metadata.
export async function PUT(req:NextRequest){
 const c=client();if(!c)return NextResponse.json({error:'Photo storage is not configured.'},{status:503});
 try{
  const b=await req.json();
  const row={solicitation:SOLICITATION,attendee:String(b.attendee||''),building:String(b.building||'All Buildings'),item_id:String(b.itemId||'general'),original_name:String(b.originalName||''),storage_path:String(b.path||''),mime_type:String(b.mime||''),size_bytes:Number(b.size||0),captured_at:String(b.capturedAt||new Date().toISOString())};
  if(!row.storage_path)return NextResponse.json({error:'Missing storage path.'},{status:400});
  const {data,error}=await c.supabase.from('sitewalk_photos').insert(row).select('id,storage_path,uploaded_at').single();if(error)throw error;
  return NextResponse.json({ok:true,id:data.id,path:data.storage_path,uploadedAt:data.uploaded_at});
 }catch(e){console.error('Record sitewalk photo failed',e);return NextResponse.json({error:e instanceof Error?e.message:'Could not record photo.'},{status:500})}
}
