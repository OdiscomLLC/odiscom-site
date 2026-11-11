import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["fiber"].name, services["fiber"].description, "/services/fiber", "fiber");

export default function Page() {
  return <ServiceDetail slug="fiber" />;
}
