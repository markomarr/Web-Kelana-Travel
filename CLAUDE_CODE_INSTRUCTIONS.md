# CLAUDE CODE INSTRUCTIONS — Kelana Travel
# Baca PRD.md terlebih dahulu sebelum memulai tahap apapun.

---

## CARA PAKAI DOKUMEN INI

Jalankan satu tahap per sesi Claude Code.
Setiap tahap memiliki:
- **KONTEKS** — apa yang sedang dibangun dan mengapa
- **SEBELUM MULAI** — checklist prerequisite
- **INSTRUKSI UTAMA** — prompt yang bisa langsung di-paste ke Claude Code
- **DEFINISI SELESAI** — kriteria yang harus terpenuhi sebelum lanjut ke tahap berikutnya

Jangan lanjut ke tahap berikutnya jika Definisi Selesai belum terpenuhi.

---

---

# TAHAP 1 — Foundation & Infrastructure

## KONTEKS
Tahap ini membangun tulang punggung project: setup Next.js, konfigurasi database schema
via Prisma, koneksi Supabase, struktur folder, dan design tokens. Tidak ada UI yang dibangun
di tahap ini — hanya fondasi yang benar agar semua tahap berikutnya tidak perlu refactor.

## SEBELUM MULAI
- [ ] Folder `kelana-travel-web` sudah dibuat
- [ ] Supabase project sudah dibuat di supabase.com (free tier), catat: URL, anon key, service role key
- [ ] Node.js >= 18 tersedia (`node -v`)
- [ ] PRD.md sudah ada di dalam folder project

## INSTRUKSI UNTUK CLAUDE CODE

```
Baca PRD.md yang ada di folder ini terlebih dahulu secara lengkap sebelum melakukan apapun.

Kita akan mengerjakan Tahap 1: Foundation & Infrastructure.
Jangan membangun UI apapun di tahap ini.

Lakukan hal berikut secara berurutan:

1. SETUP PROJECT
   Jalankan:
   npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
   (titik artinya install di folder saat ini, bukan buat folder baru)

2. INSTALL DEPENDENCIES
   npm install framer-motion lucide-react
   npm install next-auth@beta
   npm install prisma @prisma/client
   npm install @supabase/supabase-js
   npm install bcryptjs
   npm install -D @types/bcryptjs

3. INISIALISASI PRISMA
   npx prisma init --datasource-provider postgresql

4. BUAT PRISMA SCHEMA
   Buat schema lengkap di prisma/schema.prisma berdasarkan Section 5 PRD.
   Tabel yang harus ada:
   - site_settings (singleton)
   - vehicles
   - routes
   - route_prices
   - testimonials
   - features
   - faq_items
   - admin_users
   Gunakan tipe data yang sesuai, tambahkan semua index yang disebutkan di PRD Section 5.
   Gunakan uuid sebagai PK untuk semua tabel kecuali site_settings (int).

5. BUAT STRUKTUR FOLDER
   Buat struktur folder persis seperti di PRD Section 7:
   src/app/(site)/
   src/app/admin/
   src/app/api/admin/
   src/components/ui/
   src/components/sections/
   src/components/admin/
   src/lib/
   src/types/
   
   Untuk setiap folder, buat file .gitkeep agar folder tidak kosong.

6. BUAT FILE KONFIGURASI DASAR
   
   a. src/lib/prisma.ts
      Prisma client singleton (pattern standar untuk Next.js).
   
   b. src/lib/supabase.ts
      Dua export:
      - createServerClient() untuk server-side (gunakan service role key)
      - createBrowserClient() untuk client-side (gunakan anon key)
   
   c. src/lib/auth.ts
      NextAuth v5 config dengan Credentials provider.
      - Cek email + password dari tabel admin_users
      - Verifikasi password dengan bcrypt
      - Session strategy: JWT
      - Authorized callback: proteksi semua route /admin/* kecuali /admin/login
   
   d. src/lib/utils.ts
      Buat helper functions:
      - formatRupiah(amount: number): string
        → Output: "Rp 150.000" (locale Indonesia, titik sebagai pemisah ribuan)
      - buildWhatsAppUrl(phone: string, message: string): string
        → Output: "https://wa.me/{phone}?text={encoded}"
      - generateSlug(text: string): string
        → lowercase, ganti spasi dengan -, hapus karakter non-alphanumeric

7. BUAT FILE .env.local
   Buat template .env.local dengan semua variable yang dibutuhkan (nilai kosong):
   DATABASE_URL=""
   NEXTAUTH_SECRET=""
   NEXTAUTH_URL="http://localhost:3000"
   SUPABASE_URL=""
   SUPABASE_ANON_KEY=""
   SUPABASE_SERVICE_ROLE_KEY=""
   NEXT_PUBLIC_SUPABASE_URL=""
   NEXT_PUBLIC_SUPABASE_ANON_KEY=""

8. BUAT DESIGN TOKENS DI TAILWIND CONFIG
   Update tailwind.config.ts dengan extend colors berdasarkan design system di PRD Section 7:
   primary: '#1A3C5E'
   primary-600: '#2E6DA4'
   accent: '#E8A020'
   accent-hover: '#D4901A'
   surface: '#F7F8FA'
   surface-alt: '#EEF2F7'
   dark: '#0D1B2A'
   text-primary: '#1A1A2E'
   text-secondary: '#4A5568'
   text-muted: '#8896A7'
   
   Tambahkan juga fontFamily:
   display: ['Plus Jakarta Sans', 'sans-serif']
   body: ['Inter', 'sans-serif']
   mono: ['JetBrains Mono', 'monospace']

9. UPDATE globals.css
   Import Google Fonts: Plus Jakarta Sans (700, 800), Inter (400, 500, 600), JetBrains Mono (400).
   Set font-family default ke Inter di body.
   Tambahkan CSS custom properties untuk warna-warna token.

10. BUAT MIDDLEWARE
    Buat src/middleware.ts yang proteksi semua route /admin/* kecuali /admin/login.
    Gunakan NextAuth v5 middleware.

11. SEED FILE
    Buat prisma/seed.ts dengan data awal:
    - 1 admin user: email "admin@kelanatravel.com", password "kelana2024" (di-hash bcrypt)
    - 5 rute dummy area Yogyakarta-Jateng:
      Yogyakarta → Semarang (3-4 jam)
      Yogyakarta → Solo (1-1.5 jam)
      Yogyakarta → Magelang (1 jam)
      Solo → Semarang (2-3 jam)
      Magelang → Semarang (2 jam)
    - 3 armada dummy:
      Toyota HiAce Commuter (kapasitas 14, fasilitas: AC, Charger, Musik)
      Toyota Avanza (kapasitas 7, fasilitas: AC, Charger)
      Daihatsu Xenia (kapasitas 7, fasilitas: AC)
    - 1 site_settings row dengan data placeholder
    - 3 features (keunggulan) dummy
    - 4 faq_items dummy
    - 3 testimonials dummy (published: true)
    
    Tambahkan script di package.json:
    "db:seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
    "db:push": "prisma db push"
    "db:studio": "prisma studio"

Setelah semua selesai, buat file TAHAP1_DONE.md yang berisi checklist apa saja yang sudah dibuat.
Jangan jalankan npm run dev dulu — tunggu instruksi berikutnya.
```

## DEFINISI SELESAI — Tahap 1
- [ ] `npm run build` berhasil tanpa error TypeScript
- [ ] `prisma/schema.prisma` berisi semua 8 tabel
- [ ] `src/lib/prisma.ts`, `auth.ts`, `supabase.ts`, `utils.ts` ada dan tidak ada type error
- [ ] `tailwind.config.ts` berisi semua token warna dan font dari PRD
- [ ] `src/middleware.ts` ada
- [ ] `prisma/seed.ts` ada dengan data dummy lengkap
- [ ] `.env.local` template ada (nilai boleh masih kosong)

---

---

# TAHAP 2 — Admin Panel

## KONTEKS
Admin panel dibangun sebelum website publik karena menjadi sumber data untuk frontend.
Setelah tahap ini selesai, database sudah berisi data real yang bisa langsung digunakan
oleh halaman publik. Admin panel juga merupakan fitur utama untuk demo ke calon klien.

## SEBELUM MULAI
- [ ] Tahap 1 selesai (semua Definisi Selesai terpenuhi)
- [ ] .env.local sudah diisi dengan credentials Supabase dan Prisma yang valid
- [ ] `npx prisma db push` sudah dijalankan (schema sync ke Supabase)
- [ ] `npm run db:seed` sudah dijalankan (data dummy sudah masuk DB)
- [ ] `npm run dev` bisa berjalan tanpa error

## INSTRUKSI UNTUK CLAUDE CODE

```
Baca PRD.md Section 3 (Fitur 8) dan Section 7 (Design System Admin Panel) terlebih dahulu.

Kita akan mengerjakan Tahap 2: Admin Panel.
Database sudah ada dan terisi data dummy.

Bangun admin panel dengan urutan berikut:

1. LAYOUT ADMIN
   Buat src/app/admin/layout.tsx:
   - Sidebar navigasi (lebar 260px, background #1A3C5E, teks putih)
   - Menu items: Dashboard, Rute & Harga, Armada, Testimonial, FAQ, Media, Pengaturan
   - User info di bagian bawah sidebar (nama + tombol logout)
   - Content area di kanan dengan background #F1F5F9
   - Layout ini hanya aktif untuk route /admin/* (kecuali /admin/login)
   - Sidebar collapse di mobile (hamburger menu)
   - Gunakan Lucide React untuk semua icon navigasi

2. HALAMAN LOGIN ADMIN (/admin/login)
   - Form: email + password
   - Validasi inline per field
   - Error state: "Email atau password salah" jika credentials salah
   - Loading state saat submit
   - Redirect ke /admin/dashboard setelah berhasil
   - Desain: centered card di tengah halaman, background dark navy
   - Logo/nama "Kelana Travel Admin" di atas form
   - TIDAK menggunakan layout sidebar (halaman standalone)

3. DASHBOARD (/admin/dashboard)
   - Stats cards: Total Rute Aktif, Total Armada, Total Testimonial Published, Total FAQ
   - Fetch angka real-time dari DB via server component
   - Quick action buttons: ke masing-masing CRUD section
   - Sambutan: "Selamat datang, [nama admin]"

4. CRUD RUTE & HARGA (/admin/rute)
   
   Halaman list:
   - Tabel: No, Rute (Kota Asal → Kota Tujuan), Durasi, Status (badge Aktif/Nonaktif), Jumlah Harga, Aksi
   - Paginasi sederhana (10 item per halaman)
   - Tombol "Tambah Rute" di kanan atas
   - Toggle aktif/nonaktif langsung dari tabel (tanpa reload halaman)
   - Tombol Edit dan Hapus per baris
   - Konfirmasi dialog sebelum hapus

   Modal/form tambah dan edit:
   - Field: Kota Asal, Kota Tujuan, Estimasi Durasi, Status
   - Validasi semua field wajib
   
   Manajemen harga (sub-section atau tab dalam detail rute):
   - List harga yang sudah ada: Armada — Harga
   - Tambah harga baru: pilih armada (dropdown dari DB), input harga (Rupiah)
   - Edit harga
   - Hapus harga
   - Input harga: angka saja, tampilkan preview format Rupiah otomatis

5. CRUD ARMADA (/admin/armada)
   
   Halaman list:
   - Grid atau tabel: foto thumbnail, nama, kapasitas, fasilitas (badges), status, aksi
   - Tombol "Tambah Armada"
   - Toggle aktif/nonaktif
   - Edit dan Hapus dengan konfirmasi

   Form tambah/edit:
   - Field: Nama, Kapasitas (number), Deskripsi (textarea), Status
   - Upload foto:
     * Area drag & drop atau klik untuk pilih file
     * Preview foto setelah dipilih (sebelum save)
     * Validasi: hanya jpg/png/webp, max 2MB
     * Upload ke Supabase Storage bucket "kelana-media" di folder "armada/"
     * Simpan URL ke field photo_url
   - Fasilitas: multi-select atau checkbox list
     Opsi default: AC, Charger, Toilet, WiFi, Musik, TV, Snack
     Admin bisa pilih kombinasi

6. FILE MANAGER (/admin/media)
   
   - Tampilan galeri (grid) semua file di Supabase Storage bucket "kelana-media"
   - Fetch daftar file dari Supabase Storage API
   - Setiap item: thumbnail gambar, nama file, tombol Copy URL, tombol Hapus
   - Upload area di bagian atas: drag & drop atau klik
     * Validasi format dan ukuran
     * Progress indicator saat upload
     * File baru langsung muncul di galeri setelah upload
   - Konfirmasi sebelum hapus
   - Toast notification untuk semua aksi (berhasil/gagal)
   - Filter: semua file tampil, urutkan terbaru dulu

7. CRUD TESTIMONIAL (/admin/testimonial)
   
   - Tabel: Nama, Rating (bintang), Rute, Status Published, Aksi
   - Toggle published/unpublished langsung dari tabel
   - Form tambah/edit: Nama, Rating (1-5 bintang, klik untuk pilih), Teks Ulasan, Rute yang Digunakan, Foto (upload opsional)
   - Hapus dengan konfirmasi

8. CRUD FAQ (/admin/faq)
   
   - Tabel dengan kolom Order, Pertanyaan (terpotong 60 karakter), Aksi
   - Tombol naik/turun untuk reorder (update field order di DB)
   - Form tambah/edit: Pertanyaan, Jawaban (textarea)
   - Hapus dengan konfirmasi

9. PENGATURAN WEBSITE (/admin/settings)
   
   - Form single-page untuk site_settings:
     * Informasi Bisnis: Nama, Nomor WA (format 628xxx), Nomor Tampilan, Email, Alamat
     * Hero: Tagline, Sub-teks, Upload foto hero
     * Google Maps: URL embed
   - Preview nomor WA: tampilkan link wa.me yang akan dihasilkan
   - Satu tombol "Simpan Perubahan" di bawah
   - Toast sukses setelah simpan

10. API ROUTES (untuk semua operasi admin)
    Buat di src/app/api/admin/:
    - Setiap API route WAJIB cek session NextAuth di baris pertama
    - Jika tidak ada session → return 401 Unauthorized
    - Gunakan Prisma untuk semua operasi DB
    - Return JSON dengan format konsisten: { success: boolean, data?: any, error?: string }
    
    Route yang dibutuhkan:
    GET/POST    /api/admin/routes
    GET/PUT/DELETE /api/admin/routes/[id]
    GET/POST    /api/admin/routes/[id]/prices
    PUT/DELETE  /api/admin/routes/[id]/prices/[priceId]
    GET/POST    /api/admin/vehicles
    GET/PUT/DELETE /api/admin/vehicles/[id]
    GET/POST    /api/admin/testimonials
    GET/PUT/DELETE /api/admin/testimonials/[id]
    GET/POST    /api/admin/faq
    GET/PUT/DELETE /api/admin/faq/[id]
    GET/PUT     /api/admin/settings
    POST        /api/admin/media/upload
    GET         /api/admin/media
    DELETE      /api/admin/media/[filename]

CATATAN DESAIN ADMIN PANEL:
- Sidebar: background #1A3C5E, teks putih, active item background #2E6DA4
- Content background: #F1F5F9
- Card/panel: white, shadow-sm, rounded-xl
- Button primary: background #2E6DA4, hover #1A3C5E
- Font: Inter saja untuk semua teks admin
- Tabel: header background #F1F5F9, border-bottom per row, hover highlight #EEF2F7
- Badge Aktif: green background, Badge Nonaktif: gray background
- Jangan gunakan library UI component eksternal (Shadcn, MUI, dll)
- Bangun semua komponen dari Tailwind CSS murni

Setelah semua selesai, buat TAHAP2_DONE.md dengan checklist yang sudah selesai.
```

## DEFINISI SELESAI — Tahap 2
- [ ] Login di `/admin/login` berfungsi dengan credentials dari seed data
- [ ] Semua route `/admin/*` redirect ke login jika belum login
- [ ] Dashboard menampilkan angka statistik real dari DB
- [ ] CRUD Rute: tambah, edit, toggle aktif, hapus berfungsi
- [ ] CRUD Armada: tambah dengan upload foto, edit, hapus berfungsi
- [ ] Upload foto tersimpan di Supabase Storage dan URL tersimpan di DB
- [ ] File Manager: galeri tampil, upload baru, hapus berfungsi
- [ ] CRUD Testimonial dan FAQ berfungsi
- [ ] Pengaturan: perubahan tersimpan ke DB
- [ ] Semua API route return 401 jika tidak ada session

---

---

# TAHAP 3 — Website Publik

## KONTEKS
Website publik yang dilihat oleh calon penumpang. Data diambil langsung dari database
yang sudah diisi via admin panel di Tahap 2. Tidak ada data hardcode di frontend.
Fokus tahap ini: struktur dan konten. Animasi detail dikerjakan di Tahap 4.

## SEBELUM MULAI
- [ ] Tahap 2 selesai
- [ ] Admin panel sudah digunakan untuk mengisi konten (rute, armada, testimonial, FAQ, settings)
- [ ] Supabase Storage sudah berisi minimal 1 foto armada dan foto hero

## INSTRUKSI UNTUK CLAUDE CODE

```
Baca PRD.md Section 3 (Fitur 1–7), Section 4 (User Flow), dan Section 7 (Design System Website Publik).

Kita akan mengerjakan Tahap 3: Website Publik.
Semua data harus diambil dari database, TIDAK ada data hardcode.

PENTING — Design Brief untuk semua halaman publik:
- Palet: primary #1A3C5E (navy), accent #E8A020 (amber), surface #F7F8FA, dark #0D1B2A
- Font display/heading: Plus Jakarta Sans (700-800), body: Inter, angka harga: JetBrains Mono
- Card radius: rounded-2xl, button CTA: rounded-full (pill), input: rounded-xl
- Bukan desain merah-putih template travel generik
- Mobile-first — bangun dari 375px ke atas
- Signature element: kartu rute menggunakan visual "jalur perjalanan" dot → garis → dot

Bangun halaman berikut:

1. LAYOUT PUBLIK (src/app/(site)/layout.tsx)
   
   Navbar:
   - Logo "Kelana Travel" di kiri (teks dengan ikon peta/perjalanan, atau placeholder untuk logo)
   - Menu: Beranda, Rute & Harga, Armada, FAQ, Kontak
   - CTA button "Pesan Sekarang" di kanan (accent amber, pill shape)
   - Sticky dengan backdrop blur saat scroll
   - Mobile: hamburger menu yang slide-in dari kanan
   - Warna awal: transparan di atas hero, solid navy setelah scroll
   
   Footer:
   - Logo + tagline singkat
   - Kolom: Navigasi, Rute Populer, Kontak
   - Nomor WA dan email dari site_settings (fetch dari DB)
   - Copyright
   - Background #0D1B2A (dark)

2. HOMEPAGE (src/app/(site)/page.tsx)
   
   Section 1 — Hero:
   - Background: foto hero dari site_settings (full-screen, dengan overlay gradient gelap)
   - Headline: tagline dari site_settings (font Plus Jakarta Sans 800, putih, besar)
   - Sub-teks dari site_settings
   - Form inquiry booking:
     * Dropdown kota asal (dari DB: distinct city_from)
     * Dropdown kota tujuan (dari DB: distinct city_to, filter berdasarkan kota asal jika ada)
     * Date picker: tanggal keberangkatan (min: hari ini)
     * Number input: jumlah penumpang (min 1, max 20)
     * Input teks: nama pemesan
     * Tombol "Pesan Sekarang" (accent amber, pill, full-width di mobile)
     * Form background: white card dengan rounded-2xl, shadow-lg
   - Validasi client-side: semua field wajib, tanggal tidak masa lalu
   - Submit: buildWhatsAppUrl() dari lib/utils.ts → window.open()
   
   Section 2 — Keunggulan (Why Choose Us):
   - Fetch dari tabel features, urut by order, max 6 item
   - Grid 3 kolom desktop, 2 kolom tablet, 1 kolom mobile
   - Setiap item: icon (Lucide, gunakan icon_key dari DB), judul, deskripsi
   - Background: surface (#F7F8FA)
   - Sembunyikan section jika data kosong
   
   Section 3 — Rute Populer (preview 4 rute):
   - Fetch 4 rute aktif pertama dari DB
   - Tampilkan dengan visual "jalur perjalanan":
     * Titik berwarna (primary navy) + nama kota asal
     * Garis putus-putus horizontal
     * Titik berwarna (accent amber) + nama kota tujuan
     * Di bawah: estimasi durasi + harga mulai dari (harga terendah dari route_prices)
     * CTA: "Pesan Rute Ini" → WhatsApp dengan rute pre-filled
   - Link "Lihat Semua Rute →" di bawah grid
   - Background: white
   
   Section 4 — Armada (preview 3 armada):
   - Fetch 3 armada aktif pertama
   - Card: foto (next/image), nama, kapasitas (X penumpang), fasilitas badges
   - Link "Lihat Semua Armada →"
   - Background: surface-alt (#EEF2F7)
   
   Section 5 — Testimonial:
   - Fetch testimonial published
   - Carousel horizontal (scroll snap atau custom dengan Framer Motion drag)
   - Card: nama, rating bintang, teks ulasan, rute yang digunakan
   - Sembunyikan section jika tidak ada data published
   - Background: dark (#0D1B2A) — section gelap sebagai visual break
   
   Section 6 — CTA Banner:
   - Background: accent amber (#E8A020)
   - Teks: "Siap Berangkat?" + sub-teks singkat
   - Tombol: "Hubungi Kami via WhatsApp" (navy, pill) + "Lihat Rute & Harga" (outline putih, pill)
   
   Section 7 — FAQ Preview (4 item pertama):
   - Fetch 4 FAQ pertama (urut by order)
   - Accordion sederhana
   - Link "Lihat Semua FAQ →"
   - Background: surface

3. HALAMAN RUTE & HARGA (/rute)
   
   - Fetch semua rute aktif + route_prices + vehicle dari DB
   - Filter/tab per kota asal (client-side filtering, tanpa page reload)
   - Setiap rute ditampilkan sebagai card dengan visual jalur perjalanan (lebih detail dari homepage):
     * Kota asal ↔ kota tujuan dengan visual dot-line-dot
     * Estimasi durasi
     * Tabel harga: kolom Armada — Harga (JetBrains Mono untuk angka)
     * Jika tidak ada harga: teks "Hubungi kami"
     * CTA: "Pesan Rute Ini" per kartu → WhatsApp pre-filled
   - Empty state jika tidak ada rute aktif

4. HALAMAN ARMADA (/armada)
   
   - Fetch semua armada aktif dari DB
   - Grid 3 kolom desktop, 2 tablet, 1 mobile
   - Card: foto (next/image dengan aspek ratio 16:9), nama armada, badge kapasitas,
     daftar fasilitas (icon Lucide + label), deskripsi singkat
   - Jika tidak ada foto: placeholder dengan warna primary + ikon armada
   - Empty state jika tidak ada armada aktif

5. HALAMAN FAQ (/faq)
   
   - Fetch semua FAQ dari DB, urut by order
   - Accordion: exclusive (satu terbuka menutup yang lain)
   - Animasi expand/collapse (Framer Motion AnimatePresence)
   - Empty state jika tidak ada data

6. HALAMAN KONTAK (/kontak)
   
   - Fetch info kontak dari site_settings (DB)
   - Kolom kiri: informasi kontak
     * Nomor WA (klik → wa.me link)
     * Nomor telepon tampilan
     * Email (klik → mailto)
     * Alamat
     * Social links jika ada
   - Kolom kanan: embed Google Maps (iframe src dari maps_embed_url di DB)
   - Form pesan:
     * Nama, Nomor HP, Pesan
     * Submit → WhatsApp dengan format pesan
   - Empty state jika maps_embed_url kosong: tampilkan peta placeholder

7. METADATA & SEO
   Untuk setiap halaman, tambahkan generateMetadata():
   - title: "[Nama Halaman] — Kelana Travel"
   - description: yang relevan per halaman
   - openGraph: title, description, type
   Ambil site_name dari DB jika memungkinkan.

8. DATA FETCHING PATTERN
   - Semua halaman publik: Server Components dengan ISR revalidate 60
   - Gunakan Prisma langsung di server component (bukan via API route)
   - Susun query Prisma secara efisien (sertakan relasi yang dibutuhkan dengan include)
   - Buat file src/lib/queries.ts yang berisi semua Prisma query function:
     getActiveRoutes(), getActiveVehicles(), getPublishedTestimonials(), getFaqs(),
     getSiteSettings(), getFeatures()
     Ini memudahkan reuse dan testing.

CATATAN:
- next/image: tambahkan domain Supabase di next.config.ts
  images: { remotePatterns: [{ hostname: '*.supabase.co' }] }
- Semua teks konten (bukan UI label) diambil dari DB — tidak ada hardcode copy
- Error boundary di setiap halaman dengan pesan yang user-friendly

Setelah selesai, buat TAHAP3_DONE.md dengan checklist.
```

## DEFINISI SELESAI — Tahap 3
- [ ] Homepage menampilkan semua 7 section dengan data dari DB
- [ ] Form booking berfungsi: validasi, submit, buka WhatsApp dengan pesan terformat
- [ ] Halaman `/rute` menampilkan rute aktif dengan harga per armada dari DB
- [ ] Halaman `/armada` menampilkan armada aktif dengan foto dari Supabase Storage
- [ ] Halaman `/faq` accordion berfungsi
- [ ] Halaman `/kontak` menampilkan data dari site_settings
- [ ] Tidak ada data hardcode — semua dari DB
- [ ] `npm run build` berhasil tanpa error

---

---

# TAHAP 4 — Polish & Animation

## KONTEKS
Tahap ini menambahkan lapisan visual yang membuat website terlihat profesional dan berbeda
dari template generik. Framer Motion digunakan secara purposeful, bukan dekoratif.
Juga mencakup: responsive fixes, empty states, error boundaries, dan aksesibilitas dasar.

## SEBELUM MULAI
- [ ] Tahap 3 selesai
- [ ] `npm run build` berhasil
- [ ] Semua halaman publik berfungsi dengan data real

## INSTRUKSI UNTUK CLAUDE CODE

```
Baca PRD.md Section 7 bagian Motion dan Design System.

Kita akan mengerjakan Tahap 4: Polish & Animation.
Jangan ubah fungsionalitas — hanya polish visual, animasi, dan accessibility.

1. ANIMASI HERO (Homepage)
   - Orchestrated entrance: headline fade-in + slide-up (delay 0), 
     sub-teks (delay 0.15s), form booking (delay 0.3s)
   - Satu kali saja saat halaman load — tidak loop
   - Gunakan Framer Motion motion.div dengan initial/animate/transition

2. SCROLL-TRIGGERED ANIMATIONS (semua section)
   Buat reusable component: src/components/ui/FadeInOnScroll.tsx
   - Gunakan Framer Motion useInView
   - Default: fade + translateY(20px) → normal, duration 0.5s
   - Stagger untuk grid items: setiap item delay += 0.1s
   - Gunakan di: section Keunggulan (stagger per item), section Rute (stagger per card),
     section Armada (stagger per card), semua section homepage lainnya
   - Pastikan prefers-reduced-motion: skip animasi jika user minta

3. SIGNATURE ELEMENT — ANIMATED ROUTE CARD
   Improve visual "jalur perjalanan" di kartu rute:
   - Saat card masuk viewport: garis putus-putus "tergambar" dari kiri ke kanan
     (animate pathLength dari 0 ke 1 menggunakan SVG + Framer Motion)
   - Titik kota asal: pulse animation subtle
   - Durasi animasi: 0.8s ease-out
   - Ini adalah elemen yang paling diingat — kerjakan dengan detail

4. TESTIMONIAL CAROUSEL
   - Auto-scroll setiap 4 detik
   - Pause saat hover atau touch
   - Smooth transition antar item (Framer Motion AnimatePresence)
   - Dot indicator di bawah (klik untuk navigate ke item tertentu)
   - Drag gesture untuk swipe manual di mobile

5. FAQ ACCORDION ANIMATION
   - Framer Motion AnimatePresence + layoutId untuk smooth expand/collapse
   - Ikon panah rotate 180° saat terbuka
   - Tidak ada height: auto jump — gunakan motion.div dengan overflow hidden

6. NAVBAR BEHAVIOR
   - Scroll effect: transparan → solid (background primary navy dengan backdrop-blur)
   - Transisi smooth 0.3s
   - Active link indicator: garis bawah accent amber pada menu yang aktif (usePathname)
   - Mobile menu: slide-in dari kanan dengan AnimatePresence

7. HOVER MICRO-INTERACTIONS
   - Card armada: foto scale(1.03) dengan overflow hidden, shadow lebih dalam
   - Card rute: subtle lift (translateY -4px) + shadow increase
   - Tombol CTA: scale(1.02) saat hover, scale(0.98) saat active/press
   - Semua transisi: duration 200ms ease-out

8. LOADING STATES
   Buat komponen skeleton loading untuk:
   - RouteCardSkeleton (dipakai di halaman rute)
   - VehicleCardSkeleton (dipakai di halaman armada)
   - TestimonialSkeleton
   Gunakan Tailwind animate-pulse

9. EMPTY STATES
   Pastikan semua empty state sudah ada dan tidak terlihat "broken":
   - Rute kosong: ilustrasi simpel (SVG inline) + teks + tombol "Hubungi Kami"
   - Armada kosong: sama
   - Testimonial kosong: section disembunyikan (bukan empty state)
   - FAQ kosong: teks singkat

10. RESPONSIVENESS AUDIT
    Cek dan fix di breakpoint berikut:
    - 375px (iPhone SE)
    - 390px (iPhone 14)
    - 768px (iPad)
    - 1024px (iPad landscape / laptop)
    - 1440px (desktop)
    
    Yang sering bermasalah:
    - Tabel harga rute di mobile (scroll horizontal atau stack vertikal)
    - Grid armada 3 kolom → 2 → 1
    - Form booking di hero — pastikan tidak overflow di 375px
    - Navbar mobile menu

11. ACCESSIBILITY DASAR
    - Semua gambar punya alt text yang deskriptif (bukan "image" atau "foto")
    - Semua link dan button accessible via keyboard (Tab)
    - Focus ring visible: outline-2 offset-2 dengan warna primary
    - Kontras WCAG AA: cek semua teks di atas background berwarna
      Khususnya: teks di hero overlay, teks di section amber CTA

12. ADMIN PANEL POLISH
    - Toast notification system (tanpa library eksternal):
      Buat src/components/ui/Toast.tsx + useToast hook
      Posisi: top-right, auto-dismiss 3 detik
    - Loading button state: spinner icon saat API call berlangsung
    - Sidebar active state yang lebih jelas
    - Responsive admin: sidebar collapse di viewport < 1024px (icon-only mode atau hidden)

Setelah selesai, buat TAHAP4_DONE.md dengan checklist.
```

## DEFINISI SELESAI — Tahap 4
- [ ] Hero entrance animation berfungsi, tidak loop
- [ ] Scroll-triggered animations berfungsi di semua section homepage
- [ ] Animated route card: garis "tergambar" saat masuk viewport
- [ ] Testimonial carousel: auto-scroll, pause on hover, swipe di mobile
- [ ] FAQ accordion smooth dengan Framer Motion
- [ ] `prefers-reduced-motion` dihormati (animasi skip)
- [ ] Tidak ada layout broken di 375px, 768px, 1440px
- [ ] `npm run build` berhasil tanpa warning

---

---

# TAHAP 5 — Deploy & Configuration

## KONTEKS
Deploy ke Vercel dan konfigurasi production. Termasuk: environment variables production,
Supabase production settings, sitemap, dan verifikasi semua fitur berjalan di environment live.

## SEBELUM MULAI
- [ ] Tahap 4 selesai
- [ ] `npm run build` berhasil tanpa error
- [ ] Vercel account sudah ada dan GitHub repo sudah di-push
- [ ] Supabase project sudah ada (boleh pakai yang sama dengan development)

## INSTRUKSI UNTUK CLAUDE CODE

```
Kita akan mengerjakan Tahap 5: Deploy & Configuration.

1. PERSIAPAN PRE-DEPLOY

   a. Buat next.config.ts yang lengkap:
      - images.remotePatterns: domain Supabase
      - env variables yang perlu di-expose ke client (NEXT_PUBLIC_*)
      - headers untuk security (X-Frame-Options, X-Content-Type-Options)
   
   b. Buat src/app/sitemap.ts (atau sitemap.xml):
      - Homepage, /rute, /armada, /faq, /kontak
      - Static routes saja (tidak perlu dynamic per item)
   
   c. Buat src/app/robots.ts:
      - Allow semua, kecuali /admin/*
      - Sitemap URL (isi dengan placeholder domain untuk sekarang)
   
   d. Buat src/app/not-found.tsx (custom 404):
      - Branded, ada tombol "Kembali ke Beranda"
   
   e. Pastikan semua NEXT_PUBLIC_ variables sudah benar di penggunaan

2. KONFIGURASI VERCEL
   
   Buat file vercel.json jika perlu (untuk redirect atau headers tambahan).
   
   Daftar Environment Variables yang harus di-set di Vercel Dashboard:
   (Buat file DEPLOY_CHECKLIST.md yang berisi list ini)
   
   DATABASE_URL          → Supabase connection string (pooling mode)
   NEXTAUTH_SECRET       → Generate: openssl rand -base64 32
   NEXTAUTH_URL          → URL production (mis. https://kelana-travel.vercel.app)
   SUPABASE_URL          → https://xxx.supabase.co
   SUPABASE_ANON_KEY     → dari Supabase dashboard
   SUPABASE_SERVICE_ROLE_KEY → dari Supabase dashboard
   NEXT_PUBLIC_SUPABASE_URL  → sama dengan SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY → sama dengan SUPABASE_ANON_KEY

3. SUPABASE PRODUCTION CONFIG
   
   Buat SUPABASE_SETUP.md dengan instruksi:
   a. Storage bucket "kelana-media": set sebagai public bucket
      (agar URL foto bisa diakses tanpa auth)
   b. CORS: tambahkan domain production ke allowed origins
   c. RLS (Row Level Security): untuk MVP, bisa disabled karena akses DB
      hanya via server-side Prisma (bukan langsung dari client)
      Dokumentasikan keputusan ini.
   
4. DATABASE PRODUCTION SETUP
   
   Setelah env vars diset di Vercel, buat instruksi di DEPLOY_CHECKLIST.md:
   npx prisma db push                  # sync schema ke production DB
   npx prisma db seed                  # (opsional) seed data awal
   
5. BUAT HALAMAN /admin/login YANG AMAN
   
   Pastikan:
   - Password admin di seed: ganti dari "kelana2024" ke password yang lebih kuat
     (generate random: buat script generate-admin.ts)
   - Tambahkan rate limiting sederhana pada /api/auth/callback (max 5 attempts)
     atau dokumentasikan bahwa ini perlu ditambahkan post-MVP
   - NEXTAUTH_SECRET wajib ada di production (NextAuth akan error jika tidak ada)

6. VERIFIKASI POST-DEPLOY CHECKLIST
   
   Buat POST_DEPLOY_TEST.md:
   [ ] Homepage terbuka di URL production
   [ ] Foto hero dan armada tampil (Supabase Storage CDN)
   [ ] Form booking: submit → WhatsApp terbuka dengan pesan terformat
   [ ] /admin/login: login berhasil
   [ ] Admin: tambah rute baru → cek di /rute dalam 60 detik
   [ ] Admin: upload foto → tampil di file manager
   [ ] /rute, /armada, /faq, /kontak semua terbuka tanpa error
   [ ] 404: buka /halaman-tidak-ada → custom 404 tampil
   [ ] Mobile: buka di viewport 375px, semua section berfungsi

Setelah selesai, buat TAHAP5_DONE.md.
```

## DEFINISI SELESAI — Tahap 5
- [ ] Build berhasil di Vercel (tidak ada build error)
- [ ] Semua halaman publik terbuka di URL production
- [ ] Admin panel berfungsi di production
- [ ] Foto dari Supabase Storage tampil di production
- [ ] DEPLOY_CHECKLIST.md dan POST_DEPLOY_TEST.md sudah ada

---

---

# TAHAP 6 — Testing & Seeding Portofolio

## KONTEKS
Tahap terakhir: mengisi data portofolio yang menarik untuk demo ke calon klien,
menjalankan test cases fungsional, dan final QA sebelum dianggap selesai.

## SEBELUM MULAI
- [ ] Tahap 5 selesai
- [ ] Website live di URL production

## INSTRUKSI UNTUK CLAUDE CODE

```
Kita akan mengerjakan Tahap 6: Testing & Portfolio Seeding.

1. PORTFOLIO SEED DATA
   
   Update data di database (via admin panel atau langsung via Prisma seed) dengan
   konten yang menarik untuk demo:
   
   Rute (lengkap dengan harga):
   - Yogyakarta → Semarang | 3-4 jam | HiAce: Rp 175.000, Avanza: Rp 155.000
   - Yogyakarta → Solo | 1-1.5 jam | HiAce: Rp 90.000, Avanza: Rp 75.000
   - Yogyakarta → Magelang | 1 jam | HiAce: Rp 85.000, Avanza: Rp 70.000
   - Yogyakarta → Purwokerto | 3 jam | HiAce: Rp 165.000, Avanza: Rp 145.000
   - Solo → Semarang | 2-3 jam | HiAce: Rp 150.000, Avanza: Rp 130.000
   - Magelang → Semarang | 2 jam | HiAce: Rp 135.000, Avanza: Rp 115.000
   - Yogyakarta → Wonosobo | 1.5-2 jam | HiAce: Rp 110.000, Avanza: Rp 95.000
   
   Armada (3 kendaraan dengan deskripsi menarik):
   - Toyota HiAce Commuter 2022 | 14 penumpang | AC, Charger, Musik, Bagasi Luas
   - Toyota Avanza 2023 | 7 penumpang | AC, Charger
   - Daihatsu Xenia 2022 | 7 penumpang | AC, Charger
   
   Keunggulan (6 item):
   - Armada Ber-AC & Terawat (icon: wind)
   - Driver Berpengalaman (icon: user-check)
   - Harga Transparan (icon: receipt)
   - Layanan Door-to-Door (icon: home)
   - Berangkat Tepat Waktu (icon: clock)
   - Layanan 24 Jam (icon: phone)
   
   Testimonial (5 item, published: true) — buat nama dan konten yang realistis
   
   FAQ (6 item) — pertanyaan umum travel: cara booking, refund, bagasi, dll
   
   Site settings: isi semua field dengan data dummy yang realistis

2. FUNCTIONAL TEST CASES
   
   Buat TEST_CASES.md dan jalankan manual, dokumentasikan hasil:
   
   TC01 — Form Booking Valid
   Input: semua field terisi, tanggal besok, 2 penumpang, nama "Budi Santoso"
   Expected: WhatsApp terbuka dengan pesan terformat
   
   TC02 — Form Booking Invalid (field kosong)
   Input: submit tanpa mengisi apapun
   Expected: error merah di setiap field, tidak ada redirect
   
   TC03 — Form Booking Tanggal Lalu
   Input: tanggal kemarin
   Expected: error "Pilih tanggal yang akan datang"
   
   TC04 — Admin Login Berhasil
   Input: email + password yang benar
   Expected: redirect ke /admin/dashboard
   
   TC05 — Admin Login Gagal
   Input: password salah
   Expected: error inline, tidak redirect
   
   TC06 — Akses Admin Tanpa Login
   Input: buka /admin/dashboard di incognito
   Expected: redirect ke /admin/login
   
   TC07 — CRUD Rute
   - Tambah rute baru → cek tampil di /rute
   - Edit harga → cek update di /rute (tunggu ≤60 detik)
   - Toggle nonaktif → cek hilang dari /rute
   - Hapus → konfirmasi muncul → hapus → tidak ada di list
   
   TC08 — Upload Foto Armada
   - Upload file JPG valid → preview muncul → simpan → foto tampil di /armada
   - Upload file non-gambar (mis. .pdf) → error "Format tidak didukung"
   
   TC09 — File Manager
   - Upload file baru → muncul di galeri
   - Copy URL → clipboard terisi
   - Hapus file → konfirmasi → file hilang dari galeri
   
   TC10 — Update Site Settings
   - Ubah tagline hero → simpan → cek di homepage
   - Ubah nomor WA → simpan → cek link WA di semua CTA
   
   TC11 — Mobile Responsiveness
   - Buka di Chrome DevTools 375px
   - Cek: navbar, hero form, grid rute, grid armada, carousel testimonial
   
   TC12 — Performa
   - Jalankan Lighthouse di Chrome untuk homepage
   - Target: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90

3. DOKUMENTASI FINAL
   
   Buat README.md di root project:
   - Deskripsi singkat project
   - Tech stack
   - Setup lokal (env vars yang dibutuhkan, langkah instalasi)
   - Cara akses admin panel (URL + credentials default)
   - Link demo live
   - Catatan untuk pengembangan lanjutan
   
   Buat HANDOVER.md (untuk simulasi handover ke klien):
   - Cara login ke admin panel
   - Cara update harga rute
   - Cara tambah armada baru dengan foto
   - Cara manage testimonial
   - Cara update info kontak dan nomor WhatsApp
   - Ditulis dalam Bahasa Indonesia, non-teknis, dengan screenshot placeholder

Setelah semua test cases lulus dan dokumentasi selesai, buat TAHAP6_DONE.md.
Project dianggap selesai (production-ready untuk portofolio).
```

## DEFINISI SELESAI — Tahap 6
- [ ] Semua 12 test cases lulus (dokumentasi di TEST_CASES.md)
- [ ] Lighthouse Performance ≥ 85 mobile
- [ ] Data portofolio lengkap: 7 rute, 3 armada, 5 testimonial, 6 FAQ, 6 keunggulan
- [ ] README.md lengkap dengan setup instructions
- [ ] HANDOVER.md ditulis dalam bahasa non-teknis

---

---

## CATATAN PENTING UNTUK SETIAP SESI CLAUDE CODE

**Di awal setiap sesi baru, paste ini:**

```
Baca PRD.md di folder ini terlebih dahulu.
Kita sedang mengerjakan [TAHAP X — nama tahap].
File instruksi lengkap ada di CLAUDE_CODE_INSTRUCTIONS.md.
Cek TAHAP[X-1]_DONE.md untuk memastikan tahap sebelumnya sudah selesai.
```

**Jika sesi terputus di tengah tahap:**

```
Baca PRD.md dan CLAUDE_CODE_INSTRUCTIONS.md.
Kita sedang di Tahap [X] yang terputus.
Lakukan audit: cek file apa yang sudah ada, apa yang belum.
Lanjutkan dari titik terakhir — jangan ulang dari awal.
```

**Jika ada error yang tidak bisa diselesaikan:**

Jangan paksakan solusi yang tidak dipahami. Dokumentasikan error di file
`BLOCKED_ISSUES.md` dengan:
- Deskripsi error
- Langkah reproduksi
- Yang sudah dicoba
- Hipotesis penyebab

Lanjutkan ke sub-task lain, kembali ke issue ini di akhir tahap.
