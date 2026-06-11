import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/utils";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";

interface CtaBannerProps {
  siteName: string;
  phoneWhatsapp: string;
}

export function CtaBanner({ siteName, phoneWhatsapp }: CtaBannerProps) {
  const waUrl = buildWhatsAppUrl(
    phoneWhatsapp,
    `Halo ${siteName}, saya ingin bertanya tentang layanan travel.`
  );

  return (
    <section className="bg-accent py-12 sm:py-20">
      <FadeInOnScroll className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-extrabold text-dark sm:text-3xl">
          Siap Berangkat?
        </h2>
        <p className="max-w-xl text-dark/80">
          Hubungi kami sekarang untuk informasi rute, harga, dan ketersediaan armada.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-dark active:scale-[0.98]"
          >
            Hubungi Kami via WhatsApp
          </a>
          <Link
            href="/rute"
            className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-white hover:text-dark active:scale-[0.98]"
          >
            Lihat Rute & Harga
          </Link>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
