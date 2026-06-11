import { prisma, type Prisma } from "@/lib/prisma";

export type RouteWithPrices = Prisma.RouteGetPayload<{
  include: { prices: { include: { vehicle: true } } };
}>;

/**
 * Semua query Prisma untuk halaman publik.
 * Dipakai oleh Server Components di src/app/(site)/* dengan ISR (revalidate 60).
 */

export function getSiteSettings() {
  return prisma.siteSettings.findUnique({ where: { id: 1 } });
}

export function getActiveRoutes() {
  return prisma.route.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: {
      prices: {
        include: { vehicle: true },
        orderBy: { price: "asc" },
      },
    },
  });
}

export function getActiveVehicles() {
  return prisma.vehicle.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export function getPublishedTestimonials() {
  return prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getFaqs() {
  return prisma.faqItem.findMany({
    orderBy: { order: "asc" },
  });
}

export function getFeatures() {
  return prisma.feature.findMany({
    orderBy: { order: "asc" },
    take: 6,
  });
}

/**
 * Daftar kota asal unik dari rute aktif (untuk dropdown form booking).
 */
export async function getDistinctCitiesFrom(): Promise<string[]> {
  const rows = await prisma.route.findMany({
    where: { isActive: true },
    select: { cityFrom: true },
    distinct: ["cityFrom"],
    orderBy: { cityFrom: "asc" },
  });
  return rows.map((r) => r.cityFrom);
}

/**
 * Daftar kota tujuan unik dari rute aktif (untuk dropdown form booking).
 */
export async function getDistinctCitiesTo(): Promise<string[]> {
  const rows = await prisma.route.findMany({
    where: { isActive: true },
    select: { cityTo: true },
    distinct: ["cityTo"],
    orderBy: { cityTo: "asc" },
  });
  return rows.map((r) => r.cityTo);
}
