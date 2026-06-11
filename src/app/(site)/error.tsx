"use client";

import { useEffect } from "react";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-28 text-center">
      <h1 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
        Gagal memuat data
      </h1>
      <p className="mt-3 max-w-md text-text-secondary">
        Terjadi kesalahan saat memuat halaman ini. Silakan refresh halaman atau coba lagi nanti.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary"
      >
        Coba Lagi
      </button>
    </section>
  );
}
