import type { Metadata } from "next"
export const metadata: Metadata = { title: "Careers & Crew Inquiries", alternates: { canonical: "/careers" } }

const openings = [
  {
    title: "OSP Engineer",
    description:
      "Support fiber network planning, route development, utility coordination, and construction-ready documentation.",
  },
  {
    title: "Wireless / Tower Project Support",
    description:
      "Assist with site documentation, upgrade coordination, A&E workflows, and wireless infrastructure delivery support.",
  },
  {
    title: "Construction Delivery Coordinator",
    description:
      "Help align field execution, documentation flow, vendor coordination, and project closeout across active programs.",
  },
]

export default function CareersPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-[#f7fbfb]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f8a84]">
              Careers
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
              Join a team built for telecom infrastructure delivery
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Odiscom supports fiber, tower, wireless, and telecom infrastructure
              programs with practical execution and field-aware delivery. We are
              always interested in professionals who understand how real projects
              move from planning to construction.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1f8a84]">
            Opportunities
          </p>

          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
            Areas where we may be hiring
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            We are especially interested in professionals with telecom
            engineering, fielding, construction coordination, and infrastructure
            delivery experience.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {openings.map((opening) => (
            <div
              key={opening.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f8a84]">
                Opportunity
              </p>

              <h3 className="mt-4 text-2xl font-semibold">{opening.title}</h3>

              <p className="mt-4 leading-8 text-slate-600">
                {opening.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f0f7f7] px-6 py-16 text-center"><h2 className="text-3xl font-semibold">Introduce yourself or your crew.</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">Send your background, location and availability. Engineering professionals, project coordinators and construction crews are welcome to introduce themselves for future opportunities.</p><a href="mailto:info@odiscom.com?subject=Odiscom%20career%20or%20crew%20inquiry" className="mt-7 inline-block rounded-full bg-[#166e68] px-7 py-4 font-semibold text-white">Send a career or crew inquiry</a><p className="mt-5 text-sm text-slate-600">Engineering roles: Odiscom LLC · Construction opportunities: Odiscom Construction LLC</p></section>
    </main>
  )
}