import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kelana-travel.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/rute", "/armada", "/faq", "/kontak"];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
