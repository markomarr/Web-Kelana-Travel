"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/rute", label: "Rute & Harga" },
  { href: "/armada", label: "Armada" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontak", label: "Kontak" },
];

interface NavbarProps {
  siteName: string;
  phoneWhatsapp: string;
}

export function Navbar({ siteName, phoneWhatsapp }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !mobileOpen;

  const ctaUrl = buildWhatsAppUrl(
    phoneWhatsapp,
    `Halo ${siteName}, saya ingin bertanya tentang layanan travel.`
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        transparent
          ? "bg-transparent text-white"
          : "bg-primary/95 text-white shadow-md backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-dark">
            <MapPin size={18} />
          </span>
          {siteName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 font-body text-sm font-medium transition-colors hover:text-accent ${
                  active ? "text-accent" : ""
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-dark transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-accent-hover active:scale-[0.98]"
          >
            Pesan Sekarang
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg p-2 md:hidden"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 top-16 z-40 bg-primary text-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-6">
              {NAV_LINKS.map((link) => {
                const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-3 font-body text-base font-medium transition-colors ${
                      active ? "bg-primary-600 text-white" : "hover:bg-primary-600/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-dark transition-colors hover:bg-accent-hover"
              >
                Pesan Sekarang
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
