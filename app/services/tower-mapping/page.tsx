import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["tower-mapping"].name, services["tower-mapping"].description, "/services/tower-mapping", "towers");

export default function Page() {
  return <ServiceDetail slug="tower-mapping" />;
}
