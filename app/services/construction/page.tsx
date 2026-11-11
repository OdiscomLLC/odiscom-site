import type { Metadata } from "next";
import ServiceDetail from "@/components/ServiceDetail";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: services["construction"].name,
  description: services["construction"].description,
  alternates: { canonical: "/services/construction" },
};

export default function Page() {
  return <ServiceDetail slug="construction" />;
}
