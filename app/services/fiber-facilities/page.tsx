import type { Metadata } from "next";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: services["fiber-facilities"].name,
  description: services["fiber-facilities"].description,
  alternates: { canonical: "/services/fiber-facilities" },
};

export default function Page() {
  return <ServiceDetail slug="fiber-facilities" />;
}
