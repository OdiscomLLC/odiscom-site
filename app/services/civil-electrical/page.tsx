import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["civil-electrical"].name, services["civil-electrical"].description, "/services/civil-electrical", "civil-electrical");

export default function Page() {
  return <ServiceDetail slug="civil-electrical" />;
}
