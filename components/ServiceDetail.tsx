import Image from "next/image";
import Link from "next/link";
import BottomCta from "@/components/BottomCta";
import { services } from "@/lib/services";
import { projectExperience } from "@/lib/project-experience";

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = services[slug];
  const examples = projectExperience.filter((project) => (project.services as readonly string[]).includes(slug));
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-[#f7fbfb]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.2fr_.8fr]">
          <div className="px-6 py-16 lg:px-8 lg:py-20">
            <Link href="/services" className="text-sm font-semibold text-[#166e68]">All services / {service.name}</Link>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">{service.headline}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{service.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-full bg-[#166e68] px-6 py-3 font-semibold text-white hover:bg-[#115a55]">Discuss your project</Link>
              {(slug === "fiber" || slug === "construction" || slug === "joint-use") && <a href="/Odiscom_Wireline_Fiber_Capability_Sheet.pdf" className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-[#166e68]">Download fiber capabilities</a>}
              {slug === "construction" && <a href="https://www.odiscomconstruction.com/" className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-[#166e68]">Visit Odiscom Construction ↗</a>}
            </div>
          </div>
          <div className="relative min-h-64 lg:min-h-full">
            <Image src={service.image} alt={service.imageAlt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#166e68]">Scope your package</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">What we do</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {service.groups.map((group, index) => <article key={group.title} className="rounded-3xl border border-slate-200 p-7">
            <p className="text-sm font-semibold text-[#166e68]">0{index + 1}</p>
            <h3 className="mt-3 text-xl font-semibold">{group.title}</h3>
            <ul className="mt-5 list-disc space-y-4 pl-5 leading-7 text-slate-600">{group.items.map(item => <li key={item}>{item}</li>)}</ul>
          </article>)}
        </div>
        <div className="mt-10 grid gap-8 rounded-3xl bg-[#f0f7f7] p-7 md:grid-cols-2 md:p-10">
          <div><h2 className="text-2xl font-semibold">Typical deliverables</h2><ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-slate-700">{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul></div>
          <div><h2 className="text-2xl font-semibold">Start with your project</h2><p className="mt-5 leading-8 text-slate-700">{service.inputs}</p><Link href="/contact" className="mt-5 inline-block font-semibold text-[#166e68]">Talk with Bret and the team →</Link></div>
        </div>
      </section>
      {examples.length > 0 && <section className="border-y border-slate-200 bg-[#f7fbfb]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h2 className="text-3xl font-semibold">Relevant project experience</h2>
          {slug === "construction" && <p className="mt-4 max-w-3xl leading-7 text-slate-600">These examples describe Odiscom LLC’s engineering and drawing-production roles supporting construction programs.</p>}
          <div className="mt-8 grid gap-6 md:grid-cols-2">{examples.slice(0, 4).map(project => <article key={project.client} className="rounded-3xl border border-slate-200 bg-white p-7"><p className="text-sm font-semibold text-[#166e68]">{project.client} · {project.location}</p><h3 className="mt-3 text-xl font-semibold">{project.title}</h3><p className="mt-4 leading-7 text-slate-600">{project.summary}</p><Link href={"detailHref" in project ? project.detailHref : "/case-studies"} className="mt-5 inline-block font-semibold text-[#166e68]">See the scope →</Link></article>)}</div>
        </div>
      </section>}
      <section className="mx-auto max-w-7xl px-6 pt-14 lg:px-8"><h2 className="text-xl font-semibold">Related services</h2><div className="mt-5 flex flex-wrap gap-3">{service.related.map(related => <Link key={related} href={`/services/${related}`} className="rounded-full border border-slate-300 px-5 py-3 font-medium text-[#166e68] hover:bg-[#f0f7f7]">{services[related].name}</Link>)}</div></section>
      <BottomCta title="Build the right scope with Odiscom." description="Bring us your route, site or program. We’ll coordinate the services and deliverables your project needs." />
    </main>
  );
}
