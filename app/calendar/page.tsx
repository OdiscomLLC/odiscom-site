import Link from "next/link";

const featuredEvents = [
  {
    title: "NATE UNITE Conference",
    date: "February 23–27, 2026",
    location: "Las Vegas, NV",
  },
  {
    title: "Connect X",
    date: "May 4–7, 2026",
    location: "Fort Lauderdale, FL",
  },
  {
    title: "Fiber Connect",
    date: "May 17–21, 2026",
    location: "Kissimmee, FL",
  },
  {
    title: "ISE EXPO 2026",
    date: "August 18–21, 2026",
    location: "Nashville, TN",
  },
  {
    title: "TXOA Charity Networking Social & Golf Tournament",
    date: "October 21–23, 2026",
    location: "Tulsa, OK",
  },
];

export default function CalendarPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-[#f7fbfb] py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f8a84]">
            Industry Calendar
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Telecom, Fiber & Wireless Industry Events
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Stay current with major telecom, wireless, tower, fiber, broadband,
            and infrastructure industry conferences, networking events, safety
            campaigns, and association meetings.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/nate-industry-calendar.ics"
              className="rounded-full bg-[#1f8a84] px-8 py-4 font-semibold text-white transition hover:bg-[#18716c]"
            >
              Download Calendar (.ICS)
            </a>

            <Link
              href="/contact"
              className="rounded-full border border-slate-300 px-8 py-4 font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Contact Odiscom
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredEvents.map((event) => (
              <div
                key={event.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="inline-flex rounded-full bg-[#e8f6f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#1f8a84]">
                  Featured Event
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  {event.title}
                </h2>

                <p className="mt-4 text-base text-slate-600">
                  {event.date}
                </p>

                <p className="mt-2 text-base text-slate-500">
                  {event.location}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-slate-200 bg-[#f8fbfb] p-10">
            <h3 className="text-2xl font-semibold tracking-tight">
              Full 2026–2030 Event Feed
            </h3>

            <p className="mt-4 max-w-3xl leading-8 text-slate-600">
              The downloadable calendar feed includes NATE UNITE events,
              BICSI conferences, TXOA networking events, Fiber Connect,
              Connect X, wireless association meetings, safety campaigns,
              golf tournaments, and additional infrastructure industry events.
            </p>

            <a
              href="/nate-industry-calendar.ics"
              className="mt-8 inline-flex rounded-full bg-slate-900 px-7 py-4 font-semibold text-white transition hover:bg-slate-700"
            >
              Download Full Calendar Feed
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
