import "./globals.css";
import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  ...socialMetadata("Site Acquisition, Engineering & Construction | Odiscom", "Fiber/OSP engineering, site acquisition, joint use, wireless & DAS A&E, network facilities and construction capabilities from Odiscom.", "/"),
  metadataBase: new URL("https://www.odiscom.com"),
  title: {
    default: "Site Acquisition, Engineering & Construction | Odiscom",
    template: "%s | Odiscom",
  },
  description:
    "Odiscom brings together fiber/OSP engineering, site acquisition, joint use, wireless and structural engineering, and construction capabilities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-4 focus:text-[#166e68]">Skip to content</a>
        <Navbar />
        <div id="main-content">{children}</div>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Odiscom LLC", url: "https://www.odiscom.com", logo: "https://www.odiscom.com/logos/odiscom.png", sameAs: ["https://www.linkedin.com/company/odiscom-llc"] }) }} />
        <Analytics />
      </body>
    </html>
  );
}