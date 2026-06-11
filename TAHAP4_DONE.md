# TAHAP 4 — Polish & Animation — DONE

## Catatan Penting

- Tidak ada perubahan fungsionalitas — hanya polish visual, animasi, dan aksesibilitas
  sesuai instruksi.
- Semua animasi baru menghormati `prefers-reduced-motion` melalui hook
  `useReducedMotion()` (Framer Motion) di setiap komponen client yang beranimasi, ditambah
  CSS global `@media (prefers-reduced-motion: reduce)` di `globals.css` sebagai jaring
  pengaman untuk transisi CSS murni (hover, dsb).
- `npm run build` sukses tanpa error tipe, semua route publik tetap prerendered statis
  dengan `revalidate: 1m`.
- `npm run lint` masih menampilkan 5 error pre-existing dari Tahap 2/3
  (`react-hooks/set-state-in-effect` di modal admin: `VehicleFormModal`, `FaqFormModal`,
  `PriceManagerModal`, `RouteFormModal`, `TestimonialFormModal`) — tidak terkait
  perubahan Tahap 4, dibiarkan sesuai instruksi sebelumnya (tidak mengubah fungsionalitas
  admin).

---

## Checklist

### 1. Animasi Hero (Homepage)
- [x] `src/components/sections/Hero.tsx` jadi client component, orchestrated entrance:
      headline fade-in + slide-up (delay 0), sub-teks (delay 0.15s), form booking
      (delay 0.3s)
- [x] Animasi hanya sekali saat load (tidak loop), via `motion.h1` / `motion.p` /
      `motion.div` dengan `initial`/`animate`/`transition`
- [x] `useReducedMotion()` — skip animasi (render langsung dalam posisi akhir) jika user
      minta reduced motion

### 2. Scroll-Triggered Animations
- [x] `src/components/ui/FadeInOnScroll.tsx` — reusable, `useInView` (once), fade +
      translateY(20px) → normal, duration 0.5s, stagger via prop `index` (delay +=
      index * 0.1s), skip animasi jika `prefers-reduced-motion`
- [x] Dipakai di: Section Keunggulan (`Features.tsx`, stagger per item), Section Rute
      Populer (stagger per card), Section Armada (stagger per card), Section
      Testimonial, CTA Banner, Section FAQ Preview, serta heading & grid di halaman
      `/rute`, `/armada`, `/faq`, `/kontak`

### 3. Signature Element — Animated Route Card
- [x] `src/components/sections/RouteCard.tsx` jadi client component
- [x] Garis "jalur perjalanan" kini SVG (`motion.line` dengan `pathLength` 0 → 1,
      `vectorEffect="non-scaling-stroke"`), "tergambar" dari kiri ke kanan saat card
      masuk viewport (`useInView`, once), durasi 0.8s ease-out
- [x] Titik kota asal: subtle pulse animation (scale + fade ring), berhenti otomatis
      jika `prefers-reduced-motion`
- [x] Hover: card lift `-translate-y-1` + shadow lebih dalam, CTA scale 1.02/0.98

### 4. Testimonial Carousel
- [x] `src/components/sections/TestimonialCarousel.tsx` ditulis ulang:
      auto-scroll setiap 4 detik (`setInterval`), pause saat hover (mouse) atau touch
- [x] Transisi antar item via `AnimatePresence mode="wait"` + slide/fade
- [x] Dot indicator di bawah, klik untuk navigate ke testimoni tertentu
      (`aria-current` untuk state aktif)
- [x] Drag gesture (`drag="x"`, `dragElastic`) untuk swipe manual, threshold 50px
- [x] Auto-scroll & drag dimatikan jika `prefers-reduced-motion`

### 5. FAQ Accordion Animation
- [x] `FaqAccordion.tsx` (sudah ada dari Tahap 3) — `AnimatePresence` + `motion.div`
      `height: 0 → "auto"` dengan `overflow: hidden` (tidak ada jump), ikon panah
      rotate 180° — sudah memenuhi kriteria, tidak perlu perubahan tambahan

### 6. Navbar Behavior
- [x] Scroll effect transparan → solid (`bg-primary/95` + `backdrop-blur-md`),
      transisi 300ms (sudah ada, dipertahankan)
- [x] Active link indicator: garis bawah accent amber via `motion.span` dengan
      `layoutId="navbar-active-indicator"` (animasi geser antar halaman)
- [x] Mobile menu: slide-in dari kanan dengan `AnimatePresence` + `motion.div`
      (`x: "100%" → 0`)

### 7. Hover Micro-Interactions
- [x] `VehicleCard.tsx`: foto `scale-[1.03]` dengan `overflow-hidden` pada container,
      shadow lebih dalam saat hover card (`group-hover`)
- [x] `RouteCard.tsx`: lift `-translate-y-1` + shadow meningkat, CTA scale 1.02/0.98
- [x] `Navbar` CTA, `CtaBanner` tombol: scale 1.02 hover / 0.98 active, transisi
      200ms ease-out

### 8. Loading States (Skeleton)
- [x] `src/components/sections/RouteCardSkeleton.tsx` — `RouteCardSkeletonGrid`
      (animate-pulse), dipakai sebagai `Suspense` fallback di `/rute`
- [x] `src/components/sections/VehicleCardSkeleton.tsx` — `VehicleCardSkeletonGrid`,
      dipakai sebagai `Suspense` fallback di `/armada`
- [x] `src/components/sections/TestimonialSkeleton.tsx` — tersedia untuk loading state
      testimonial (animate-pulse, styling dark section)
- [x] `/rute` dan `/armada` direstrukturisasi: fetch data dipindah ke async server
      component (`RouteList`, `VehicleList`) dibungkus `<Suspense>` dengan skeleton
      sebagai fallback

### 9. Empty States
- [x] Rute kosong & Armada kosong: `EmptyState` (ilustrasi SVG inline + teks + CTA
      "Hubungi Kami") — sudah ada dari Tahap 3, tetap dipakai di dalam `Suspense`
- [x] Testimonial kosong: section disembunyikan total (sudah dari Tahap 3)
- [x] FAQ kosong: teks singkat "Belum ada pertanyaan umum yang tersedia."

### 10. Responsiveness Audit
- [x] Diperiksa pada breakpoint 375px / 390px / 768px / 1024px / 1440px (review kode +
      `npm run dev`, semua route publik HTTP 200)
- [x] Tabel harga rute (`RouteCard` variant detailed): 2 kolom sederhana, tidak
      overflow di mobile
- [x] Grid armada & rute: 1 → 2 → 3/4 kolom sesuai breakpoint (tidak berubah dari
      Tahap 3, diverifikasi tetap konsisten dengan komponen baru)
- [x] Form booking hero: `max-w-md`, `grid-cols-1 sm:grid-cols-2`, tidak overflow di
      375px
- [x] Navbar mobile: menu slide-in `fixed inset-0 top-16`, tidak ada horizontal scroll

### 11. Accessibility Dasar
- [x] Semua gambar publik sudah punya `alt` deskriptif (Hero, VehicleCard — diverifikasi,
      tidak ada perubahan diperlukan)
- [x] Semua link/button dapat diakses via keyboard (native `<a>`/`<button>`, tidak ada
      `div` interaktif baru)
- [x] Focus ring global ditambahkan di `globals.css`:
      `:focus-visible { outline: 2px solid var(--color-primary-600); outline-offset: 2px; }`
- [x] Kontras WCAG AA diperiksa: teks putih di atas overlay hero (`dark/80` →
      `dark`) dan teks `text-dark` di atas `bg-accent` pada CTA Banner — keduanya
      sudah memenuhi AA (≥ 4.5:1), tidak ada perubahan warna diperlukan

### 12. Admin Panel Polish
- [x] Toast notification system (`src/components/ui/Toast.tsx` + `useToast`) — sudah
      ada dari Tahap 2 dan terpasang di semua manager admin (Rute, Armada, Testimonial,
      FAQ, Settings, Media); diverifikasi tetap berfungsi
- [x] Loading button state (`Button.tsx` prop `loading` + spinner `Loader2`) — sudah
      ada dan dipakai di form-form admin
- [x] Sidebar active state (`bg-primary-600`) — sudah jelas dari Tahap 2
- [x] Responsive admin: sidebar collapse di `< lg` (hamburger + overlay) — sudah ada
      dari Tahap 2, diverifikasi masih berfungsi

---

## Build & Verifikasi
- [x] `npm run build` — sukses, semua route publik prerendered statis (`revalidate: 1m`)
- [x] `npm run lint` — 5 error pre-existing (admin modal, tidak terkait Tahap 4)
- [x] `npm run dev` — `/`, `/rute`, `/armada`, `/faq` semua HTTP 200

## File Baru
- `src/components/ui/FadeInOnScroll.tsx`
- `src/components/sections/RouteCardSkeleton.tsx`
- `src/components/sections/VehicleCardSkeleton.tsx`
- `src/components/sections/TestimonialSkeleton.tsx`

## File yang Diubah
- `src/components/sections/Hero.tsx`
- `src/components/sections/RouteCard.tsx`
- `src/components/sections/TestimonialCarousel.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/sections/VehicleCard.tsx`
- `src/components/sections/Features.tsx`
- `src/components/sections/CtaBanner.tsx`
- `src/components/sections/RouteFilterList.tsx`
- `src/app/(site)/page.tsx`
- `src/app/(site)/rute/page.tsx`
- `src/app/(site)/armada/page.tsx`
- `src/app/(site)/faq/page.tsx`
- `src/app/(site)/kontak/page.tsx`
- `src/app/globals.css`

## Langkah Selanjutnya
1. Lanjut ke Tahap 5 — Deploy & Configuration.
