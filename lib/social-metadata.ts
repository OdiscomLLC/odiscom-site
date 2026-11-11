import type { Metadata } from "next";

export function socialMetadata(title: string, description: string, path: string, image = "company"): Metadata {
  const images = [{ url: `/share/${image}`, width: 1200, height: 630, alt: `${title} | Odiscom` }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "en_US", siteName: "Odiscom", title, description, url: path, images },
    twitter: { card: "summary_large_image", title, description, images: images.map(item => item.url) },
  };
}
