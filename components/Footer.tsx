import Link from "next/link";
import { serviceLinks } from "@/lib/service-navigation";

export default function Footer() {
  return <footer className="bg-[#0f3f3b] text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-[1.1fr_1.2fr_.7fr] lg:px-8">
      <div><h2 className="text-2xl font-semibold">Odiscom</h2><p className="mt-4 max-w-sm leading-7 text-white/80">Site acquisition, engineering and construction capabilities for telecommunications infrastructure.</p><p className="mt-5 text-sm leading-7 text-white/70">A&E: Odiscom LLC<br />Construction: Odiscom Construction LLC<br />League City, Texas</p><a href="https://www.odiscomconstruction.com/" className="mt-4 inline-block text-sm font-semibold text-white underline underline-offset-4">Odiscom Construction ↗</a></div>
      <div><h2 className="text-lg font-semibold">Services</h2><nav aria-label="Footer services" className="mt-4 grid gap-3 sm:grid-cols-2">{serviceLinks.map(item => <Link key={item.slug} href={`/services/${item.slug}`} className="text-sm leading-6 text-white/80 hover:text-white">{item.name}</Link>)}</nav></div>
      <div><h2 className="text-lg font-semibold">Connect</h2><a href="mailto:info@odiscom.com" className="mt-4 block break-words text-sm text-white/80">info@odiscom.com</a><a href="tel:+14695311176" className="mt-3 block text-sm text-white/80">(469) 531-1176</a><nav aria-label="Company links" className="mt-5 grid gap-3 text-sm text-white/80">{[{name:"About Odiscom",href:"/about"},{name:"Capability statements",href:"/capability-statement"},{name:"Government",href:"/government"},{name:"BEAD support",href:"/bead"},{name:"Events",href:"/events"},{name:"Careers",href:"/careers"}].map(item => <Link key={item.href} href={item.href}>{item.name}</Link>)}</nav><a href="https://www.linkedin.com/company/odiscom-llc" className="mt-4 inline-block text-sm text-white/80">LinkedIn ↗</a></div>
    </div>
    <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 border-t border-white/20 px-6 py-6 text-sm text-white/70 lg:px-8"><p>© {new Date().getFullYear()} Odiscom. All rights reserved.</p><div className="flex gap-6"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Use</Link></div></div>
  </footer>;
}
