"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BookingForm } from "@/components/sections/BookingForm";
import type { SiteSettings } from "@prisma/client";

interface HeroProps {
  settings: SiteSettings | null;
  routePairs: { cityFrom: string; cityTo: string }[];
}

export function Hero({ settings, routePairs }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion ? {} : { opacity: 0, y: 24 };
  const animate = shouldReduceMotion ? {} : { opacity: 1, y: 0 };

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-dark pt-24 pb-16">
      {settings?.heroImageUrl && (
        <Image
          src={settings.heroImageUrl}
          alt="Armada Kelana Travel siap mengantar perjalanan Anda"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/70 to-dark" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <motion.h1
            initial={initial}
            animate={animate}
            transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
            className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            {settings?.heroTagline ?? "Travel Antar Kota Yogyakarta & Jawa Tengah"}
          </motion.h1>
          {settings?.heroSubtext && (
            <motion.p
              initial={initial}
              animate={animate}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="mt-4 text-base text-white/80 sm:text-lg"
            >
              {settings.heroSubtext}
            </motion.p>
          )}
        </div>

        <motion.div
          initial={initial}
          animate={animate}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="w-full lg:max-w-md"
        >
          <BookingForm
            siteName={settings?.siteName ?? "Kelana Travel"}
            phoneWhatsapp={settings?.phoneWhatsapp ?? ""}
            routePairs={routePairs}
          />
        </motion.div>
      </div>
    </section>
  );
}
