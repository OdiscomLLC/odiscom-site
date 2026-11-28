import { eventBySlug } from "@/lib/azure-events";
import { getEventBySlug } from "@/lib/events-data";

function escapeText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/[,;]/g, "\\$&");
}

function stamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function fold(line: string) {
  const lines: string[] = [];
  let part = "";
  let bytes = 0;
  for (const char of line) {
    const size = Buffer.byteLength(char);
    if (bytes + size > 75) {
      lines.push(part);
      part = " ";
      bytes = 1;
    }
    part += char;
    bytes += size;
  }
  return [...lines, part].join("\r\n");
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!file.endsWith(".ics") || file.length > 516) return new Response(null, { status: 404 });
  const slug = file.slice(0, -4);
  if (!slug) return new Response(null, { status: 404 });
  const live = await eventBySlug(slug);
  const old = live ? null : getEventBySlug(slug);
  const event = live || (old && { title: old.title, starts_at: old.startsAt, ends_at: old.endsAt, description: old.description,
    location: [old.location, old.cityState].filter(Boolean).join(", "), url: old.url });
  if (!event?.starts_at) return new Response(null, { status: 404 });
  const start = new Date(event.starts_at);
  const end = event.ends_at ? new Date(event.ends_at) : null;
  const allDay = stamp(start).endsWith("T000000Z") && (!end || stamp(end).endsWith("T000000Z"));
  const dates: string[] = [];
  if (allDay) {
    const exclusiveEnd = new Date(Math.max(start.getTime(), end?.getTime() || 0));
    exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);
    dates.push("DTSTART;VALUE=DATE:" + stamp(start).slice(0,8), "DTEND;VALUE=DATE:" + stamp(exclusiveEnd).slice(0,8));
  } else {
    dates.push("DTSTART:" + stamp(start));
    if (end && end > start) dates.push("DTEND:" + stamp(end));
  }

  const content = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Odiscom//Industry Calendar//EN", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", "UID:" + encodeURIComponent(slug) + "@odiscom.com", "DTSTAMP:" + stamp(new Date()), ...dates,
    "SUMMARY:" + escapeText(event.title), event.description && "DESCRIPTION:" + escapeText(event.description),
    event.location && "LOCATION:" + escapeText(event.location), event.url && /^https?:\/\//i.test(event.url) && "URL:" + event.url.replace(/[\r\n]/g, ""),
    "END:VEVENT", "END:VCALENDAR"
  ].filter((line): line is string => typeof line === "string" && line.length > 0).map(fold).join("\r\n") + "\r\n";
  return new Response(content, {headers: {"Content-Type":"text/calendar; charset=utf-8",
    "Content-Disposition": "attachment; filename=\"odiscom-event.ics\"", "Cache-Control":"public, max-age=300"}});
}
