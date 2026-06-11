"use client";

import { useMemo, useState } from "react";
import { RouteCard } from "@/components/sections/RouteCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import type { RouteWithPrices } from "@/lib/queries";

interface RouteFilterListProps {
  routes: RouteWithPrices[];
  siteName: string;
  phoneWhatsapp: string;
}

const ALL_TAB = "Semua";

export function RouteFilterList({ routes, siteName, phoneWhatsapp }: RouteFilterListProps) {
  const cityFromOptions = useMemo(() => {
    return [ALL_TAB, ...Array.from(new Set(routes.map((r) => r.cityFrom))).sort()];
  }, [routes]);

  const [activeTab, setActiveTab] = useState(ALL_TAB);

  const filteredRoutes = useMemo(() => {
    if (activeTab === ALL_TAB) return routes;
    return routes.filter((r) => r.cityFrom === activeTab);
  }, [routes, activeTab]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {cityFromOptions.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setActiveTab(city)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === city
                ? "bg-primary text-white"
                : "bg-white text-text-secondary ring-1 ring-slate-200 hover:bg-surface-alt"
            }`}
          >
            {city === ALL_TAB ? city : `Dari ${city}`}
          </button>
        ))}
      </div>

      {filteredRoutes.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Belum ada rute tersedia"
            description="Tidak ada rute aktif untuk filter ini. Coba pilih kota asal lain atau hubungi kami."
            ctaHref="/kontak"
            ctaLabel="Hubungi Kami"
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoutes.map((route, i) => (
            <FadeInOnScroll key={route.id} index={i % 3}>
              <RouteCard
                route={route}
                siteName={siteName}
                phoneWhatsapp={phoneWhatsapp}
                variant="detailed"
              />
            </FadeInOnScroll>
          ))}
        </div>
      )}
    </div>
  );
}
