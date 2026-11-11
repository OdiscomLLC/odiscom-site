import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["permitting"].name, services["permitting"].description, "/services/permitting", "permitting");

export default function Page() {
  return <ServiceDetail slug="permitting" />;
}
