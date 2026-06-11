import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getSiteSettings } from "@/lib/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? "Kelana Travel";

  return {
    title: `Kontak — ${siteName}`,
    description: "Hubungi kami melalui WhatsApp, telepon, email, atau kunjungi langsung lokasi kami.",
    openGraph: {
      title: `Kontak — ${siteName}`,
      description: "Hubungi kami melalui WhatsApp, telepon, email, atau kunjungi langsung lokasi kami.",
      type: "website",
    },
  };
}

export default async function KontakPage() {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? "Kelana Travel";
  const phoneWhatsapp = settings?.phoneWhatsapp ?? "";

  const waUrl = buildWhatsAppUrl(
    phoneWhatsapp,
    `Halo ${siteName}, saya ingin bertanya tentang layanan travel.`
  );

  return (
    <section className="bg-surface py-12 pt-28 sm:py-20 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">Kontak</h1>
          <p className="mt-3 text-text-secondary">
            Ada pertanyaan? Hubungi kami melalui salah satu kanal di bawah ini.
          </p>
        </FadeInOnScroll>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FadeInOnScroll className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="font-display text-lg font-bold text-text-primary">Informasi Kontak</h2>
              <ul className="mt-4 space-y-4 text-sm text-text-secondary">
                {phoneWhatsapp && (
                  <li className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MessageCircle size={18} />
                    </span>
                    <div>
                      <p className="font-medium text-text-primary">WhatsApp</p>
                      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                        {settings?.phoneDisplay || phoneWhatsapp}
                      </a>
                    </div>
                  </li>
                )}
                {settings?.phoneDisplay && (
                  <li className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone size={18} />
                    </span>
                    <div>
                      <p className="font-medium text-text-primary">Telepon</p>
                      <a href={`tel:${settings.phoneDisplay.replace(/[^0-9+]/g, "")}`} className="hover:text-primary-600">
                        {settings.phoneDisplay}
                      </a>
                    </div>
                  </li>
                )}
                {settings?.email && (
                  <li className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail size={18} />
                    </span>
                    <div>
                      <p className="font-medium text-text-primary">Email</p>
                      <a href={`mailto:${settings.email}`} className="hover:text-primary-600">
                        {settings.email}
                      </a>
                    </div>
                  </li>
                )}
                {settings?.address && (
                  <li className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <p className="font-medium text-text-primary">Alamat</p>
                      <p>{settings.address}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              {settings?.mapsEmbedUrl ? (
                <iframe
                  src={settings.mapsEmbedUrl}
                  title="Lokasi Kelana Travel"
                  className="h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-72 w-full flex-col items-center justify-center gap-2 bg-surface-alt text-text-muted">
                  <MapPin size={32} />
                  <p className="text-sm">Peta lokasi belum tersedia</p>
                </div>
              )}
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.1}>
            <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Kirim Pesan</h2>
            <ContactForm siteName={siteName} phoneWhatsapp={phoneWhatsapp} />
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}
