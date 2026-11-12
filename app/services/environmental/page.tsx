import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["environmental"].name, services["environmental"].description, "/services/environmental", "towers");

export default function Page() {
  return <ServiceDetail slug="environmental" />;
}
