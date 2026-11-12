import Image from "next/image";
import Link from "next/link";
import { projectGallery } from "@/lib/project-gallery";

export default function ProjectGallery({ service, only, limit = 4 }: { service?: string; only?: string; limit?: number }) {
  const examples = projectGallery.filter(item => (!service || (item.services as readonly string[]).includes(service)) && (!only || item.id === only || item.id.startsWith(`${only}-`))).slice(0, limit);
  if (!examples.length) return null;
  return <section id="drawing-package" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16 lg:px-8">
    <p className="text-sm font-semibold uppercase tracking-widest text-[#166e68]">Inside a drawing package</p>
    <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Engineering carried through to the details.</h2>
    <p className="mt-5 max-w-3xl leading-8 text-slate-600">Shelter framing, foundations, façade connections and electrical coordination from actual Odiscom drawing packages. Open an excerpt to examine the drawings at full size.</p>
    <div className={`mt-9 grid gap-8 ${examples.length > 1 ? "lg:grid-cols-2" : "lg:max-w-4xl"}`}>
      {examples.map(item => <figure key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <a href={item.image} target="_blank" rel="noreferrer" className="group relative block border-b border-slate-200 bg-[#f7fbfb] p-5" aria-label={`Enlarge ${item.title} drawing excerpt (opens in new tab)`}>
          <Image src={item.image} alt={item.alt} width={item.width} height={item.height} sizes="(min-width: 1024px) 550px, 100vw" className="h-80 w-full object-contain md:h-96" />
          <span className="absolute bottom-4 right-4 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-[#166e68] group-hover:bg-[#f0f7f7]">Enlarge drawing ↗</span>
        </a>
        <figcaption className="p-7 md:p-8"><p className="text-sm font-semibold text-[#166e68]">{item.client}</p><h3 className="mt-3 text-2xl font-semibold">{item.title}</h3><p className="mt-4 leading-7 text-slate-600">{item.text}</p><p className="mt-4 text-sm leading-6 text-slate-500">{item.caption}</p><Link href={item.href} className="mt-5 inline-block font-semibold text-[#166e68]">Explore the project scope →</Link></figcaption>
      </figure>)}
    </div>
  </section>;
}
