import type { Metadata } from "next";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: services["joint-use"].name,
  description: services["joint-use"].description,
  alternates: { canonical: "/services/joint-use" },
};

export default function Page() {
  return <ServiceDetail slug="joint-use" />;
}
