import type { Metadata } from "next";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: services["permitting"].name,
  description: services["permitting"].description,
  alternates: { canonical: "/services/permitting" },
};

export default function Page() {
  return <ServiceDetail slug="permitting" />;
}
