import { eventBySlug, listEvents } from "./azure-events";

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  starts_at: string;
  created_at?: string;
};

export const getEventBySlug = eventBySlug;

export function parseMonthParam(month?: string) {
  const now = new Date();

  if (!month) {
    return { year: now.getFullYear(), monthIndex: now.getMonth() };
  }

  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) {
    return { year: now.getFullYear(), monthIndex: now.getMonth() };
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    return { year: now.getFullYear(), monthIndex: now.getMonth() };
  }

  return { year, monthIndex };
}

export function addMonths(year: number, monthIndex: number, amount: number) {
  const d = new Date(year, monthIndex + amount, 1);
  return { year: d.getFullYear(), monthIndex: d.getMonth() };
}

export function monthKey(year: number, monthIndex: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function formatMonthTitle(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatTimeRange(startIso: string) {
  const start = new Date(startIso);

  return start.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function eventsForMonth(year: number, monthIndex: number) {
  return listEvents(monthKey(year, monthIndex));
}

export function eventsByDayMap(events: EventItem[]) {
  const map = new Map<string, EventItem[]>();

  for (const event of events) {
    const date = new Date(event.starts_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key)!.push(event);
  }

  return map;
}