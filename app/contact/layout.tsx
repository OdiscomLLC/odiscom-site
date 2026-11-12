import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
export const metadata: Metadata = socialMetadata("Contact & Project Inquiries", "Contact the Odiscom team for engineering, site acquisition and construction project inquiries. Share your scope, location and schedule.", "/contact", "company");
export default function ContactLayout({ children }: { children: React.ReactNode }) { return children; }
