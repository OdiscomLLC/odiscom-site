import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CALENDAR_URL = "https://natehome.com/events/calendar/";

function text(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#039;|&apos;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 150);
}

function shortHash(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 8);
}

function iso(value: unknown) {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function findLinks(html: string) {
  const links = new Map<string, string>();
  for (const m of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const url = new URL(m[1], CALENDAR_URL).toString();
    if (!url.includes("natehome.com/upcoming-events/")) continue;
    const title = text(m[2]).replace(/\s+-\s+NATE$/i, "");
    if (!title || /^more info$/i.test(title)) continue;
    links.set(url, title);
  }
  return [...links].map(([url, title]) => ({ url, title })).slice(0, 100);
}

function jsonLd(html: string) {
  const out: any[] = [];
  const walk = (v: any) => {
    if (!v || typeof v !== "object") return;
    if (Array.isArray(v)) return v.forEach(walk);
    const type = Array.isArray(v["@type"]) ? v["@type"].join(" ") : String(v["@type"] || "");
    if (/\bEvent\b/i.test(type)) out.push(v);
    Object.values(v).forEach(walk);
  };
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { walk(JSON.parse(m[1])); } catch {}
  }
  return out[0] || null;
}

function loc(v: any) {
  if (!v) return null;
  if (typeof v === "string") return v;
  const parts = [v.name, v.address?.streetAddress, v.address?.addressLocality, v.address?.addressRegion, v.address?.postalCode].filter(Boolean);
  return parts.join(", ") || null;
}

function eventKind(title: string) {
  const s = title.toLowerCase();
  if (/safety|awareness|heat|stress|digging|violence/.test(s)) return "safety";
  if (/golf|social|happy hour|concert|charity|tournament|networking|races|shoot/.test(s)) return "networking";
  return "conference";
}

export async function POST(req: NextRequest) {
  const required = process.env.CRON_SECRET || process.env.NATE_HARVEST_SECRET;
  const provided = req.headers.get("x-cron-secret") || req.nextUrl.searchParams.get("secret");
  if (!required || provided !== required) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 });

  const promote = req.nextUrl.searchParams.get("promote") === "true";
  const html = await fetch(CALENDAR_URL, { cache: "no-store" }).then((r) => r.text());
  const links = findLinks(html);
  const events = [];

  for (const link of links) {
    const detailHtml = await fetch(link.url, { cache: "no-store" }).then((r) => r.ok ? r.text() : "");
    const data = jsonLd(detailHtml);
    const start = iso(data?.startDate);
    if (!data || !start) continue;
    const title = String(data.name || link.title).trim();
    const dateKey = start.slice(0, 10).replace(/-/g, "");
    const eventSlug = `nate-live-${slug(title)}-${dateKey}-${shortHash(link.url)}`;
    events.push({
      title,
      slug: eventSlug,
      source: "nate",
      description: typeof data.description === "string" ? text(data.description) : null,
      location: loc(data.location),
      starts_at: start,
      ends_at: iso(data.endDate),
      url: link.url,
      organizer: loc(data.organizer) || "NATE Industry Calendar",
      event_type: eventKind(title),
      is_featured: /nate unite|fiber connect|connect x|ise expo|bicsi|wireless west/i.test(title),
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const candidates = events.map((e) => ({
    candidate_key: `nate|${e.slug}|${e.url}`,
    title: e.title,
    source: e.source,
    description: e.description,
    location: e.location,
    starts_at: e.starts_at,
    ends_at: e.ends_at,
    url: e.url,
    organizer: e.organizer,
    discovery_url: CALENDAR_URL,
    confidence_score: 0.92,
    confidence_reason: "Harvested from NATE calendar detail page.",
    status: promote ? "promoted" : "queued",
  }));
  if (candidates.length) await supabase.from("event_candidates").upsert(candidates, { onConflict: "candidate_key" });
  if (promote && events.length) await supabase.from("events").upsert(events.map((e) => ({ ...e, category: e.source, link: e.url })), { onConflict: "slug" });

  return NextResponse.json({ ok: true, discovered_links: links.length, harvested_events: events.length, promoted_to_live_events: promote ? events.length : 0 });
}

export async function GET(req: NextRequest) { return POST(req); }
