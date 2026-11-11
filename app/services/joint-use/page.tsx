import type { Metadata } from "next";
import { socialMetadata } from "@/lib/social-metadata";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = socialMetadata(services["joint-use"].name, services["joint-use"].description, "/services/joint-use", "joint-use");

export default function Page() {
  return <ServiceDetail slug="joint-use" />;
}
