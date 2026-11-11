import type { Metadata } from "next";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: services["site-acquisition"].name,
  description: services["site-acquisition"].description,
  alternates: { canonical: "/services/site-acquisition" },
};

export default function Page() {
  return <ServiceDetail slug="site-acquisition" />;
}
