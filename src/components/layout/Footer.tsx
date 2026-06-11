import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { SiteSettings, Route } from "@prisma/client";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/rute", label: "Rute & Harga" },
  { href: "/armada", label: "Armada" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontak", label: "Kontak" },
];

interface FooterProps {
  settings: SiteSettings | null;
  popularRoutes: Route[];
}

export function Footer({ settings, popularRoutes }: FooterProps) {
  const siteName = settings?.siteName ?? "Kelana Travel";
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8 lg:py-16">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-dark">
              <MapPin size={18} />
            </span>
            {siteName}
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            {settings?.heroTagline ?? "Travel antar kota terpercaya di Yogyakarta dan Jawa Tengah."}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
            Navigasi
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
            Rute Populer
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {popularRoutes.length === 0 && <li>Belum ada rute aktif.</li>}
            {popularRoutes.map((route) => (
              <li key={route.id}>
                <Link href="/rute" className="transition-colors hover:text-accent">
                  {route.cityFrom} → {route.cityTo}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white/90">
            Kontak
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {settings?.phoneWhatsapp && (
              <li className="flex items-start gap-2">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-accent" />
                <a
                  href={buildWhatsAppUrl(
                    settings.phoneWhatsapp,
                    `Halo ${siteName}, saya ingin bertanya tentang layanan travel.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {settings.phoneDisplay || settings.phoneWhatsapp}
                </a>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-accent" />
                <a href={`mailto:${settings.email}`} className="transition-colors hover:text-accent">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.address && (
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {year} {siteName}. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
