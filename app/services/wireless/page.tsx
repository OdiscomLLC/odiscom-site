import type { Metadata } from "next";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: services["wireless"].name,
  description: services["wireless"].description,
  alternates: { canonical: "/services/wireless" },
};

export default function Page() {
  return <ServiceDetail slug="wireless" />;
}
