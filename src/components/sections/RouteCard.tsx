"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";
import { buildWhatsAppUrl, formatRupiah } from "@/lib/utils";
import type { RouteWithPrices } from "@/lib/queries";

interface RouteCardProps {
  route: RouteWithPrices;
  siteName: string;
  phoneWhatsapp: string;
  /** "compact" untuk preview di homepage, "detailed" untuk halaman /rute */
  variant?: "compact" | "detailed";
}

export function RouteCard({ route, siteName, phoneWhatsapp, variant = "compact" }: RouteCardProps) {
  const lowestPrice = route.prices[0]?.price;
  const waMessage = `Halo ${siteName}, saya ingin pesan travel rute ${route.cityFrom} → ${route.cityTo}.`;
  const waUrl = buildWhatsAppUrl(phoneWhatsapp, waMessage);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Signature element: jalur perjalanan dot - line - dot, garis "tergambar" saat masuk viewport */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2">
          <span className="relative flex h-3 w-3 shrink-0">
            {!shouldReduceMotion && (
              <motion.span
                className="absolute inset-0 rounded-full bg-primary"
                animate={isInView ? { scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] } : { opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />
            )}
            <span className="relative h-3 w-3 rounded-full bg-primary" />
          </span>
          <span className="font-display text-sm font-bold text-text-primary sm:text-base">
            {route.cityFrom}
          </span>
        </div>

        <div className="relative h-[2px] flex-1">
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="6 5"
              vectorEffect="non-scaling-stroke"
              initial={shouldReduceMotion ? false : { pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <span className="font-display text-sm font-bold text-text-primary sm:text-base">
            {route.cityTo}
          </span>
          <span className="h-3 w-3 shrink-0 rounded-full bg-accent" />
        </div>
      </div>

      {route.durationEst && (
        <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
          <Clock size={16} className="text-text-muted" />
          <span>Estimasi {route.durationEst}</span>
        </div>
      )}

      {variant === "compact" ? (
        <div className="mt-4">
          {lowestPrice !== undefined ? (
            <p className="font-mono text-lg font-semibold text-primary">
              Mulai dari {formatRupiah(lowestPrice)}
            </p>
          ) : (
            <p className="text-sm text-text-muted">Hubungi kami untuk harga</p>
          )}
        </div>
      ) : (
        <div className="mt-4 flex-1">
          {route.prices.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-text-muted">
                  <th className="py-2 font-medium">Armada</th>
                  <th className="py-2 text-right font-medium">Harga</th>
                </tr>
              </thead>
              <tbody>
                {route.prices.map((price) => (
                  <tr key={price.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 text-text-secondary">{price.vehicle.name}</td>
                    <td className="py-2 text-right font-mono font-semibold text-primary">
                      {formatRupiah(price.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-text-muted">Hubungi kami untuk harga</p>
          )}
        </div>
      )}

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-dark transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-accent-hover active:scale-[0.98]"
      >
        Pesan Rute Ini
      </a>
    </div>
  );
}
