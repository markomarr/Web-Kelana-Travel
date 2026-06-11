# TAHAP 1 — Foundation & Infrastructure — DONE

## Catatan Penting: Penyesuaian Versi dari PRD

PRD (Section 6) mengasumsikan Next.js 14 + Tailwind CSS v3 + Prisma v5. Saat scaffolding,
`create-next-app@latest` dan `npm install` menarik versi terbaru yang sudah tersedia.
Setelah dikonfirmasi dengan user, project ini menggunakan **versi terbaru** sebagai berikut
(bukan versi yang tertulis literal di PRD):

| Package      | Versi PRD | Versi dipakai | Catatan |
|--------------|-----------|----------------|---------|
| Next.js      | 14        | **16.2.9**     | App Router, Turbopack. File konvensi `middleware.ts` sudah deprecated → diganti `src/proxy.ts` (`export { auth as proxy }`). |
| React        | 18        | **19.2.4**     | Mengikuti Next 16. |
| Tailwind CSS | v3        | **v4**         | Tidak ada `tailwind.config.ts`. Design tokens didefinisikan via `@theme` di `src/app/globals.css` (cara Tailwind v4). Semua token warna PRD (`primary`, `accent`, dst) tersedia sebagai utility class (`bg-primary`, `text-accent`, dll). |
| Prisma       | v5        | **v6.19.3**    | Prisma v7 (terbaru) mengubah arsitektur datasource (wajib driver adapter, `url` tidak boleh di schema) — terlalu menyimpang dari workflow `DATABASE_URL` + `prisma db push` yang dipakai di seluruh PRD, jadi dipin ke v6 yang masih kompatibel. |
| next-auth    | v5 beta   | **5.0.0-beta.31** | Sesuai PRD. |

Tidak ada `tailwind.config.ts` — jika ada instruksi tahap selanjutnya yang merujuk ke file ini,
gunakan `src/app/globals.css` (`@theme` block) sebagai gantinya.

---

## Checklist

- [x] Next.js 16 (App Router, TypeScript strict, Tailwind v4, src dir, alias `@/*`) ter-setup
- [x] Dependencies terinstall: framer-motion, lucide-react, next-auth@beta, prisma, @prisma/client,
      @supabase/supabase-js, bcryptjs, @types/bcryptjs, ts-node
- [x] `prisma/schema.prisma` berisi 8 model: SiteSettings, Vehicle, Route, RoutePrice,
      Testimonial, Feature, FaqItem, AdminUser — lengkap dengan `@map`/`@@map` ke nama tabel
      snake_case sesuai PRD Section 5, index sesuai PRD ("Index penting")
- [x] Struktur folder dibuat sesuai PRD Section 7:
      `src/app/(site)/`, `src/app/admin/`, `src/app/api/admin/`,
      `src/components/{ui,sections,admin}/`, `src/lib/`, `src/types/` (semua dengan `.gitkeep`)
- [x] `src/lib/prisma.ts` — Prisma client singleton
- [x] `src/lib/supabase.ts` — `createServerClient()` (service role) & `createBrowserClient()` (anon key)
- [x] `src/lib/auth.ts` — NextAuth v5, Credentials provider (cek `admin_users` + bcrypt),
      session JWT, `authorized` callback memproteksi semua `/admin/*` kecuali `/admin/login`
- [x] `src/lib/utils.ts` — `formatRupiah()`, `buildWhatsAppUrl()`, `generateSlug()`
- [x] `.env.local` template dibuat (semua variable kosong)
- [x] Design tokens (warna PRD) + font (Plus Jakarta Sans, Inter, JetBrains Mono via `next/font/google`)
      di `src/app/globals.css` & `src/app/layout.tsx`
- [x] `src/proxy.ts` — proteksi route `/admin/*` (pengganti `middleware.ts` di Next 16)
- [x] `prisma/seed.ts` — seed data:
      1 admin user (`admin@kelanatravel.com` / `kelana2024`, password di-hash bcrypt),
      5 rute dummy Yogyakarta-Jateng (+ harga HiAce & Avanza),
      3 armada (HiAce Commuter, Avanza, Xenia),
      1 site_settings, 3 features, 4 faq_items, 3 testimonials (published)
- [x] Script `db:seed`, `db:push`, `db:studio` di `package.json` + config `prisma.seed`
- [x] `npm run build` berhasil tanpa error TypeScript

## Belum Dijalankan (menunggu credentials Supabase)

- `npx prisma db push` — perlu `DATABASE_URL` valid di `.env.local`
- `npm run db:seed` — perlu DB sudah sync
- `npm run dev`

## Langkah Selanjutnya

1. Isi `.env.local` dengan credentials Supabase (DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY,
   SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_*, NEXTAUTH_SECRET via `openssl rand -base64 32`)
2. Jalankan `npm run db:push` lalu `npm run db:seed`
3. Lanjut ke Tahap 2 — Admin Panel
