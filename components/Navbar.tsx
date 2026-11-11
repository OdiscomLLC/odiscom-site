"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { serviceLinks } from "@/lib/service-navigation";

const navItems = [
  { label: "Projects", href: "/case-studies" },
  { label: "Clients", href: "/clients" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
const moreLinks = [
  { label: "Government", href: "/government" },
  { label: "Events", href: "/events" },
  { label: "Careers", href: "/careers" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobilePath, setMobilePath] = useState<string | null>(null);
  const mobileOpen = mobilePath === pathname;
  const closeMobile = () => setMobilePath(null);
  const activeClass = (href: string) => pathname === href || pathname.startsWith(href + "/") ? "text-[#166e68] font-semibold" : "text-slate-700 hover:text-[#166e68]";
  return <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
      <Link href="/" aria-label="Odiscom home" onClick={closeMobile}><img src="/logos/odiscom.png" alt="Odiscom" width={170} height={48} className="h-auto w-40" /></Link>
      <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
        <details className="group relative" onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}>
          <summary className={`cursor-pointer rounded-lg px-2 py-3 font-medium ${activeClass("/services")}`}>Services</summary>
          <div className="absolute left-0 top-full w-[350px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
            <Link href="/services" onClick={event => event.currentTarget.closest("details")?.removeAttribute("open")} className="block rounded-lg px-3 py-3 font-semibold text-[#166e68] hover:bg-[#f0f7f7]">All services →</Link>
            {serviceLinks.map(item => <Link key={item.slug} href={`/services/${item.slug}`} onClick={event => event.currentTarget.closest("details")?.removeAttribute("open")} className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-[#f0f7f7]">{item.name}</Link>)}
          </div>
        </details>
        {navItems.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={`py-3 text-sm font-medium ${activeClass(item.href)}`}>{item.label}</Link>)}
      </nav>
      <div className="hidden items-center gap-5 lg:flex"><a href="tel:+14695311176" className="text-sm text-slate-600">(469) 531-1176</a><Link href="/contact" className="rounded-full bg-[#166e68] px-6 py-3 text-sm font-semibold text-white hover:bg-[#115a55]">Request Proposal</Link></div>
      <button type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobilePath(mobileOpen ? null : pathname)} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-[#166e68] lg:hidden">{mobileOpen ? "Close" : "Menu"}</button>
    </div>
    {mobileOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
      <Link href="/" onClick={closeMobile} className="block py-3 font-semibold">Home</Link>
      <Link href="/services" onClick={closeMobile} className="block py-3 font-semibold text-[#166e68]">All services</Link>
      <div className="mb-3 border-l-2 border-slate-200 pl-4">{serviceLinks.map(item => <Link key={item.slug} href={`/services/${item.slug}`} onClick={closeMobile} className="block py-2.5 text-sm text-slate-700">{item.name}</Link>)}</div>
      {[...navItems, ...moreLinks].map(item => <Link key={item.href} href={item.href} onClick={closeMobile} className={`block py-3 font-medium ${activeClass(item.href)}`}>{item.label}</Link>)}
      <Link href="/contact" onClick={closeMobile} className="mt-4 block rounded-full bg-[#166e68] px-6 py-3 text-center font-semibold text-white">Request Proposal</Link>
    </nav>}
  </header>;
}
