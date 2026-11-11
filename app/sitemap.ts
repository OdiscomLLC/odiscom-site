import type { MetadataRoute } from "next";
import { serviceLinks } from "@/lib/service-navigation";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/services", ...serviceLinks.map(item => `/services/${item.slug}`), "/about", "/case-studies", "/clients", "/contact", "/government", "/capability-statement", "/careers", "/events", "/privacy", "/terms"];
  return paths.map(path => ({ url: `https://www.odiscom.com${path}`, changeFrequency: "monthly" }));
}
