# TAHAP 3 — Website Publik — DONE

## Catatan Penting

- Koneksi database **sudah tersedia** di sesi ini (berbeda dari Tahap 2). `npm run dev`
  berhasil dijalankan dan kelima route publik (`/`, `/rute`, `/armada`, `/faq`, `/kontak`)
  mengembalikan status 200 dengan data real dari Supabase (rute, harga, FAQ, kontak,
  WhatsApp link semua terisi sesuai seed data).
- `heroImageUrl` dan `photoUrl` armada saat ini kosong di DB (belum ada upload via admin),
  sehingga hero section tampil dengan gradient overlay tanpa foto, dan kartu armada tampil
  dengan placeholder (ikon `Bus` di atas background `primary`). Ini sesuai spesifikasi
  fallback — tidak crash.
- File `src/app/page.tsx` (template default Next.js) dihapus dan digantikan oleh
  `src/app/(site)/page.tsx` karena route group `(site)` dan root `app/page.tsx` sama-sama
  resolve ke `/` — keduanya tidak boleh ada bersamaan.
- Project menggunakan Next.js 16 dengan model caching "Previous Model" (Cache Components
  **tidak** diaktifkan di `next.config.ts`), sehingga `export const revalidate = 60`
  bekerja seperti ISR klasik. Diterapkan di `(site)/layout.tsx` dan setiap page publik.
- Lint (`npm run lint`) menampilkan 6 error pre-existing dari Tahap 2 terkait
  `react-hooks/set-state-in-effect` di komponen admin (`RouteFormModal`,
  `TestimonialFormModal`, dan modal lain) — tidak terkait perubahan Tahap 3, dibiarkan
  sesuai instruksi (tidak mengubah fungsionalitas admin). Semua file baru Tahap 3 lulus
  lint tanpa error.

---

## Checklist

### Layout Publik (`src/app/(site)/layout.tsx`)
- [x] Navbar (`src/components/layout/Navbar.tsx`): logo "Kelana Travel" + ikon, menu
      Beranda/Rute & Harga/Armada/FAQ/Kontak, CTA "Pesan Sekarang" (amber, pill, link WA)
- [x] Navbar sticky, transparan di atas hero homepage, solid navy + backdrop-blur setelah
      scroll atau di halaman selain homepage
- [x] Mobile: hamburger menu slide-in dari kanan, link aktif ter-highlight
- [x] Footer (`src/components/layout/Footer.tsx`): logo+tagline, kolom Navigasi, Rute
      Populer (dari DB), Kontak (WA/email/alamat dari `site_settings`), copyright,
      background `#0D1B2A`
- [x] `export const revalidate = 60` di layout (berlaku untuk seluruh route group)

### Homepage (`src/app/(site)/page.tsx`)
- [x] Section 1 — Hero: foto hero dari DB (fallback gradient jika kosong), tagline,
      sub-teks, form booking
- [x] BookingForm (`src/components/sections/BookingForm.tsx`): dropdown kota asal/tujuan
      (dari rute aktif, tujuan terfilter sesuai asal), date picker (min hari ini), jumlah
      penumpang, nama, validasi inline, submit → `buildWhatsAppUrl()` + `window.open()`
- [x] Section 2 — Keunggulan: fetch `features`, max 6, grid 3/2/1 kolom, ikon dinamis via
      `getFeatureIcon()` (mapping `icon_key` → Lucide icon, fallback `Sparkles`),
      section disembunyikan jika kosong
- [x] Section 3 — Rute Populer: 4 rute aktif pertama, `RouteCard` (variant compact) dengan
      visual jalur perjalanan dot-line-dot, harga termurah, CTA WhatsApp, link "Lihat
      Semua Rute →", empty state jika kosong
- [x] Section 4 — Armada: 3 armada aktif pertama, `VehicleCard`, link "Lihat Semua
      Armada →", empty state jika kosong
- [x] Section 5 — Testimonial: `TestimonialCarousel` (scroll-snap horizontal), bintang
      rating, section disembunyikan total jika tidak ada data published
- [x] Section 6 — CTA Banner: background accent amber, tombol WhatsApp (navy) + "Lihat
      Rute & Harga" (outline putih)
- [x] Section 7 — FAQ Preview: 4 item pertama, `FaqAccordion` (Framer Motion
      AnimatePresence, exclusive), link "Lihat Semua FAQ →"
- [x] `generateMetadata()` dengan title/description/OG dari `site_settings`

### Halaman Rute & Harga (`/rute`)
- [x] Fetch semua rute aktif + `route_prices` + `vehicle`
- [x] `RouteFilterList` (client): tab filter per kota asal tanpa reload
- [x] `RouteCard` variant detailed: visual dot-line-dot + tabel harga (Armada — Harga,
      JetBrains Mono), "Hubungi kami" jika tidak ada harga
- [x] CTA "Pesan Rute Ini" per kartu → WhatsApp pre-filled rute
- [x] Empty state jika tidak ada rute aktif

### Halaman Armada (`/armada`)
- [x] Fetch semua armada aktif
- [x] Grid 3/2/1 kolom, `VehicleCard`: foto 16:9 (`next/image`) atau placeholder ikon
      `Bus` + background primary, badge kapasitas, fasilitas (ikon Lucide + label)
- [x] Empty state jika tidak ada armada aktif

### Halaman FAQ (`/faq`)
- [x] Fetch semua FAQ urut `order`
- [x] `FaqAccordion` exclusive dengan animasi Framer Motion AnimatePresence
- [x] Pesan singkat jika data kosong

### Halaman Kontak (`/kontak`)
- [x] Info kontak dari `site_settings`: WA (link wa.me), telepon (link tel:), email
      (mailto:), alamat
- [x] Embed Google Maps (`maps_embed_url` dari DB) atau placeholder jika kosong
- [x] `ContactForm`: nama, nomor HP, pesan → validasi inline → submit ke WhatsApp
      dengan pesan terformat

### Data Fetching (`src/lib/queries.ts`)
- [x] `getSiteSettings()`, `getActiveRoutes()`, `getActiveVehicles()`,
      `getPublishedTestimonials()`, `getFaqs()`, `getFeatures()`,
      `getDistinctCitiesFrom()`, `getDistinctCitiesTo()`
- [x] Tipe `RouteWithPrices` (Prisma payload type) untuk `RouteCard`/`RouteFilterList`
- [x] Semua Server Components, Prisma langsung (bukan via API route), ISR revalidate 60

### Helper tambahan
- [x] `src/lib/facilities.ts` — `parseFacilities()` + `FACILITY_ICONS` (mapping fasilitas
      armada → Lucide icon)
- [x] `src/lib/feature-icons.ts` — `getFeatureIcon()` (mapping `icon_key` → Lucide icon)
- [x] `src/components/ui/EmptyState.tsx` — empty state generik (ilustrasi SVG inline +
      teks + CTA opsional)

### Error Handling & SEO
- [x] `src/app/(site)/error.tsx` — error boundary dengan pesan "Gagal memuat data..." +
      tombol "Coba Lagi"
- [x] `generateMetadata()` di setiap halaman (title, description, OpenGraph)
- [x] `next.config.ts` sudah memuat `remotePatterns` untuk `*.supabase.co`

### Build & Verifikasi
- [x] `npx tsc --noEmit` bersih
- [x] `npm run build` sukses (Next.js 16 + Turbopack), semua route publik prerendered
      static dengan `revalidate: 1m`
- [x] `npm run dev` — `/`, `/rute`, `/armada`, `/faq`, `/kontak` semua HTTP 200 dengan
      data real dari Supabase

## Langkah Selanjutnya

1. Lanjut ke Tahap 4 — Polish & Animation (hero entrance, scroll-triggered animation,
   animated route card, testimonial auto-scroll, responsiveness audit, accessibility).
2. Jika ingin lihat foto hero/armada tampil, upload foto via `/admin/settings` dan
   `/admin/armada` terlebih dahulu (saat ini field `photo_url`/`hero_image_url` kosong
   di DB).
