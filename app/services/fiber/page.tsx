import type { Metadata } from "next";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: services["fiber"].name,
  description: services["fiber"].description,
  alternates: { canonical: "/services/fiber" },
};

export default function Page() {
  return <ServiceDetail slug="fiber" />;
}
