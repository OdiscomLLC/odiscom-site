import { NextRequest, NextResponse } from "next/server";
import { listEvents } from "@/lib/azure-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const month = req.nextUrl.searchParams.get("month");
  const selectedMonth = month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month)
    ? month : new Date().toISOString().slice(0, 7);
  const sourceParam = req.nextUrl.searchParams.get("source") || "all";
  try {
    const rows = await listEvents(selectedMonth, sourceParam);
    const events = rows.map(({ id, title, slug, source, description, location, starts_at, ends_at, url, organizer }) =>
      ({ id, title, slug, source, description, location, starts_at, ends_at, url, organizer }));
    return NextResponse.json({ events, debug: { selectedMonth, sourceParam, count: events.length } });
  } catch {
    return NextResponse.json({ error: "Event calendar is temporarily unavailable." }, { status: 503 });
  }
}
