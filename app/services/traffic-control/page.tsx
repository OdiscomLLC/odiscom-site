import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["traffic-control"].name, services["traffic-control"].description, "/services/traffic-control", "towers");

export default function Page() {
  return <ServiceDetail slug="traffic-control" />;
}
