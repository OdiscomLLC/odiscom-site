import 'server-only';
import { headers } from 'next/headers';

export interface PublicEvent {
  id: string;
  slug: string;
  title: string;
  source: string;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
  description: string | null;
  category: string | null;
  location: string | null;
  organizer: string | null;
  url: string | null;
}

type Harvest = { events: object[]; candidates: object[] };

async function eventRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const origin = process.env.ODISCOM_PUBLIC_DATA_ORIGIN;
  if (!origin || !/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)?\.azurewebsites\.net$/.test(origin)) {
    throw new Error('Event service is not configured');
  }
  const res = await fetch(origin + path, { ...options, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error('Event service returned ' + res.status);
  return res.json() as Promise<T>;
}

export function listEvents(month: string, source = 'all') {
  return eventRequest<PublicEvent[]>('/events?' + new URLSearchParams({ month, source }));
}

export async function eventBySlug(slug: string) {
  const rows = await eventRequest<PublicEvent[]>('/events?' + new URLSearchParams({ slug }));
  return rows[0] ?? null;
}

async function workloadHeaders() {
  const token = (await headers()).get('x-vercel-oidc-token') || process.env.VERCEL_OIDC_TOKEN;
  if (!token) throw new Error('Website workload identity is unavailable');
  return { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' };
}

export async function saveHarvest(batch: Harvest) {
  return eventRequest<{ published: number; queued: number }>('/harvest', {
    method: 'POST', headers: await workloadHeaders(), body: JSON.stringify(batch)
  });
}
