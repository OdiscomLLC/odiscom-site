import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["towers"].name, services["towers"].description, "/services/towers", "towers");

export default function Page() {
  return <ServiceDetail slug="towers" />;
}
