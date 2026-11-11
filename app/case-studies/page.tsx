import type { Metadata } from "next";
import Link from "next/link";
import BottomCta from "@/components/BottomCta";
import { projectExperience } from "@/lib/project-experience";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Fiber, DAS & Telecom Project Experience",
  description: "Odiscom project scopes with AmeriCloud, TDS, Zayo, Horrocks, Stratis, SQUAN and D4 Communications: DAS, OSP engineering, site acquisition and fiber facilities.",
  alternates: { canonical: "/case-studies" },
};

export default function ProjectExperiencePage() {
  return <main className="bg-white text-slate-900">
    <section className="border-b border-slate-200 bg-[#f7fbfb]"><div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#166e68]">Selected project experience</p>
      <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">The work behind our capabilities.</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">A closer look at Odiscom LLC’s engineering, DAS, site-acquisition and drawing-production scopes. Our experience includes direct operator engagements and work through engineering and construction partners.</p>
      <a href="/Odiscom_Wireline_Fiber_Capability_Sheet.pdf" className="mt-8 inline-block rounded-full bg-[#166e68] px-6 py-3 font-semibold text-white">Download wireline & fiber capabilities</a>
    </div></section>
    <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-2 lg:px-8">
      {projectExperience.map(project => <article key={project.client} className="flex flex-col rounded-3xl border border-slate-200 p-7 md:p-9">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#166e68]">{project.category}</p>
        <h2 className="mt-4 text-3xl font-semibold">{project.client}</h2>
        <p className="mt-2 text-sm text-slate-500">{project.location}</p>
        <h3 className="mt-6 text-xl font-semibold">{project.title}</h3>
        <p className="mt-4 leading-7 text-slate-600">{project.summary}</p>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Odiscom’s scope</p>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-700">{project.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
        {"detailHref" in project && <Link href={project.detailHref} className="mt-6 inline-block font-semibold text-[#166e68]">View AmeriCloud DAS projects →</Link>}
        <div className="mt-7 flex flex-wrap gap-2 border-t border-slate-200 pt-5">{project.services.map(slug => <Link key={slug} href={`/services/${slug}`} className="rounded-full bg-[#f0f7f7] px-4 py-2 text-sm font-medium text-[#166e68]">{services[slug].name}</Link>)}</div>
      </article>)}
    </section>
    <BottomCta title="Have a similar project or production need?" description="Send the scope and schedule to Bret. We’ll connect your project with the right Odiscom team." />
  </main>;
}
