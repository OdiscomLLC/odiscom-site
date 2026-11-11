import type { Metadata } from "next";
import Link from "next/link";
import ProjectGallery from "@/components/ProjectGallery";
import { socialMetadata } from "@/lib/social-metadata";
import BottomCta from "@/components/BottomCta";
import { americloudProjects } from "@/lib/americloud-projects";

export const metadata: Metadata = socialMetadata("AmeriCloud DAS & In-Building Wireless Projects", "Odiscom A&E through AmeriCloud: Fremont municipal DAS, Mercedes-Benz R&D, Washington State DOC headquarters and Miami Ericsson Radio Dot engineering.", "/case-studies/americloud-das", "das");

export default function AmericloudDasPage() {
  return <main className="bg-white text-slate-900">
    <section className="border-b border-slate-200 bg-[#f7fbfb]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <Link href="/case-studies" className="text-sm font-semibold text-[#166e68]">Project experience / AmeriCloud</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[#166e68]">DAS & in-building wireless</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">Engineering the infrastructure behind indoor coverage.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">Odiscom LLC supports AmeriCloud’s distributed antenna system and in-building wireless projects with site assessments, construction documents, electrical engineering and coordinated drawing revisions.</p>
        <p className="mt-5 max-w-3xl leading-7 text-slate-600">Our role is A&E delivery through AmeriCloud, coordinating with the RF design, venue, carrier and installation teams.</p>
        <Link href="/services/wireless" className="mt-8 inline-block rounded-full bg-[#166e68] px-6 py-3 font-semibold text-white hover:bg-[#115a55]">Explore wireless & DAS services</Link>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <h2 className="text-3xl font-semibold">Selected AmeriCloud project scopes</h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {americloudProjects.map(project => <article key={project.title} className="rounded-3xl border border-slate-200 p-7 md:p-9">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#166e68]">{project.category}</p>
          <h3 className="mt-4 text-2xl font-semibold leading-tight md:text-3xl">{project.title}</h3>
          <p className="mt-3 text-sm font-medium text-[#166e68]">{project.location}</p>
          <p className="mt-5 leading-7 text-slate-600">{project.summary}</p>
          <p className="mt-4 text-sm leading-7 text-slate-500">{project.sites}</p>
          <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Odiscom’s A&E scope</h4>
          <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-700">{project.scope.map(item => <li key={item}>{item}</li>)}</ul>
        </article>)}
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-6 lg:px-8"><div className="rounded-3xl bg-[#f0f7f7] p-8 md:p-10"><h2 className="text-3xl font-semibold">From the RF design to the construction package.</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">We help translate system requirements and field conditions into coordinated antenna, cabling, equipment, power and grounding documentation. Our engineering team works through venue and jurisdiction comments and keeps revisions aligned across disciplines.</p><div className="mt-6 flex flex-wrap gap-4"><Link href="/services/wireless" className="font-semibold text-[#166e68]">Wireless & DAS A&E →</Link><Link href="/services/civil-electrical" className="font-semibold text-[#166e68]">Civil & electrical engineering →</Link></div></div></section>
    <ProjectGallery only="fremont-das" />
    <BottomCta title="Planning a DAS or in-building wireless project?" description="Send Bret the venue information, system scope, available RF design, required deliverables and target schedule." />
  </main>;
}
