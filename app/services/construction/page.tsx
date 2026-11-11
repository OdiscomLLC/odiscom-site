import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["construction"].name, services["construction"].description, "/services/construction", "construction");

export default function Page() {
  return <ServiceDetail slug="construction" />;
}
