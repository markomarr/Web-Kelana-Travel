import { Suspense } from "react";
import type { Metadata } from "next";
import { RouteFilterList } from "@/components/sections/RouteFilterList";
import { RouteCardSkeletonGrid } from "@/components/sections/RouteCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { getActiveRoutes, getSiteSettings } from "@/lib/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? "Kelana Travel";

  return {
    title: `Rute & Harga — ${siteName}`,
    description: "Daftar lengkap rute perjalanan dan tarif per armada yang tersedia.",
    openGraph: {
      title: `Rute & Harga — ${siteName}`,
      description: "Daftar lengkap rute perjalanan dan tarif per armada yang tersedia.",
      type: "website",
    },
  };
}

export default function RutePage() {
  return (
    <section className="bg-surface py-12 pt-28 sm:py-20 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
            Rute & Harga
          </h1>
          <p className="mt-3 text-text-secondary">
            Pilih rute perjalanan Anda dan lihat tarif untuk setiap armada yang tersedia.
          </p>
        </FadeInOnScroll>

        <div className="mt-10">
          <Suspense fallback={<RouteCardSkeletonGrid count={6} lgCols="lg:grid-cols-3" />}>
            <RouteList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function RouteList() {
  const [routes, settings] = await Promise.all([getActiveRoutes(), getSiteSettings()]);
  const siteName = settings?.siteName ?? "Kelana Travel";
  const phoneWhatsapp = settings?.phoneWhatsapp ?? "";

  if (routes.length === 0) {
    return (
      <EmptyState
        title="Belum ada rute tersedia"
        description="Saat ini belum ada rute aktif. Hubungi kami untuk informasi lebih lanjut."
        ctaHref="/kontak"
        ctaLabel="Hubungi Kami"
      />
    );
  }

  return <RouteFilterList routes={routes} siteName={siteName} phoneWhatsapp={phoneWhatsapp} />;
}
