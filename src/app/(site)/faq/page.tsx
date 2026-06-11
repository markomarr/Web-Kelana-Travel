import type { Metadata } from "next";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { getFaqs, getSiteSettings } from "@/lib/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? "Kelana Travel";

  return {
    title: `FAQ — ${siteName}`,
    description: "Pertanyaan yang sering diajukan seputar layanan travel kami.",
    openGraph: {
      title: `FAQ — ${siteName}`,
      description: "Pertanyaan yang sering diajukan seputar layanan travel kami.",
      type: "website",
    },
  };
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <section className="bg-surface py-12 pt-28 sm:py-20 sm:pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
            Pertanyaan Umum
          </h1>
          <p className="mt-3 text-text-secondary">
            Temukan jawaban atas pertanyaan yang paling sering ditanyakan.
          </p>
        </FadeInOnScroll>

        <div className="mt-10">
          {faqs.length === 0 ? (
            <p className="text-center text-sm text-text-muted">
              Belum ada pertanyaan umum yang tersedia.
            </p>
          ) : (
            <FadeInOnScroll delay={0.1}>
              <FaqAccordion items={faqs} />
            </FadeInOnScroll>
          )}
        </div>
      </div>
    </section>
  );
}
