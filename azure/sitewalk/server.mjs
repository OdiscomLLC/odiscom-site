import express from 'express';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { ManagedIdentityCredential } from '@azure/identity';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { makeReport } from './dist/report.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const solicitation = 'FA440726QJC05';
const prefix = '/api/sitewalk/scott-afb';
const tenant = '79f90b95-6503-4e6d-846f-d53845cba3ee';
const issuer = 'https://login.microsoftonline.com/' + tenant + '/v2.0';
const jwks = createRemoteJWKSet(new URL('https://login.microsoftonline.com/' + tenant + '/discovery/v2.0/keys'));
const staff = new Set((process.env.SITEWALK_STAFF_IDS || '').split(',').filter(Boolean));
const clientId = process.env.SITEWALK_AUTH_CLIENT;
const hostname = 'app-odiscom-sitewalk-6egqd4raqxebe.azurewebsites.net';
const identity = new ManagedIdentityCredential();
const db = new pg.Pool({
  host: process.env.SITEWALK_PG_HOST || 'pg-oai-test-ibusbyhjai3di.postgres.database.azure.com',
  ssl: { rejectUnauthorized: true, servername: 'pg-oai-test-ibusbyhjai3di.postgres.database.azure.com' },
  database: 'odiscom_production', user: process.env.SITEWALK_PG_ROLE,
  password: async () => (await identity.getToken('https://ossrdbms-aad.database.windows.net/.default')).token,
  max: 3, statement_timeout: 15000, connectionTimeoutMillis: 20000
});
db.on('error', () => console.error('Sitewalk database connection closed'));
const app = express();
app.disable('x-powered-by');
app.use(async (req,res,next) => {
  res.set({'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});
  try {
    if (!clientId || staff.size !== 5) return res.sendStatus(503);
    const token = req.get('X-MS-TOKEN-AAD-ID-TOKEN');
    if (!token) return res.sendStatus(401);
    const {payload} = await jwtVerify(token, jwks, {issuer, audience:clientId, algorithms:['RS256'], requiredClaims:['exp','tid','oid']});
    if (payload.tid !== tenant || !staff.has(payload.oid)) return res.sendStatus(403);
  } catch { return res.sendStatus(401); }
  if (!['GET','HEAD'].includes(req.method) && req.get('origin') !== 'https://' + hostname) return res.sendStatus(403);
  next();
});
app.get('/staff/connection',async(req,res)=>{
  await db.query('SELECT id FROM public.sitewalk_photos WHERE solicitation=$1 LIMIT 0',[solicitation]);
  await db.query('SELECT device_id FROM public.sitewalk_sessions WHERE solicitation=$1 LIMIT 0',[solicitation]);
  res.json({staffSignIn:'verified',database:'connected'});
});
const calOrigin='https://app-odiscom-public-data-6egqd4raqxebe.azurewebsites.net';
const reviewApi='/api/admin/event-candidates';
async function calendarReview(req,res) {
  const suffix=req.params.id?'/'+req.params.id:'';
  if(suffix && !/^[0-9a-f-]{36}$/i.test(req.params.id)) return res.sendStatus(400);
  const params=new URLSearchParams();
  for(const k of ['status','source','q','limit']) if(typeof req.query[k]==='string') params.set(k,req.query[k]);
  const upstream=await fetch(calOrigin+'/staff/candidates'+suffix+'?'+params,{method:req.method,headers:{Authorization:'Bearer '+req.get('X-MS-TOKEN-AAD-ID-TOKEN'),'Content-Type':'application/json'},body:req.method==='POST'?JSON.stringify({action:req.body?.action}):undefined,redirect:'error',signal:AbortSignal.timeout(30000)});
  res.status(upstream.status).json(await upstream.json());
}
app.get(reviewApi,calendarReview);
app.post(reviewApi+'/:id',express.json({limit:'4kb'}),calendarReview);
app.get('/admin/events',(req,res)=>res.type('html').send('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Event review</title><div id="root"></div><script defer src="/review.js"></script></html>'));
app.get('/review.js',(req,res)=>res.sendFile(path.join(root,'dist/review.js')));
const home = '/sitewalk/scott-afb';
app.get(['/',home], (req,res)=>res.type('html').send('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Odiscom Sitewalk</title><link rel="manifest" href="/sitewalk-scott-afb.webmanifest"></head><body style="margin:0"><div id="root"></div><script defer src="/walk.js"></script></body></html>'));
app.get('/scott-afb-sw.js',(req,res)=>res.type('application/javascript').sendFile(path.join(root,'sw.js')));
app.get('/walk.js',(req,res)=>res.sendFile(path.join(root,'dist/walk.js')));
app.get('/sitewalk-scott-afb.webmanifest',(req,res)=>res.sendFile(path.join(root,'sitewalk-scott-afb.webmanifest')));
function fail(status,message){throw Object.assign(new Error(message),{status});}
function input(value,limit=256){return typeof value==='string' ? value.slice(0,limit) : '';}
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const photoColumns='id,attendee,building,item_id,original_name,mime_type,size_bytes,captured_at,uploaded_at';
const json = express.json({limit:'2mb'});
app.get(prefix+'/state',async(req,res)=>{
  const device=input(req.query.deviceId,120);
  const {rows}=await db.query("SELECT device_id,attendee,building,state,client_updated_at,server_updated_at FROM public.sitewalk_sessions WHERE solicitation=$1 AND ($2='' OR device_id=$2) ORDER BY server_updated_at DESC LIMIT 25",[solicitation,device]);
  res.json({ok:true,sessions:rows});
});
app.put(prefix+'/state',json,async(req,res)=>{
  const device=input(req.body?.deviceId,120), state=req.body?.state, updated=new Date(req.body?.clientUpdatedAt);
  if(!device || !state || typeof state!=='object' || Array.isArray(state) || !Number.isFinite(updated.getTime())) fail(400,'Invalid field session');
  const {rows}=await db.query(`INSERT INTO public.sitewalk_sessions(solicitation, device_id, attendee, building, state, client_updated_at, server_updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,now()) ON CONFLICT (solicitation,device_id) DO UPDATE SET attendee=EXCLUDED.attendee,building=EXCLUDED.building,state=EXCLUDED.state,client_updated_at=EXCLUDED.client_updated_at,server_updated_at=now()
    WHERE sitewalk_sessions.client_updated_at IS NULL OR sitewalk_sessions.client_updated_at <= EXCLUDED.client_updated_at RETURNING server_updated_at`,
    [solicitation,device,input(state.attendee),input(state.building)||'All Buildings',state,updated]);
  if(!rows.length) fail(409,'A newer field session has already been saved');
  res.json({ok:true,serverUpdatedAt:rows[0].server_updated_at});
});
app.get(prefix+'/photos',async(req,res)=>{
  const {rows}=await db.query('SELECT '+photoColumns+' FROM public.sitewalk_photos WHERE solicitation=$1 ORDER BY uploaded_at DESC LIMIT 250',[solicitation]);
  res.json({ok:true,count:rows.length,photos:rows.map(p=>({...p,url:prefix+'/photos/'+p.id}))});
});
app.get(prefix+'/photos/:id',async(req,res)=>{
  if(!uuid.test(req.params.id)) fail(404,'Photo not found');
  const {rows}=await db.query('SELECT image_bytes,mime_type FROM public.sitewalk_photos WHERE solicitation=$1 AND id=$2',[solicitation,req.params.id]);
  if(!rows[0]?.image_bytes) fail(404,'Photo not found');
  res.type(rows[0].mime_type).send(rows[0].image_bytes);
});
const signatures={
 'image/jpeg': b=>b.subarray(0,3).equals(Buffer.from([255,216,255])),
 'image/png': b=>b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
 'image/webp': b=>b.toString('ascii',0,4)==='RIFF' && b.toString('ascii',8,12)==='WEBP',
 'image/heic': b=>b.toString('ascii',4,8)==='ftyp' && /heic|heix|mif1/.test(b.toString('ascii',8,64)),
 'image/heif': b=>b.toString('ascii',4,8)==='ftyp' && /heic|heix|mif1|heif/.test(b.toString('ascii',8,64))
};
app.post(prefix+'/photos',express.raw({type:()=>true,limit:'20mb'}),async(req,res)=>{
  const mime=req.get('content-type')?.split(';')[0], data=req.body;
  if(!Buffer.isBuffer(data)||!data.length||!Object.hasOwn(signatures,mime)||!signatures[mime](data)) fail(415,'Unsupported image type');
  const captured=new Date(input(req.query.capturedAt)); if(!Number.isFinite(captured.getTime())) fail(400,'Invalid capture date');
  const id=randomUUID();
  const {rows}=await db.query(`INSERT INTO public.sitewalk_photos(id,solicitation,attendee,building,item_id,original_name,storage_path,mime_type,size_bytes,captured_at,image_bytes)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING uploaded_at`,[id,solicitation,input(req.query.attendee),input(req.query.building),input(req.query.itemId),input(req.query.name),id,mime,data.length,captured,data]);
  res.status(201).json({ok:true,id,uploadedAt:rows[0].uploaded_at});
});
app.delete(prefix+'/photos',json,async(req,res)=>{
  const ids=req.body?.ids || [req.body?.id];
  if(!Array.isArray(ids)||!ids.length||ids.length>100||ids.some(x=>!uuid.test(x))) fail(400,'Invalid photo selection');
  const {rows}=await db.query('DELETE FROM public.sitewalk_photos WHERE solicitation=$1 AND id=ANY($2::uuid[]) RETURNING id',[solicitation,ids]);
  if(!rows.length) fail(404,'Selected photos were not found');
  res.json({ok:true,deleted:rows.length,ids:rows.map(p=>p.id)});
});
app.post(prefix+'/report',json,async(req,res)=>{
  let state=req.body?.state;
  if(!state){
    const device=input(req.body?.deviceId,120);
    const {rows}=await db.query("SELECT state FROM public.sitewalk_sessions WHERE solicitation=$1 AND ($2='' OR device_id=$2) ORDER BY server_updated_at DESC LIMIT 1",[solicitation,device]);
    state=rows[0]?.state;
  }
  if(!state) fail(404,'No sitewalk data found');
  const {rows}=await db.query('SELECT '+photoColumns+' FROM public.sitewalk_photos WHERE solicitation=$1 ORDER BY captured_at',[solicitation]);
  const pdf=await makeReport(state,rows,async id=>(await db.query('SELECT image_bytes FROM public.sitewalk_photos WHERE solicitation=$1 AND id=$2',[solicitation,id])).rows[0]?.image_bytes);
  res.set('Content-Disposition','attachment; filename="Scott_AFB_Site_Walk_Report_'+new Date().toISOString().slice(0,10)+'.pdf"').type('application/pdf').send(Buffer.from(pdf));
});
app.use((err,req,res,next)=>{
  const status=[400,401,403,404,409,413,415].includes(err.status)?err.status:503;
  if(status===503) console.error('Sitewalk request failed',err.code||err.name);
  res.status(status).json({error:status===503?'Sitewalk service is temporarily unavailable':err.message});
});
app.listen(Number(process.env.PORT||8080),'0.0.0.0');
