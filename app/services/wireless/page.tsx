import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["wireless"].name, services["wireless"].description, "/services/wireless", "wireless");

export default function Page() {
  return <ServiceDetail slug="wireless" />;
}
