const eventFields = ['slug', 'title', 'source', 'description', 'location', 'starts_at', 'ends_at', 'url', 'organizer', 'category', 'link', 'event_type', 'is_featured'];
const candidateFields = ['candidate_key', 'title', 'source', 'description', 'location', 'starts_at', 'ends_at', 'url', 'organizer', 'discovery_url', 'confidence_score', 'confidence_reason', 'status'];
const publicColumns = ['id','created_at', ...eventFields].join(', ');
const reviewColumns = ['id','created_at','updated_at', ...candidateFields].join(', ');

export function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

export async function readEvents(db, query) {
  const slug = query.get('slug');
  if (slug !== null) {
    if (!slug || slug.length > 512) throw badRequest('Invalid slug');
    const result = await db.query('SELECT ' + publicColumns + ' FROM public.events WHERE slug=$1', [slug]);
    return result.rows;
  }
  const month = query.get('month');
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month ?? '') || month.startsWith('0000')) throw badRequest('Invalid month');
  const source = query.get('source') || 'all';
  const start = month + '-01T00:00:00Z';
  const result = await db.query(
    'SELECT ' + publicColumns + ' FROM public.events WHERE starts_at >= $1::timestamptz AND starts_at < ($1::timestamptz + interval \'1 month\') AND ($2 = \'all\' OR source=$2) ORDER BY starts_at, id',
    [start, source]
  );
  return result.rows;
}

export async function readCandidates(db, query) {
  const limit = Number(query.get('limit') ?? 100);
  if (!Number.isInteger(limit) || limit < 0) throw badRequest('Invalid limit');
  const result = await db.query(
    'SELECT ' + reviewColumns + ' FROM public.event_candidates WHERE ($1 = \'all\' OR status=$1) AND ($2 = \'all\' OR source=$2) AND ($3 = \'\' OR strpos(lower(concat_ws(\' \',title,description,location,organizer)),lower($3))>0) ORDER BY confidence_score DESC, starts_at ASC NULLS LAST, id LIMIT $4',
    [query.get('status') || 'all', query.get('source') || 'all', query.get('q')?.trim() || '', Math.min(limit,250)]
  );
  return result.rows;
}

async function upsertRows(client, table, fields, rows) {
  const [key] = fields;
  for (const row of rows) {
    if (!row || typeof row !== 'object' || typeof row[key] !== 'string' || !row[key] || !row.title) throw badRequest('Invalid event record');
    const keys = fields.filter(field => Object.hasOwn(row, field));
    const values = keys.map(field => row[field]);
    const params = keys.map((_, index) => '$' + (index + 1));
    const changes = keys.filter(field => field !== key).map(field => field + '=EXCLUDED.' + field);
    // Both the table and the column names come from the fixed lists above.
    await client.query('INSERT INTO public.' + table + ' (' + keys.join(',') + ') VALUES (' + params.join(',') + ') ON CONFLICT (' + key + ') DO UPDATE SET ' + changes.join(','), values);
  }
}

export async function saveHarvest(pool, body) {
  if (!Array.isArray(body?.events) || !Array.isArray(body?.candidates) || body.events.length + body.candidates.length > 1000) throw badRequest('Invalid harvest');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await upsertRows(client, 'events', eventFields, body.events);
    await upsertRows(client, 'event_candidates', candidateFields, body.candidates);
    await client.query('COMMIT');
    return { published: body.events.length, queued: body.candidates.length };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
