import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-dark px-4 text-center">
      <p className="font-mono text-sm font-semibold tracking-widest text-accent">404</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-3 max-w-md text-white/70">
        Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-accent-hover"
      >
        Kembali ke Beranda
      </Link>
    </section>
  );
}
