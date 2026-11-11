import type { Metadata } from "next";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: services["towers"].name,
  description: services["towers"].description,
  alternates: { canonical: "/services/towers" },
};

export default function Page() {
  return <ServiceDetail slug="towers" />;
}
