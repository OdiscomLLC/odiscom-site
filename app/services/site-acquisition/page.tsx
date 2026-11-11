import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["site-acquisition"].name, services["site-acquisition"].description, "/services/site-acquisition", "site-acquisition");

export default function Page() {
  return <ServiceDetail slug="site-acquisition" />;
}
