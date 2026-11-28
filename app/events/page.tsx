"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import conferences from "@/lib/industry-conferences.json";
import { useRouter, useSearchParams } from "next/navigation";

type SourceName = "all" | "nate" | "wia" | "fiberconnect" | "scte" | "mountainconnect" | "eventbrite" | "other";
type ViewMode = "month" | "agenda";

type EventRow = {
  id: string;
  title: string;
  slug: string;
  source: Exclude<SourceName, "all">;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  url: string | null;
  organizer: string | null;
};

const SOURCE_LABELS: Record<SourceName, string> = {
  all: "All",
  nate: "NATE",
  wia: "WIA",
  fiberconnect: "Fiber Connect",
  scte: "SCTE",
  mountainconnect: "Mountain Connect",
  eventbrite: "Eventbrite",
  other: "Other",
};

const SOURCE_BADGES: Record<Exclude<SourceName, "all">, string> = {
  nate: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  wia: "bg-sky-50 text-sky-700 ring-sky-200",
  fiberconnect: "bg-amber-50 text-amber-700 ring-amber-200",
  scte: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  mountainconnect: "bg-purple-50 text-purple-700 ring-purple-200",
  eventbrite: "bg-orange-50 text-orange-700 ring-orange-200",
  other: "bg-slate-100 text-slate-700 ring-slate-200",
};

const SOURCE_TILE_BORDERS: Record<Exclude<SourceName, "all">, string> = {
  nate: "border-l-emerald-500",
  wia: "border-l-sky-500",
  fiberconnect: "border-l-amber-500",
  scte: "border-l-indigo-500",
  mountainconnect: "border-l-purple-500",
  eventbrite: "border-l-orange-500",
  other: "border-l-slate-400",
};

const ALLOWED_SOURCES: SourceName[] = [
  "all",
  "nate",
  "wia",
  "fiberconnect",
  "scte",
  "mountainconnect",
  "eventbrite",
  "other",
];

function decodeHtmlEntities(input: string) {
  if (typeof window === "undefined") return input;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthEnd(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function fmtMonthInput(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function fmtHumanMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function fmtDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function fmtTime(value: string) {
  const date = new Date(value);
  if (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0
  ) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function dayKey(date: Date) {
  return fmtMonthInput(date) + "-" + String(date.getDate()).padStart(2, "0");
}

function getCalendarCells(viewDate: Date) {
  const start = monthStart(viewDate);
  const end = monthEnd(viewDate);

  const firstGridDay = new Date(start);
  firstGridDay.setDate(start.getDate() - start.getDay());

  const lastGridDay = new Date(end);
  lastGridDay.setDate(end.getDate() + (6 - end.getDay()));

  const days: Date[] = [];
  const cursor = new Date(firstGridDay);

  while (cursor <= lastGridDay) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function sortEvents(events: EventRow[]) {
  return [...events].sort((a, b) => {
    const aTime = new Date(a.starts_at).getTime();
    const bTime = new Date(b.starts_at).getTime();
    return aTime - bTime;
  });
}

// The feeds use midnight UTC for dates without a start time.
function displayDate(value: string) {
  const date = new Date(value);
  if (fmtTime(value)) return date;
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12);
}

function getDateRangeText(event: EventRow) {
  const start = displayDate(event.starts_at);
  const end = event.ends_at ? displayDate(event.ends_at) : null;

  const startText = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(start);

  if (!end) return startText;

  const endText = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(end);

  return startText === endText ? startText : `${startText} – ${endText}`;
}

function formatFullDate(event: EventRow) {
  const start = displayDate(event.starts_at);
  const end = event.ends_at ? displayDate(event.ends_at) : null;

  const startText = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(start);

  if (!end) {
    const time = fmtTime(event.starts_at);
    return time ? `${startText} • ${time}` : startText;
  }

  const endText = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(end);

  return startText === endText ? startText : `${startText} – ${endText}`;
}

function buildMonthHref(month: string, source: SourceName, view: ViewMode) {
  return `/events?month=${month}&source=${source}&view=${view}`;
}

function EventModal({
  event,
  onClose,
}: {
  event: EventRow | null;
  onClose: () => void;
}) {
  if (!event) return null;

  const decodedTitle = decodeHtmlEntities(event.title);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                SOURCE_BADGES[event.source]
              }`}
            >
              {SOURCE_LABELS[event.source]}
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">
              {decodedTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </div>
            <div className="mt-1 text-sm text-slate-900">
              {formatFullDate(event)}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Location
            </div>
            <div className="mt-1 text-sm text-slate-900">
              {event.location || "Not listed"}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Organizer
            </div>
            <div className="mt-1 text-sm text-slate-900">
              {event.organizer || SOURCE_LABELS[event.source]}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Link
            </div>
            <div className="mt-1 text-sm">
              {event.url ? (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-emerald-700 hover:text-emerald-800"
                >
                  Open event page
                </a>
              ) : (
                <span className="text-slate-900">Not available</span>
              )}
            </div>
          </div>
        </div>

        {event.slug && <a href={`/api/events/${encodeURIComponent(event.slug)}.ics`} download className="mt-5 inline-block rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
          Add to my calendar
        </a>}
        {event.description ? (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
              {decodeHtmlEntities(event.description)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function subscribeToScreenSize(update: () => void) {
  const query = window.matchMedia("(max-width: 639px)");
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}

function EventsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedMonth =
    searchParams.get("month") && /^(?!0000)\d{4}-(0[1-9]|1[0-2])$/.test(searchParams.get("month") || "")
      ? (searchParams.get("month") as string)
      : fmtMonthInput(new Date());

  const selectedSource: SourceName = ALLOWED_SOURCES.includes(
    (searchParams.get("source") || "all") as SourceName
  )
    ? ((searchParams.get("source") || "all") as SourceName)
    : "all";

  const smallScreen = useSyncExternalStore(subscribeToScreenSize,
    () => window.matchMedia("(max-width: 639px)").matches, () => false);
  const view = searchParams.get("view");
  const selectedView: ViewMode = view === "agenda" || view === "month" ? view : smallScreen ? "agenda" : "month";

  const [events, setEvents] = useState<EventRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<EventRow | null>(null);
  const [expandedDay, setExpandedDay] = useState("");
  const [search, setSearch] = useState("");

  const viewDate = useMemo(
    () => new Date(`${selectedMonth}-01T12:00:00`),
    [selectedMonth]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/events?month=${selectedMonth}`,
          { cache: "no-store" }
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error || "Failed to load events.");
        }

        if (!cancelled) {
          const rows: EventRow[] = Array.isArray(json.events) ? json.events : [];
          setEvents(sortEvents(rows.map(row => ({
            ...row, source: Object.hasOwn(SOURCE_BADGES, row.source) ? row.source : "other"
          }))));
        }
      } catch (err) {
        if (!cancelled) {
          setEvents([]);
          setError(err instanceof Error ? err.message : "Failed to load events.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [selectedMonth]);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;

    return events.filter((event) => {
      const haystack = [
        event.title,
        event.description || "",
        event.location || "",
        event.organizer || "",
        event.source,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [events, search]);

  const filteredEvents = selectedSource === "all" ? searchResults : searchResults.filter(event => event.source === selectedSource);
  const today = dayKey(new Date());
  const featured = conferences.events.filter(event => event.ends_at.slice(0,10) >= today);

  const prevMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
  const nextMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
  const days = getCalendarCells(viewDate);

  const eventsByDay = new Map<string, EventRow[]>();
  for (const event of filteredEvents) {
    const key = dayKey(displayDate(event.starts_at));
    const list = eventsByDay.get(key) || [];
    list.push(event);
    eventsByDay.set(key, list);
  }

  const upcoming = filteredEvents.filter(event => dayKey(displayDate(event.ends_at || event.starts_at)) >= today).slice(0, 10);

  const countsBySource = searchResults.reduce<Record<SourceName, number>>(
    (acc, event) => {
      acc.all += 1;
      acc[event.source] += 1;
      return acc;
    },
    { all: 0, nate: 0, wia: 0, fiberconnect: 0, scte: 0, mountainconnect: 0, eventbrite: 0, other: 0 }
  );

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Odiscom Industry Events
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Telecom conference and association calendar
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Find conferences, workshops, and association events for wireless infrastructure and fiber broadband.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search events in the selected month"
                placeholder="Search by event, location, or organizer"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-emerald-300"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {ALLOWED_SOURCES.filter(source => source === "all" || source === selectedSource || countsBySource[source] > 0).map((source) => {
                const active = source === selectedSource;
                return (
                  <Link
                    key={source}
                    href={buildMonthHref(selectedMonth, source, selectedView)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>{SOURCE_LABELS[source]}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        active ? "bg-white/20 text-white" : "bg-white text-slate-600"
                      }`}
                    >
                      {countsBySource[source]}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Jump to month
                <input type="month" value={selectedMonth} onChange={e => {
                  if (/^(?!0000)\d{4}-(0[1-9]|1[0-2])$/.test(e.target.value)) router.push(buildMonthHref(e.target.value,selectedSource,selectedView));
                }} className="ml-2 rounded-lg border border-slate-200 px-2 py-1" />
              </label>
              <Link
                href={buildMonthHref(selectedMonth, selectedSource, "month")}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  selectedView === "month"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                Month
              </Link>
              <Link
                href={buildMonthHref(selectedMonth, selectedSource, "agenda")}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  selectedView === "agenda"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                Agenda
              </Link>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-5 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <Link
                href={buildMonthHref(fmtMonthInput(prevMonth), selectedSource, selectedView)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ← Previous
              </Link>

              <div className="text-center">
                <h2 className="text-2xl font-semibold text-slate-900">
                  {fmtHumanMonth(viewDate)}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {loading ? "Loading..." : `${filteredEvents.length} events`}
                </p>
              </div>

              <Link
                href={buildMonthHref(fmtMonthInput(nextMonth), selectedSource, selectedView)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Next →
              </Link>
            </div>

            {selectedView === "month" ? (
              <>
                <div className="grid grid-cols-7 overflow-hidden rounded-t-3xl border border-b-0 border-slate-200 bg-slate-50">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
                    <div
                      key={label}
                      className="border-r border-slate-200 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 last:border-r-0"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 overflow-hidden rounded-b-3xl border border-slate-200 bg-white shadow-sm">
                  {days.map((date) => {
                    const key = dayKey(date);
                    const dayEvents = eventsByDay.get(key) || [];
                    const inMonth = isSameMonth(date, viewDate);
                    const visibleEvents = expandedDay === key ? dayEvents : dayEvents.slice(0, 3);
                    const hiddenCount = Math.max(dayEvents.length - visibleEvents.length, 0);

                    return (
                      <div
                        key={key}
                        className="min-h-[155px] border-r border-t border-slate-200 p-2 transition hover:bg-slate-50 last:border-r-0"
                      >
                        <div
                          className={`mb-2 flex items-center justify-between ${
                            inMonth ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          <span className="text-sm font-semibold">{date.getDate()}</span>
                          {dayEvents.length ? (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                              {dayEvents.length}
                            </span>
                          ) : null}
                        </div>

                        <div className="space-y-2">
                          {visibleEvents.map((event) => (
                            <button
                              key={event.id}
                              type="button"
                              onClick={() => setActiveEvent(event)}
                              className={`block w-full rounded-xl border border-slate-200 border-l-4 p-2 text-left text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow ${SOURCE_TILE_BORDERS[event.source]}`}
                            >
                              <div
                                className={`mb-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${
                                  SOURCE_BADGES[event.source]
                                }`}
                              >
                                {SOURCE_LABELS[event.source]}
                              </div>
                              <div className="line-clamp-2 font-semibold text-slate-800">
                                {decodeHtmlEntities(event.title)}
                              </div>
                              {event.location ? (
                                <div className="mt-1 line-clamp-1 text-slate-500">
                                  {decodeHtmlEntities(event.location)}
                                </div>
                              ) : null}
                            </button>
                          ))}

                          {hiddenCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => setExpandedDay(key)}
                              className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                            >
                              +{hiddenCount} more
                            </button>
                          ) : null}

                          {!dayEvents.length && inMonth ? (
                            <div className="rounded-xl border border-dashed border-slate-200 px-2 py-3 text-center text-[11px] text-slate-300">
                              —
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="h-3 w-24 rounded bg-slate-100" />
                      <div className="mt-3 h-5 w-3/4 rounded bg-slate-100" />
                      <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
                    </div>
                  ))
                ) : filteredEvents.length ? (
                  filteredEvents.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setActiveEvent(event)}
                      className={`block w-full rounded-3xl border border-slate-200 border-l-4 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow ${SOURCE_TILE_BORDERS[event.source]}`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ${
                            SOURCE_BADGES[event.source]
                          }`}
                        >
                          {SOURCE_LABELS[event.source]}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {formatFullDate(event)}
                        </span>
                      </div>

                      <div className="mt-3 text-lg font-semibold text-slate-900">
                        {decodeHtmlEntities(event.title)}
                      </div>

                      {event.location ? (
                        <div className="mt-2 text-sm text-slate-500">
                          {decodeHtmlEntities(event.location)}
                        </div>
                      ) : null}

                      {event.description ? (
                        <div className="mt-3 line-clamp-2 text-sm text-slate-600">
                          {decodeHtmlEntities(event.description)}
                        </div>
                      ) : null}
                    </button>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                    No events found for this month and filter.
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Upcoming this month</h3>

            </div>

            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 p-4">
                    <div className="h-3 w-20 rounded bg-slate-100" />
                    <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
                  </div>
                ))
              ) : upcoming.length ? (
                upcoming.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setActiveEvent(event)}
                    className={`block w-full rounded-2xl border border-slate-200 border-l-4 p-4 text-left transition hover:-translate-y-0.5 hover:shadow ${SOURCE_TILE_BORDERS[event.source]}`}
                  >
                    <div
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ${
                        SOURCE_BADGES[event.source]
                      }`}
                    >
                      {SOURCE_LABELS[event.source]}
                    </div>
                    <div className="mt-2 line-clamp-2 font-semibold text-slate-900">
                      {decodeHtmlEntities(event.title)}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {getDateRangeText(event)}
                      {fmtTime(event.starts_at) ? ` • ${fmtTime(event.starts_at)}` : ""}
                    </div>
                    {event.location ? (
                      <div className="mt-1 text-sm text-slate-500">
                        {decodeHtmlEntities(event.location)}
                      </div>
                    ) : null}
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                  No upcoming events match this month and filter.
                </div>
              )}
            </div>
            {featured.length > 0 && <section className="mt-7 border-t border-slate-200 pt-5">
              <h3 className="text-lg font-semibold text-slate-900">Industry conferences to plan for</h3>
              <ul className="mt-3 space-y-3">{featured.map(event => <li key={event.slug}>
                <Link href={`/events/${event.slug}`} className="font-semibold text-emerald-700 hover:underline">{event.title}</Link>
                <p className="text-sm text-slate-600">{displayDate(event.starts_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})} · {event.location}</p>
              </li>)}</ul>
            </section>}
          </aside>
        </div>
      </div>

      <EventModal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </>
  );
}

function EventsPageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-4 w-40 rounded bg-slate-100" />
        <div className="mt-4 h-10 w-2/3 rounded bg-slate-100" />
        <div className="mt-8 h-24 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsPageFallback />}>
      <EventsPageInner />
    </Suspense>
  );
}