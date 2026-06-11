import { Suspense } from "react";
import type { Metadata } from "next";
import { VehicleCard } from "@/components/sections/VehicleCard";
import { VehicleCardSkeletonGrid } from "@/components/sections/VehicleCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { getActiveVehicles, getSiteSettings } from "@/lib/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? "Kelana Travel";

  return {
    title: `Armada — ${siteName}`,
    description: "Daftar armada kendaraan yang siap mengantar perjalanan Anda dengan nyaman dan aman.",
    openGraph: {
      title: `Armada — ${siteName}`,
      description: "Daftar armada kendaraan yang siap mengantar perjalanan Anda dengan nyaman dan aman.",
      type: "website",
    },
  };
}

export default function ArmadaPage() {
  return (
    <section className="bg-surface py-12 pt-28 sm:py-20 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
            Armada Kami
          </h1>
          <p className="mt-3 text-text-secondary">
            Kendaraan terawat dengan berbagai fasilitas untuk kenyamanan perjalanan Anda.
          </p>
        </FadeInOnScroll>

        <div className="mt-10">
          <Suspense fallback={<VehicleCardSkeletonGrid count={6} />}>
            <VehicleList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function VehicleList() {
  const vehicles = await getActiveVehicles();

  if (vehicles.length === 0) {
    return (
      <EmptyState
        title="Belum ada armada tersedia"
        description="Saat ini belum ada armada aktif. Hubungi kami untuk informasi lebih lanjut."
        ctaHref="/kontak"
        ctaLabel="Hubungi Kami"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle, i) => (
        <FadeInOnScroll key={vehicle.id} index={i % 3}>
          <VehicleCard vehicle={vehicle} />
        </FadeInOnScroll>
      ))}
    </div>
  );
}
