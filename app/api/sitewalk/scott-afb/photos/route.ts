import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'scott-afb-sitewalk';
const SOLICITATION = 'FA440726QJC05';
const MAX_BYTES = 20 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg','image/png','image/webp','image/heic','image/heif']);

function clean(value:string){return value.replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80)||'unknown'}

export async function POST(req:NextRequest){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return NextResponse.json({error:'Photo storage is not configured.'},{status:503});
  try{
    const form=await req.formData();
    const file=form.get('file');
    if(!(file instanceof File))return NextResponse.json({error:'Missing image.'},{status:400});
    if(file.size<=0||file.size>MAX_BYTES)return NextResponse.json({error:'Image must be 20 MB or smaller.'},{status:413});
    const mime=(file.type||'image/jpeg').toLowerCase();
    if(!ALLOWED.has(mime))return NextResponse.json({error:'Unsupported image type.'},{status:415});
    const attendee=String(form.get('attendee')||'');
    const building=String(form.get('building')||'All Buildings');
    const itemId=String(form.get('itemId')||'general');
    const capturedAt=String(form.get('capturedAt')||new Date().toISOString());
    const ext=(file.name.split('.').pop()||mime.split('/').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
    const path=`${clean(building)}/${clean(itemId)}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const bytes=new Uint8Array(await file.arrayBuffer());
    const {error:uploadError}=await supabase.storage.from(BUCKET).upload(path,bytes,{contentType:mime,upsert:false});
    if(uploadError)throw uploadError;
    const {data,error:dbError}=await supabase.from('sitewalk_photos').insert({solicitation:SOLICITATION,attendee,building,item_id:itemId,original_name:file.name,storage_path:path,mime_type:mime,size_bytes:file.size,captured_at:capturedAt}).select('id,storage_path,uploaded_at').single();
    if(dbError){await supabase.storage.from(BUCKET).remove([path]);throw dbError;}
    return NextResponse.json({ok:true,id:data.id,path:data.storage_path,uploadedAt:data.uploaded_at});
  }catch(error){console.error('Scott AFB photo upload failed',error);return NextResponse.json({error:error instanceof Error?error.message:'Upload failed.'},{status:500});}
}
