import type { Metadata } from "next";
import Link from "next/link";
import BottomCta from "@/components/BottomCta";
import { serviceLinks } from "@/lib/service-navigation";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Site Acquisition, Engineering & Construction Services",
  description: "Explore Odiscom’s fiber/OSP, joint-use, site acquisition, wireless, structural, civil/electrical, permitting and construction capabilities.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <main className="bg-white text-slate-900">
    <section className="border-b border-slate-200 bg-[#f7fbfb]"><div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#166e68]">Odiscom services</p>
      <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">One brand. The capabilities behind your infrastructure.</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">Start with the site, the route or the engineering package. We support operators, engineering firms, tower owners and prime contractors with defined scopes and coordinated delivery.</p>
      <p className="mt-5 max-w-3xl leading-7 text-slate-600">A&E services are provided by Odiscom LLC. Construction services are provided by <a href="https://www.odiscomconstruction.com/" className="font-semibold text-[#166e68] underline underline-offset-4">Odiscom Construction LLC</a>.</p>
    </div></section>
    <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
      {serviceLinks.map((item, index) => <article key={item.slug} className="flex flex-col rounded-3xl border border-slate-200 p-7 shadow-sm">
        <p className="text-sm font-semibold text-[#166e68]">0{index + 1}</p>
        <h2 className="mt-4 text-2xl font-semibold">{item.name}</h2>
        <p className="mt-4 flex-1 leading-7 text-slate-600">{services[item.slug].description}</p>
        <Link href={`/services/${item.slug}`} className="mt-6 inline-block font-semibold text-[#166e68]">Explore scope & deliverables →</Link>
      </article>)}
    </section>
    <section className="mx-auto max-w-7xl px-6 lg:px-8"><div className="rounded-3xl bg-[#f0f7f7] p-8 md:p-10"><h2 className="text-3xl font-semibold">Need recurring engineering capacity?</h2><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">We support drawing production, PE review, permit packages and program coordination for teams with an ongoing project pipeline. Define the standards and handoff once, then work with a team that knows your program.</p><Link href="/case-studies" className="mt-5 inline-block font-semibold text-[#166e68]">See our project experience →</Link></div></section>
    <BottomCta title="Let’s define your next scope." description="Tell Bret about the route, site or program, your required deliverables and your schedule." />
  </main>;
}
