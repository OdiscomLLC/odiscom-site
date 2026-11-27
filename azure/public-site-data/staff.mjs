import { createRemoteJWKSet, jwtVerify } from 'jose';
const tenant = '79f90b95-6503-4e6d-846f-d53845cba3ee';
const keys = createRemoteJWKSet(new URL('https://login.microsoftonline.com/' + tenant + '/discovery/v2.0/keys'));
export async function requireStaff(req) {
  try {
    const token = req.headers.authorization?.match(/^Bearer (\S+)$/)?.[1];
    const ids = new Set((process.env.EVENT_REVIEWER_IDS || '').split(',').filter(Boolean));
    const audience = process.env.EVENT_REVIEW_CLIENT;
    if (!token || !audience || ids.size !== 5) throw Error();
    const {payload} = await jwtVerify(token, keys, {issuer:'https://login.microsoftonline.com/'+tenant+'/v2.0',audience,algorithms:['RS256'],requiredClaims:['exp','tid','oid']});
    if(payload.tid !== tenant || !ids.has(payload.oid)) throw Error();
  } catch { throw Object.assign(new Error('Unauthorized'),{status:401}); }
}
