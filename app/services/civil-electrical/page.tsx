import type { Metadata } from "next";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: services["civil-electrical"].name,
  description: services["civil-electrical"].description,
  alternates: { canonical: "/services/civil-electrical" },
};

export default function Page() {
  return <ServiceDetail slug="civil-electrical" />;
}
