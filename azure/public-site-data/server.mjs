import http from 'node:http';
import { requireStaff } from './staff.mjs';
import pg from 'pg';
import { ManagedIdentityCredential } from '@azure/identity';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { readEvents, readCandidates, reviewCandidate, saveHarvest, badRequest } from './events.mjs';

const issuer = 'https://oidc.vercel.com/odiscom-6379s-projects';
const keys = createRemoteJWKSet(new URL(issuer + '/.well-known/jwks'));
const identity = new ManagedIdentityCredential();
const pool = new pg.Pool({
  host: process.env.PUBLIC_SITE_PG_HOST || 'pg-oai-test-ibusbyhjai3di.postgres.database.azure.com',
  database: 'odiscom_production',
  user: process.env.PUBLIC_SITE_PG_ROLE,
  port: 5432,
  ssl: { rejectUnauthorized: true, servername: 'pg-oai-test-ibusbyhjai3di.postgres.database.azure.com' },
  password: async () => (await identity.getToken('https://ossrdbms-aad.database.windows.net/.default')).token,
  max: 4, connectionTimeoutMillis: 20000, statement_timeout: 10000
});
pool.on('error', () => console.error('Public site database connection closed'));

async function requireWebsite(request) {
  const bearer = request.headers.authorization || '';
  if (!bearer.startsWith('Bearer ') || bearer.length > 16384) throw Object.assign(new Error('Unauthorized'), {status: 401});
  try {
    const { payload } = await jwtVerify(bearer.slice(7), keys, {
      issuer, audience: 'https://vercel.com/odiscom-6379s-projects',
      subject: 'owner:odiscom-6379s-projects:project:odiscom-site:environment:production',
      algorithms: ['RS256'], requiredClaims: ['exp','iat','nbf']
    });
    if (payload.owner_id !== 'team_Y2Th0OeBlq4JgKUNBvBaEOvc' || payload.project_id !== 'prj_a9t1XRutTHY0cScOw44bHomER0Dz' || payload.environment !== 'production') throw Error();
  } catch {
    throw Object.assign(new Error('Unauthorized'), {status: 401});
  }
}
async function json(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 2 * 1024 * 1024) throw Object.assign(new Error('Request too large'), {status: 413});
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw badRequest('Invalid JSON'); }
}
http.createServer(async (req,res) => {
  res.setHeader('content-type','application/json');
  res.setHeader('cache-control','no-store');
  try {
    const url = new URL(req.url, 'http://localhost');
    let result;
    if (req.method === 'GET' && url.pathname === '/events') {
      result = await readEvents(pool,url.searchParams);
    } else if(url.pathname === '/staff/candidates' || url.pathname.startsWith('/staff/candidates/')) {
      await requireStaff(req);
      const match = url.pathname.match(/^\/staff\/candidates\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
      if(req.method==='GET' && url.pathname==='/staff/candidates') result={items:await readCandidates(pool,url.searchParams)};
      else if(req.method==='POST' && match) result=await reviewCandidate(pool,match[1],(await json(req)).action);
      else {res.writeHead(404);res.end('{}');return;}
    } else {
      await requireWebsite(req);
      if (req.method === 'POST' && url.pathname === '/harvest') result = await saveHarvest(pool, await json(req));
      else if (req.method === 'GET' && url.pathname === '/candidates') result = await readCandidates(pool, url.searchParams);
      else { res.writeHead(404); res.end('{}'); return; }
    }
    res.end(JSON.stringify(result));
  } catch (error) {
    const status = [400,401,403,413].includes(error.status) ? error.status : 503;
    res.writeHead(status);
    res.end(JSON.stringify({error:status === 503 ? 'Event service unavailable' : error.message}));
    if (status === 503) console.error('Event service failure', error.code || 'unexpected');
  }
}).listen(Number(process.env.PORT || 8080), '0.0.0.0');
