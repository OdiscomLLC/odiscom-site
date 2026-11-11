import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["fiber-facilities"].name, services["fiber-facilities"].description, "/services/fiber-facilities", "fiber-facilities");

export default function Page() {
  return <ServiceDetail slug="fiber-facilities" />;
}
