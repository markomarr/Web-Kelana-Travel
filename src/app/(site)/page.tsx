import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { RouteCard } from "@/components/sections/RouteCard";
import { VehicleCard } from "@/components/sections/VehicleCard";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import {
  getSiteSettings,
  getActiveRoutes,
  getActiveVehicles,
  getPublishedTestimonials,
  getFeatures,
  getFaqs,
} from "@/lib/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? "Kelana Travel";

  return {
    title: `${siteName} — Travel Antar Kota Yogyakarta & Jawa Tengah`,
    description:
      settings?.heroSubtext ??
      "Layanan travel antar kota terpercaya di area Yogyakarta dan Jawa Tengah. Pesan armada, cek rute dan harga dengan mudah.",
    openGraph: {
      title: siteName,
      description: settings?.heroSubtext ?? "Travel antar kota terpercaya di Yogyakarta dan Jawa Tengah.",
      type: "website",
    },
  };
}

export default async function HomePage() {
  const [settings, routes, vehicles, testimonials, features, faqs] = await Promise.all([
    getSiteSettings(),
    getActiveRoutes(),
    getActiveVehicles(),
    getPublishedTestimonials(),
    getFeatures(),
    getFaqs(),
  ]);

  const siteName = settings?.siteName ?? "Kelana Travel";
  const phoneWhatsapp = settings?.phoneWhatsapp ?? "";
  const routePairs = routes.map((r) => ({ cityFrom: r.cityFrom, cityTo: r.cityTo }));

  return (
    <>
      <Hero settings={settings} routePairs={routePairs} />

      <Features features={features} />

      {/* Section 3 — Rute Populer */}
      <section className="bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
              Rute Populer
            </h2>
            <p className="mt-3 text-text-secondary">
              Pilihan rute favorit penumpang kami dengan harga terjangkau.
            </p>
          </FadeInOnScroll>

          {routes.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                title="Belum ada rute tersedia"
                description="Saat ini belum ada rute aktif. Hubungi kami untuk informasi lebih lanjut."
                ctaHref="/kontak"
                ctaLabel="Hubungi Kami"
              />
            </div>
          ) : (
            <>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {routes.slice(0, 4).map((route, i) => (
                  <FadeInOnScroll key={route.id} index={i}>
                    <RouteCard route={route} siteName={siteName} phoneWhatsapp={phoneWhatsapp} />
                  </FadeInOnScroll>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/rute"
                  className="font-display text-sm font-bold text-primary-600 transition-colors hover:text-primary"
                >
                  Lihat Semua Rute →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Section 4 — Armada */}
      <section className="bg-surface-alt py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
              Armada Kami
            </h2>
            <p className="mt-3 text-text-secondary">
              Kendaraan terawat dan nyaman untuk perjalanan Anda.
            </p>
          </FadeInOnScroll>

          {vehicles.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                title="Belum ada armada tersedia"
                description="Saat ini belum ada armada aktif. Hubungi kami untuk informasi lebih lanjut."
                ctaHref="/kontak"
                ctaLabel="Hubungi Kami"
              />
            </div>
          ) : (
            <>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.slice(0, 3).map((vehicle, i) => (
                  <FadeInOnScroll key={vehicle.id} index={i}>
                    <VehicleCard vehicle={vehicle} />
                  </FadeInOnScroll>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/armada"
                  className="font-display text-sm font-bold text-primary-600 transition-colors hover:text-primary"
                >
                  Lihat Semua Armada →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Section 5 — Testimonial */}
      {testimonials.length > 0 && (
        <section className="bg-dark py-12 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                Apa Kata Mereka
              </h2>
              <p className="mt-3 text-white/70">
                Pengalaman penumpang yang sudah menggunakan layanan kami.
              </p>
            </FadeInOnScroll>
            <FadeInOnScroll className="mt-10" delay={0.1}>
              <TestimonialCarousel testimonials={testimonials} />
            </FadeInOnScroll>
          </div>
        </section>
      )}

      <CtaBanner siteName={siteName} phoneWhatsapp={phoneWhatsapp} />

      {/* Section 7 — FAQ Preview */}
      <section className="bg-surface py-12 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll className="text-center">
            <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
              Pertanyaan Umum
            </h2>
            <p className="mt-3 text-text-secondary">
              Jawaban singkat untuk pertanyaan yang sering diajukan.
            </p>
          </FadeInOnScroll>

          {faqs.length === 0 ? (
            <p className="mt-10 text-center text-sm text-text-muted">
              Belum ada pertanyaan umum yang tersedia.
            </p>
          ) : (
            <>
              <FadeInOnScroll className="mt-10" delay={0.1}>
                <FaqAccordion items={faqs.slice(0, 4)} />
              </FadeInOnScroll>
              <div className="mt-8 text-center">
                <Link
                  href="/faq"
                  className="font-display text-sm font-bold text-primary-600 transition-colors hover:text-primary"
                >
                  Lihat Semua FAQ →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
