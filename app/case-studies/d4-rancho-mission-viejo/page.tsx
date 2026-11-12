import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProjectGallery from "@/components/ProjectGallery";
import BottomCta from "@/components/BottomCta";
import { socialMetadata } from "@/lib/social-metadata";

export const metadata: Metadata = socialMetadata(
  "D4 Communications | Rancho Mission Viejo Engineering",
  "Odiscom A&E through D4 Communications for Bucker Way, Gavilan Ridge and Horton Way / Cow Camp Road: shelter structures, foundations, façade details and electrical coordination.",
  "/case-studies/d4-rancho-mission-viejo",
  "projects"
);

const sites = [
  {
    id: "bucker-way", name: "Bucker Way", label: "PA3, Subarea 3.4 · Wireless facility",
    description: "A coordinated wireless-facility package connecting the equipment shelter, structural building details, electrical systems and site interfaces. The October 2026 County resubmittal contains 37 pages, including specialist wall and tower drawings.",
    scope: ["Shelter floor and ceiling plans, elevations and equipment coordination", "Roof and truss framing, gable and lintel details, and breeze-block screen sections", "Foundation plan, reinforcement layout and exterior/interior footing sections", "Electrical one-line, grounding, HVAC interfaces and County review revisions"],
  },
  {
    id: "gavilan-ridge", name: "Gavilan Ridge", label: "PA3, Subarea 3.5 · Wireless facility",
    description: "A permanent wireless-facility design coordinating the architectural enclosure, equipment shelter and utility systems. The October 2026 coordinated package contains 28 pages, including specialist tower and foundation drawings.",
    scope: ["Site and equipment layouts, facility elevations and enclosure details", "Stucco fascia framing, corner clamps, platform transitions and flashing", "Tower-pad drainage, base gaps and architectural detailing at the tower interface", "Cabinet foundations, power distribution, grounding and County resubmittal coordination"],
  },
  {
    id: "horton-way", name: "Horton Way / Cow Camp Road", label: "Wireless facility · Site and utility coordination",
    description: "A 13-page June 2024 construction package documenting the wireless facility from site layout and equipment areas through elevations, utility connections and grounding.",
    scope: ["Overall site, detailed site and equipment-area plans", "East, west, north and south facility elevations", "Utility routing and electrical documentation", "Grounding plan, grounding details and coordinated construction notes"],
  },
];

export default function D4RanchoMissionViejoPage() {
  return <main className="bg-white text-slate-900">
    <section className="border-b border-slate-200 bg-[#f7fbfb]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
        <div>
          <Link href="/case-studies#d4-rmv" className="text-sm font-semibold text-[#166e68]">Project experience / D4 Communications</Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[#166e68]">Rancho Mission Viejo, California</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">The engineering behind the complete facility.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Odiscom LLC supports D4 Communications with multidisciplinary A&E for Rancho Mission Viejo wireless infrastructure: Bucker Way, Gavilan Ridge and Horton Way / Cow Camp Road.</p>
          <p className="mt-5 leading-7 text-slate-600">Our work connects site planning, shelter design, structural details, architectural interfaces, power and grounding in coordinated construction packages.</p>
          <a href="#drawing-package" className="mt-8 inline-block rounded-full bg-[#166e68] px-6 py-3 font-semibold text-white">Examine the engineering details ↓</a>
        </div>
        <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <Image src="/images/projects/rmv-bucker-model.webp" alt="Bucker Way equipment shelter roof-framing perspective from Odiscom’s construction drawings" width={1371} height={767} priority sizes="(min-width: 1024px) 580px, 100vw" className="h-auto w-full" />
          <figcaption className="border-t border-slate-200 px-6 py-4 text-sm leading-6 text-slate-600">Bucker Way shelter framing perspective from Odiscom sheet S-9. A design view from the construction documents.</figcaption>
        </figure>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <h2 className="text-3xl font-semibold">Three sites. Coordinated engineering scopes.</h2>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {sites.map(site => <article id={site.id} key={site.id} className="scroll-mt-28 rounded-3xl border border-slate-200 p-7">
          <p className="text-sm font-semibold leading-6 text-[#166e68]">{site.label}</p>
          <h3 className="mt-4 text-2xl font-semibold">{site.name}</h3>
          <p className="mt-5 leading-7 text-slate-600">{site.description}</p>
          <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Odiscom’s A&E scope</h4>
          <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-700">{site.scope.map(item => <li key={item}>{item}</li>)}</ul>
        </article>)}
      </div>
      <p className="mt-7 max-w-4xl text-sm leading-7 text-slate-500">Odiscom’s role is A&E delivery through D4 Communications. Coordinated package counts include drawings from the responsible specialist designers and manufacturers; the excerpts below are from Odiscom’s sheets.</p>
    </section>
    <ProjectGallery only="rmv" limit={10} />
    <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8"><div className="rounded-3xl bg-[#f0f7f7] p-8 md:p-10">
      <h2 className="text-3xl font-semibold">From the overall site to the connection detail.</h2>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Constructible packages depend on the details agreeing: footing sections with foundation plans, roof framing with wall and opening details, and equipment layouts with power and grounding. Our team carries those interfaces through drawing revisions and jurisdiction review.</p>
      <div className="mt-6 flex flex-wrap gap-5"><Link href="/services/towers" className="font-semibold text-[#166e68]">Tower & structural engineering →</Link><Link href="/services/civil-electrical" className="font-semibold text-[#166e68]">Civil & electrical engineering →</Link><Link href="/services/wireless" className="font-semibold text-[#166e68]">Wireless & DAS A&E →</Link></div>
    </div></section>
    <BottomCta title="Bring the full facility scope to Odiscom." description="Share your site information, equipment requirements, available drawings and delivery schedule with our team." />
  </main>;
}
