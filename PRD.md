# PRD — Kelana Travel

> **Versi:** 2.0 · **Tanggal:** 11 Juni 2026 · **Status:** Final (pending konfirmasi Section 8)
> **Tipe proyek:** APP — Next.js fullstack dengan custom Admin Panel
> **Tujuan ganda:** Website bisnis travel fungsional + portofolio ArTech untuk presentasi ke calon klien

---

## ATURAN UNTUK AI (baca dulu)

- Semua isi PRD ini **dianggap sudah diputuskan (authoritative)**, KECUALI yang ditandai `[KONFIRMASI]`.
- `[KONFIRMASI]` = belum pasti. Jangan dibangun/diasumsikan. Tanyakan dulu.
- Bila butuh sesuatu yang tidak ada di dokumen ini → tambahkan ke Section 8 sebagai `[KONFIRMASI]`.
- Patuhi Section 1.5 (out of scope) dan Section 7 (konvensi) secara ketat.
- Section bertanda *(opsional)* diisi hanya jika berlaku.

---

## 1. Overview

### 1.1 Masalah

Bisnis travel skala lokal (area Yogyakarta dan Jawa Tengah) tidak memiliki presence digital yang
memadai. Calon penumpang tidak bisa menemukan informasi rute, tarif, dan armada secara mandiri.
Pemilik bisnis bergantung sepenuhnya pada komunikasi manual via WhatsApp, tanpa alat untuk
mengelola konten website secara mandiri pasca-handover.

Dari sisi developer (ArTech), tidak ada referensi portofolio yang menunjukkan kemampuan membangun
sistem web lengkap dengan admin panel custom — yang merupakan kebutuhan nyata klien UMKM lokal.

### 1.2 Tujuan

- **Tujuan utama:** Membangun website travel profesional dengan admin panel custom yang bisa
  di-handover ke klien non-teknis, sekaligus menjadi portofolio ArTech yang bisa dipresentasikan.
- **Hasil yang diharapkan:**
  - Calon penumpang menemukan info lengkap (rute, harga, armada) tanpa perlu bertanya
  - Klien/pemilik bisa kelola seluruh konten dari `/admin` tanpa menyentuh kode atau GitHub
  - ArTech memiliki demo live yang bisa ditunjukkan ke calon klien bisnis travel manapun

### 1.3 Pengguna

| Persona          | Siapa mereka                                               | Kebutuhan utama                                              |
|------------------|------------------------------------------------------------|--------------------------------------------------------------|
| Calon Penumpang  | Warga Yogyakarta / Jateng yang cari travel antar kota      | Tahu rute, harga, armada, cara pesan                         |
| Admin / Pemilik  | Pemilik usaha travel, non-teknis                           | Update harga, rute, konten mandiri dari browser              |
| Calon Klien ArTech | Pemilik bisnis travel lain yang diajak presentasi        | Melihat demo sistem yang bisa langsung mereka gunakan        |

### 1.4 Success Criteria

- [ ] LCP < 2.5s mobile (simulasi 4G), CLS < 0.1, Lighthouse ≥ 85 mobile
- [ ] Admin bisa login, tambah rute baru, dan upload foto armada tanpa bantuan developer
- [ ] Perubahan konten dari `/admin` langsung terefleksi di website (tanpa redeploy)
- [ ] File manager: admin bisa upload, preview, dan hapus gambar dari satu antarmuka
- [ ] Form inquiry mengirim ke WhatsApp dengan pesan pre-filled dan terformat
- [ ] Website bisa diakses di viewport 375px ke atas, semua interaksi fungsional
- [ ] Admin panel punya tampilan yang cukup polished untuk dipresentasikan ke calon klien

### 1.5 Scope

**Dikerjakan (MVP):**
- Website publik: homepage, halaman rute & harga, armada, FAQ, kontak
- Admin panel custom di `/admin`: auth, dashboard, CRUD semua entitas konten
- File manager di admin: upload, preview, hapus gambar
- Database: Supabase PostgreSQL (hosted)
- Booking inquiry via WhatsApp (redirect dengan pre-fill pesan)
- SEO on-page dasar (meta, OG, sitemap.xml, robots.txt)

**TIDAK dikerjakan (eksplisit di luar scope):**
- Payment gateway / transaksi online
- Sistem tiket digital / nomor kursi
- Tracking posisi kendaraan real-time
- Akun penumpang / login penumpang
- Notifikasi otomatis (email blast, push notification)
- Multi-bahasa
- Blog / artikel
- Aplikasi mobile native

**Fase berikutnya (jangan dibuat sekarang):**
- Sistem reservasi dengan cek ketersediaan seat
- Dashboard analitik booking di admin
- Integrasi Google Calendar untuk jadwal
- Notifikasi WhatsApp otomatis (WABA API)
- Role multi-level admin (super admin vs operator)

---

## 2. Requirements

| Kategori       | Requirement                                                                     |
|----------------|---------------------------------------------------------------------------------|
| Performa       | LCP < 2.5s mobile, CLS < 0.1, TBT < 200ms, Lighthouse Performance ≥ 85 mobile  |
| Keamanan       | Admin route dilindungi NextAuth session. API route admin wajib cek session.     |
| Platform       | Mobile-first. Viewport 375px–1440px. Admin panel: desktop-optimized.           |
| Browser        | Chrome, Safari, Firefox — 2 versi terakhir                                      |
| Skala          | Trafik kecil-menengah. Data: puluhan rute, <10 armada, <100 testimonial.       |
| Aksesibilitas  | WCAG AA kontras. Keyboard navigable. Alt text semua gambar.                     |
| Database       | Supabase PostgreSQL (free tier). Connection via Prisma ORM.                     |
| Auth Admin     | NextAuth v5 (Credentials provider: email + password). Session: JWT.            |
| File Storage   | Supabase Storage bucket. Max file size: [KONFIRMASI]. Accept: jpg, png, webp.   |

**Constraints:**
- Hosting: Vercel (frontend + API routes) + Supabase (DB + Storage)
- Kedua platform punya free tier yang cukup untuk portofolio dan klien UMKM
- TypeScript strict mode ON di seluruh codebase
- Tidak ada custom server (tetap serverless di Vercel)

**Asumsi yang dipakai:**
- Admin hanya satu level (tidak ada super admin vs operator) di MVP
- Tidak ada auto-deploy trigger — konten langsung terefleksi karena fetch real-time (bukan SSG penuh)
- Halaman publik menggunakan ISR (revalidate 60 detik) untuk balance performa vs freshness

---

## 3. Core Features

### Fitur 1 — Hero Section + Form Inquiry Booking

- **Prioritas:** Must
- **Deskripsi:** Section pembuka homepage dengan headline brand Kelana Travel, visual impactful
  (foto background kendaraan/Yogyakarta), dan form inquiry booking yang mengarah ke WhatsApp.
- **Aktor:** Calon penumpang
- **Input:** Kota asal (dropdown), kota tujuan (dropdown), tanggal keberangkatan, jumlah penumpang, nama
- **Output:** Redirect ke `wa.me/[nomor]?text=[pesan terformat]` di tab baru
- **Aturan bisnis:**
  - Daftar kota di dropdown diambil dari database (distinct `cityFrom` + `cityTo` dari tabel `routes`)
  - Semua field wajib diisi sebelum submit
  - Tanggal tidak boleh sebelum hari ini
  - Pesan WhatsApp format: `Halo Kelana Travel, saya [nama] ingin pesan travel:\n🛣 Rute: [asal] → [tujuan]\n📅 Tanggal: [tanggal]\n👥 Penumpang: [jumlah] orang`
- **Acceptance criteria:**
  - [ ] Submit dengan field kosong: error inline per-field, tidak redirect
  - [ ] Submit valid: WhatsApp terbuka dengan pesan terformat
  - [ ] Fallback jika WhatsApp app tidak ada: buka WhatsApp Web
  - [ ] Daftar kota terupdate otomatis saat admin tambah rute baru

---

### Fitur 2 — Halaman Rute & Harga

- **Prioritas:** Must
- **Deskripsi:** Halaman dedicated `/rute` yang menampilkan semua rute aktif beserta tarif per armada.
  Dilengkapi filter/tab per kota asal.
- **Aktor:** Calon penumpang (baca), Admin (kelola via `/admin`)
- **Input dari DB:** Nama rute, kota asal, kota tujuan, estimasi durasi, harga per armada
- **Output:** Kartu rute bergaya "jalur perjalanan" (visual dot-line-dot kota asal→tujuan) + tabel harga
- **Aturan bisnis:**
  - Hanya rute dengan `isActive = true` yang tampil di frontend
  - Harga ditampilkan format: `Rp 150.000` (locale ID)
  - Satu rute bisa punya harga berbeda per tipe armada
  - Jika satu rute tidak punya harga terdaftar, tampilkan "Hubungi kami"
- **Acceptance criteria:**
  - [ ] Rute nonaktif tidak muncul di frontend
  - [ ] Filter per kota asal berfungsi (tanpa page reload)
  - [ ] Setiap kartu rute punya CTA "Pesan Sekarang" yang pre-fill WhatsApp dengan rute
  - [ ] Data fresh dalam 60 detik setelah admin update (ISR revalidate)

---

### Fitur 3 — Halaman Armada

- **Prioritas:** Must
- **Deskripsi:** Halaman `/armada` menampilkan semua kendaraan aktif dengan foto, spesifikasi,
  kapasitas, dan fasilitas (AC, charger, dll).
- **Aktor:** Calon penumpang (baca), Admin (kelola)
- **Input dari DB:** Nama armada, foto (URL dari Supabase Storage), kapasitas, fasilitas, deskripsi
- **Output:** Grid kartu armada
- **Aturan bisnis:**
  - Armada dengan `isActive = false` tidak tampil
  - Foto wajib — armada tanpa foto tetap tampil dengan placeholder branded Kelana Travel
  - Fasilitas ditampilkan sebagai icon (Lucide React) + label teks
- **Acceptance criteria:**
  - [ ] Semua armada aktif tampil dengan foto dan detail
  - [ ] Armada tanpa foto menggunakan placeholder, tidak crash
  - [ ] Foto dioptimasi via `next/image` dengan domain Supabase di-whitelist

---

### Fitur 4 — Keunggulan / Why Choose Us

- **Prioritas:** Should
- **Deskripsi:** Section di homepage yang menampilkan poin-poin keunggulan Kelana Travel
  (misal: armada ber-AC, driver berpengalaman, harga transparan, layanan door-to-door).
- **Aktor:** Calon penumpang (baca), Admin (kelola)
- **Input dari DB:** Icon key, judul poin, deskripsi singkat
- **Aturan bisnis:** Tampilkan maksimal 6 poin. Urutan sesuai field `order` di DB.
- **Acceptance criteria:**
  - [ ] Maksimal 6 poin tampil, sisanya diabaikan
  - [ ] Admin bisa edit judul dan deskripsi dari panel admin

---

### Fitur 5 — Testimonial

- **Prioritas:** Should
- **Deskripsi:** Section testimonial di homepage, ditampilkan sebagai carousel auto-scroll (Framer Motion).
- **Aktor:** Calon penumpang (baca), Admin (kelola)
- **Input dari DB:** Nama, rating (1–5), teks ulasan, rute yang digunakan, foto (opsional)
- **Aturan bisnis:**
  - Hanya testimonial dengan `published = true` yang tampil
  - Section disembunyikan jika tidak ada testimonial published
- **Acceptance criteria:**
  - [ ] Carousel berfungsi smooth di mobile dan desktop
  - [ ] Rating ditampilkan sebagai bintang visual
  - [ ] Section tidak render jika DB kosong (tidak ada error / layout broken)

---

### Fitur 6 — FAQ

- **Prioritas:** Should
- **Deskripsi:** Halaman `/faq` dengan accordion. Konten dikelola dari admin panel.
- **Aktor:** Calon penumpang (baca), Admin (kelola)
- **Input dari DB:** Pertanyaan, jawaban, urutan
- **Aturan bisnis:**
  - Urutan sesuai field `order`
  - Hanya satu item terbuka sekaligus (exclusive accordion)
- **Acceptance criteria:**
  - [ ] Accordion animasi smooth (Framer Motion)
  - [ ] Satu item terbuka menutup item sebelumnya

---

### Fitur 7 — Halaman Kontak

- **Prioritas:** Must
- **Deskripsi:** Halaman `/kontak` dengan informasi kontak bisnis (WA, telepon, email, alamat pool),
  embed Google Maps, dan form pesan singkat.
- **Aktor:** Calon penumpang
- **Input:** Nama, nomor HP, pesan
- **Output:** Redirect ke WhatsApp dengan pesan terformat
- **Aturan bisnis:**
  - Nomor WA, alamat, dan info kontak diambil dari tabel `site_settings` di DB
  - Form stateless — tidak menyimpan pesan ke DB
- **Acceptance criteria:**
  - [ ] Klik nomor WA membuka WhatsApp langsung
  - [ ] Google Maps embed tampil (URL dari DB, bukan hardcoded)
  - [ ] Admin bisa update info kontak dari panel admin

---

### Fitur 8 — Custom Admin Panel (`/admin`)

- **Prioritas:** Must
- **Deskripsi:** Antarmuka admin berbasis web di path `/admin` dengan login, dashboard ringkas,
  dan CRUD untuk semua entitas konten. Dirancang cukup polished untuk dipresentasikan ke calon klien.
- **Aktor:** Admin / Pemilik website
- **Sub-fitur:**

#### 8a. Auth Admin
- Login form: email + password
- Session: JWT via NextAuth v5
- Logout
- Semua route `/admin/*` redirect ke login jika tidak ada session
- **Acceptance criteria:**
  - [ ] Login berhasil → redirect ke `/admin/dashboard`
  - [ ] Login gagal → pesan error inline "Email atau password salah"
  - [ ] Akses langsung ke `/admin/dashboard` tanpa login → redirect ke `/admin/login`
  - [ ] Logout menghapus session dan redirect ke `/admin/login`

#### 8b. Dashboard
- Ringkasan statistik: total rute aktif, total armada, total testimonial published
- Quick links ke masing-masing CRUD section
- **Acceptance criteria:**
  - [ ] Angka statistik real-time dari DB
  - [ ] Layout tidak broken di viewport 1280px

#### 8c. Manajemen Rute & Harga
- List semua rute (tabel dengan paginasi)
- Tambah rute baru (form: kota asal, kota tujuan, durasi, status aktif)
- Edit rute
- Tambah/edit harga per armada untuk setiap rute
- Toggle aktif/nonaktif rute
- Hapus rute (dengan konfirmasi)
- **Acceptance criteria:**
  - [ ] Semua operasi CRUD berfungsi dan langsung terefleksi di tabel
  - [ ] Delete meminta konfirmasi dialog sebelum eksekusi
  - [ ] Input harga: angka saja, tampilan Rupiah otomatis

#### 8d. Manajemen Armada
- List armada (tabel)
- Tambah / edit armada: nama, foto (upload), kapasitas, fasilitas (multi-select), deskripsi, status
- Toggle aktif/nonaktif
- Hapus armada
- **Acceptance criteria:**
  - [ ] Upload foto dari komputer lokal → tersimpan di Supabase Storage
  - [ ] Preview foto setelah upload, sebelum save
  - [ ] Hapus armada menghapus foto dari Storage juga [KONFIRMASI: atau retain foto?]

#### 8e. File Manager
- Tampilan galeri semua file yang sudah diupload ke Supabase Storage
- Upload file baru (drag & drop atau klik)
- Preview gambar
- Copy URL file
- Hapus file
- **Acceptance criteria:**
  - [ ] Galeri menampilkan semua file di bucket
  - [ ] Upload baru langsung muncul di galeri
  - [ ] Konfirmasi sebelum hapus file
  - [ ] Salin URL ke clipboard dengan satu klik

#### 8f. Manajemen Testimonial
- List testimonial (tabel, dengan kolom "published")
- Tambah / edit / hapus
- Toggle published/unpublished
- **Acceptance criteria:**
  - [ ] Toggle published langsung update di frontend dalam 60 detik (ISR)

#### 8g. Manajemen FAQ
- List FAQ (drag-and-drop reorder atau input angka order)
- Tambah / edit / hapus item
- **Acceptance criteria:**
  - [ ] Perubahan urutan tersimpan dan terefleksi di frontend

#### 8h. Manajemen Konten Umum (Site Settings)
- Form single-page untuk: nama bisnis, nomor WA, telepon, email, alamat, Google Maps URL,
  tagline hero, sub-teks hero, foto hero utama
- **Acceptance criteria:**
  - [ ] Semua field tersimpan ke tabel `site_settings`
  - [ ] Perubahan nomor WA langsung terefleksi di semua CTA WhatsApp di frontend

---

## 4. User Flow

### Flow: Calon Penumpang Booking via WhatsApp

```
Homepage → Lihat Hero + Form Booking
↓
Isi form (kota asal, tujuan, tanggal, penumpang, nama)
↓
Klik "Pesan Sekarang"
↓
[Valid] → WhatsApp terbuka, pesan pre-filled
[Invalid] → Error inline per-field, stay di form
↓
Kirim pesan ke admin Kelana Travel
↓
Admin konfirmasi manual via WhatsApp
```

### Flow: Admin Update Harga Rute

```
Buka namawebsite.com/admin/login
↓
Login email + password
↓
Dashboard → klik "Rute & Harga"
↓
Pilih rute → klik Edit
↓
Ubah harga salah satu armada → Simpan
↓
Konfirmasi sukses muncul
↓
Frontend update dalam ≤60 detik (ISR revalidate)
```

### Flow: Admin Upload Foto Armada Baru

```
/admin/armada → Tambah Armada
↓
Isi nama, kapasitas, fasilitas
↓
Klik area upload → pilih file dari komputer
↓
Preview foto muncul
↓
Klik Simpan → foto tersimpan di Supabase Storage, data armada ke DB
↓
Armada baru tampil di halaman /armada dalam ≤60 detik
```

### Flow Error / Alternatif

| Kondisi                            | Respons sistem                 | Yang dilihat user                              |
|------------------------------------|--------------------------------|------------------------------------------------|
| Form kosong saat submit            | Validasi inline, block submit  | Label merah: "Wajib diisi"                     |
| Tanggal masa lalu                  | Validasi inline                | "Pilih tanggal yang akan datang"               |
| Login admin gagal                  | Error inline                   | "Email atau password salah"                    |
| Akses /admin tanpa session         | Redirect                       | Diarahkan ke /admin/login                      |
| Upload file gagal (size/format)    | Error toast                    | "Format tidak didukung" / "Ukuran terlalu besar"|
| DB query error di frontend         | Error boundary                 | "Gagal memuat data. Coba refresh halaman."     |
| Foto Supabase gagal load           | next/image fallback            | Placeholder branded abu-abu                    |
| Tidak ada rute aktif               | Empty state component          | "Belum ada rute tersedia. Hubungi kami."       |

---

## 5. Data / Database Model (Supabase PostgreSQL via Prisma)

### Tabel: `site_settings` (singleton — selalu 1 row)

| Kolom              | Tipe          | Wajib | Catatan                                      |
|--------------------|---------------|-------|----------------------------------------------|
| `id`               | int (PK)      | ya    | Selalu 1                                     |
| `site_name`        | varchar(100)  | ya    | "Kelana Travel"                              |
| `phone_whatsapp`   | varchar(20)   | ya    | Format: 628xxx (tanpa + atau spasi)           |
| `phone_display`    | varchar(25)   | ya    | Format: 0812-xxxx-xxxx (untuk tampilan)      |
| `email`            | varchar(100)  | tidak |                                              |
| `address`          | text          | tidak | Alamat pool / kantor                         |
| `maps_embed_url`   | text          | tidak | Google Maps embed src URL                    |
| `hero_tagline`     | varchar(200)  | ya    |                                              |
| `hero_subtext`     | text          | tidak |                                              |
| `hero_image_url`   | text          | tidak | URL dari Supabase Storage                    |
| `updated_at`       | timestamp     | ya    | Auto-update                                  |

---

### Tabel: `vehicles` (Armada)

| Kolom          | Tipe         | Wajib | Catatan                                          |
|----------------|--------------|-------|--------------------------------------------------|
| `id`           | uuid (PK)    | ya    |                                                  |
| `name`         | varchar(100) | ya    | Mis. "Toyota HiAce Commuter"                     |
| `slug`         | varchar(120) | ya    | UNIQUE. Auto-generate dari name.                 |
| `photo_url`    | text         | tidak | URL Supabase Storage                             |
| `capacity`     | smallint     | ya    | Jumlah penumpang                                 |
| `facilities`   | jsonb        | tidak | Array: ["AC","Charger","Toilet"]                 |
| `description`  | text         | tidak |                                                  |
| `is_active`    | boolean      | ya    | Default: true                                    |
| `created_at`   | timestamp    | ya    | Auto                                             |
| `updated_at`   | timestamp    | ya    | Auto                                             |

---

### Tabel: `routes` (Rute)

| Kolom           | Tipe         | Wajib | Catatan                                          |
|-----------------|--------------|-------|--------------------------------------------------|
| `id`            | uuid (PK)    | ya    |                                                  |
| `city_from`     | varchar(100) | ya    | Kota asal: "Yogyakarta", "Solo", dll             |
| `city_to`       | varchar(100) | ya    | Kota tujuan                                      |
| `duration_est`  | varchar(50)  | tidak | Mis. "2–3 jam"                                   |
| `is_active`     | boolean      | ya    | Default: true                                    |
| `created_at`    | timestamp    | ya    | Auto                                             |

---

### Tabel: `route_prices` (Harga per Rute per Armada)

| Kolom        | Tipe      | Wajib | Catatan                                           |
|--------------|-----------|-------|---------------------------------------------------|
| `id`         | uuid (PK) | ya    |                                                   |
| `route_id`   | uuid (FK) | ya    | → `routes.id`. ON DELETE CASCADE.                |
| `vehicle_id` | uuid (FK) | ya    | → `vehicles.id`. ON DELETE CASCADE.              |
| `price`      | integer   | ya    | Dalam Rupiah: 150000 (bukan 150.000)              |

**Constraint:** UNIQUE(`route_id`, `vehicle_id`) — satu rute tidak boleh punya harga duplikat per armada.

---

### Tabel: `testimonials`

| Kolom        | Tipe         | Wajib | Catatan                                          |
|--------------|--------------|-------|--------------------------------------------------|
| `id`         | uuid (PK)    | ya    |                                                  |
| `name`       | varchar(100) | ya    |                                                  |
| `rating`     | smallint     | ya    | 1–5                                              |
| `review`     | text         | ya    |                                                  |
| `route_used` | varchar(100) | tidak | Mis. "Yogyakarta → Semarang"                     |
| `photo_url`  | text         | tidak |                                                  |
| `published`  | boolean      | ya    | Default: false                                   |
| `created_at` | timestamp    | ya    | Auto                                             |

---

### Tabel: `features` (Keunggulan / Why Choose Us)

| Kolom         | Tipe         | Wajib | Catatan                                          |
|---------------|--------------|-------|--------------------------------------------------|
| `id`          | uuid (PK)    | ya    |                                                  |
| `icon_key`    | varchar(50)  | ya    | Key Lucide icon: "shield", "clock", "map-pin"    |
| `title`       | varchar(100) | ya    |                                                  |
| `description` | text         | ya    |                                                  |
| `order`       | smallint     | ya    | Urutan tampil (ascending). Max 6 yang ditampilkan|

---

### Tabel: `faq_items`

| Kolom      | Tipe      | Wajib | Catatan                      |
|------------|-----------|-------|------------------------------|
| `id`       | uuid (PK) | ya    |                              |
| `question` | text      | ya    |                              |
| `answer`   | text      | ya    |                              |
| `order`    | smallint  | ya    | Urutan ascending             |

---

### Tabel: `admin_users`

| Kolom            | Tipe         | Wajib | Catatan                                          |
|------------------|--------------|-------|--------------------------------------------------|
| `id`             | uuid (PK)    | ya    |                                                  |
| `email`          | varchar(200) | ya    | UNIQUE                                           |
| `password_hash`  | text         | ya    | bcrypt hash. JANGAN simpan plaintext.            |
| `name`           | varchar(100) | tidak |                                                  |
| `created_at`     | timestamp    | ya    | Auto                                             |
| `last_login_at`  | timestamp    | tidak | Update tiap login berhasil                       |

**Relasi:**
- `route_prices.route_id` → `routes.id`
- `route_prices.vehicle_id` → `vehicles.id`

**Index penting:**
- `routes(is_active)`, `routes(city_from)` — untuk filter frontend
- `vehicles(is_active)` — untuk filter frontend
- `testimonials(published)` — untuk query frontend
- `faq_items(order)` — untuk sort
- `admin_users(email)` — UNIQUE, untuk login query

---

## 6. Architecture & Tech

| Layer            | Teknologi                                                    |
|------------------|--------------------------------------------------------------|
| Frontend (publik)| Next.js 14 App Router + TypeScript + Tailwind CSS v3         |
| Admin Panel      | Next.js (App Router, route group `/admin`) — same codebase  |
| Animation        | Framer Motion                                                |
| ORM              | Prisma v5                                                    |
| Database         | Supabase PostgreSQL (hosted)                                 |
| File Storage     | Supabase Storage (bucket: `kelana-media`)                    |
| Auth Admin       | NextAuth v5 (Auth.js) — Credentials provider                |
| Hosting          | Vercel                                                       |
| Icons            | Lucide React                                                 |
| Analytics        | Google Analytics 4 (pasif, via `next/third-parties`)        |

**Integrasi pihak ketiga:**
| Service          | Untuk apa                                                    |
|------------------|--------------------------------------------------------------|
| Supabase         | PostgreSQL DB + File Storage                                 |
| Vercel           | Hosting + serverless API routes                              |
| WhatsApp (wa.me) | Booking inquiry — deep link dengan pre-filled message        |
| Google Analytics | Tracking pasif pengunjung                                    |
| Google Maps      | Embed iframe di halaman kontak (URL dari DB)                 |

**Catatan arsitektur penting:**
- Tidak ada SSG penuh. Halaman publik menggunakan ISR (`revalidate: 60`) agar konten selalu fresh
  tanpa redeploy, tapi tetap performant.
- Admin panel fetch data real-time (no-cache) agar selalu menampilkan state terbaru.
- API routes di `app/api/admin/*` wajib cek session NextAuth sebelum proses apapun.
- Supabase Storage diakses melalui Prisma/API routes — tidak expose Supabase service key ke client.

---

## 7. Design & Technical Constraints

### Konvensi Kode

- **Library wajib:** Next.js 14, TypeScript (strict), Tailwind CSS v3, Framer Motion, Prisma, NextAuth v5,
  Lucide React, @supabase/supabase-js
- **Library dilarang:** jQuery, Bootstrap, Material UI, Chakra UI, Ant Design
- **Pola wajib:**
  - Server Components secara default
  - Client Components (`"use client"`) hanya untuk interaktivitas (form, animasi, toggle)
  - `next/image` wajib — tidak ada `<img>` telanjang
  - Semua API route admin wajib `getServerSession()` check di baris pertama
  - Error: semua async operation dalam try/catch dengan user-facing feedback
  - Environment variables: `NEXTAUTH_SECRET`, `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
    `SUPABASE_SERVICE_ROLE_KEY` (service role hanya di server-side)

- **Struktur folder:**
```
src/
├── app/
│   ├── (site)/                  # Route group: halaman publik
│   │   ├── page.tsx             # Homepage
│   │   ├── rute/page.tsx
│   │   ├── armada/page.tsx
│   │   ├── faq/page.tsx
│   │   └── kontak/page.tsx
│   ├── admin/                   # Admin panel
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── rute/page.tsx
│   │   ├── armada/page.tsx
│   │   ├── testimonial/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── media/page.tsx       # File manager
│   │   └── settings/page.tsx   # Site settings
│   └── api/
│       └── admin/               # API routes (semua protected)
├── components/
│   ├── ui/                      # Atom: Button, Input, Card, Badge, Modal, Toast
│   ├── sections/                # Section-level: Hero, RouteList, Fleet, dll
│   └── admin/                   # Komponen khusus admin: DataTable, FileUploader, dll
├── lib/
│   ├── auth.ts                  # NextAuth config
│   ├── prisma.ts                # Prisma client singleton
│   ├── supabase.ts              # Supabase client (server + client)
│   └── utils.ts                 # formatRupiah, buildWhatsAppUrl, dll
└── types/                       # TypeScript types dari Prisma schema
```

### Design System — Website Publik

**Filosofi:** Trustworthy, modern lokal. Bukan template generik travel merah-putih.
Tone visual: premium tapi hangat — seperti travel yang terpercaya, bukan korporat dingin.

**Palet warna:**
| Token               | Hex       | Peran                                              |
|---------------------|-----------|----------------------------------------------------|
| `primary`           | `#1A3C5E` | Navy dalam — kepercayaan, stabilitas               |
| `primary-600`       | `#2E6DA4` | Hover state, link, border aktif                    |
| `accent`            | `#E8A020` | Amber/kuning — CTA utama, highlight harga          |
| `accent-hover`      | `#D4901A` | Hover tombol aksen                                 |
| `surface`           | `#F7F8FA` | Background section terang                          |
| `surface-alt`       | `#EEF2F7` | Background section alternating                    |
| `dark`              | `#0D1B2A` | Background hero, footer, section gelap             |
| `text-primary`      | `#1A1A2E` | Teks utama                                         |
| `text-secondary`    | `#4A5568` | Teks deskripsi, label                              |
| `text-muted`        | `#8896A7` | Placeholder, info sekunder                         |

**Typography:**
- **Display (H1–H2):** `Plus Jakarta Sans` — 700/800 weight. Heading besar, tegas, modern lokal.
- **Body & UI:** `Inter` — 400/500/600. Legible di semua ukuran.
- **Data/Angka (harga):** `JetBrains Mono` — angka Rupiah tampil presisi, terbaca jelas.

**Signature element:**
Kartu rute menggunakan visual "jalur perjalanan": titik berwarna (kota asal) → garis putus-putus
animasi → titik berwarna (kota tujuan). Memberi kesan peta/perjalanan yang relevan konteks travel,
berbeda dari tabel tabel biasa. Animasi jalur muncul saat card masuk viewport (scroll-triggered).

**Radius & spacing:**
- Card: `rounded-2xl` (16px)
- Button: `rounded-full` (pill) untuk CTA utama, `rounded-lg` untuk button sekunder
- Input: `rounded-xl` (12px)
- Section padding: `py-20` desktop, `py-12` mobile

**Motion:**
- Scroll-triggered: fade + slide-up untuk semua section content (stagger pada grid)
- Hero: satu entrance animation orchestrated (text fade-in + CTA slide up)
- Carousel testimonial: auto-scroll dengan pause on hover
- Tidak ada loop animation yang terus berputar tanpa trigger — menghindari kesan "template AI"

### Design System — Admin Panel

- Background: `#F1F5F9` (slate-100)
- Sidebar: `#1A3C5E` (primary navy) dengan text putih
- Card/panel: `white` dengan `shadow-sm`
- Typography: `Inter` saja — konsisten, data-dense
- Accent admin: `#2E6DA4` untuk button primary, status badge
- Tabel: striped rows, hover highlight, sticky header
- Polished tapi fungsional — bukan sekompleks Vercel dashboard, tapi lebih dari CRUD template

### Error & Edge Case Handling

| Kondisi                             | Respons sistem                | Pesan ke user                                         |
|-------------------------------------|-------------------------------|-------------------------------------------------------|
| Field form kosong                   | Validasi inline               | Label merah: "Wajib diisi" per field                  |
| Tanggal masa lalu                   | Validasi                      | "Pilih tanggal yang akan datang"                      |
| Login admin gagal                   | Error inline                  | "Email atau password salah"                           |
| Session expired di admin            | Redirect ke login             | Toast: "Sesi habis, silakan login kembali"            |
| Upload file format tidak didukung   | Reject, error toast           | "Hanya menerima JPG, PNG, atau WebP"                  |
| Upload file terlalu besar           | Reject, error toast           | "Ukuran file maksimal [X] MB"                         |
| DB unreachable di frontend          | Error boundary                | "Gagal memuat data. Silakan refresh halaman."         |
| Foto gagal load                     | next/image placeholder        | Placeholder abu-abu branded                           |
| Tidak ada data (empty state)        | Empty state component         | Pesan kontekstual + saran aksi                        |
| 404                                 | Custom 404 page               | Branded 404 dengan link ke Homepage                   |
| 500                                 | Custom error page             | Pesan umum + kontak support                           |

---

## 8. Open Questions / `[KONFIRMASI]` — Register Keputusan Tertunda

| No | Pertanyaan / Asumsi yang Perlu Dikonfirmasi                                             | Dampak jika Ditebak Salah                        | Status |
|----|-----------------------------------------------------------------------------------------|--------------------------------------------------|--------|
| 1  | [KONFIRMASI] Nomor WhatsApp yang akan digunakan sebagai penerima inquiry                | Dipakai di semua CTA — blokir build form         | Open   |
| 2  | [KONFIRMASI] Domain yang digunakan (kelanatravel.com? kelana.id? subdomain sementara?)  | Konfigurasi Vercel, CORS Supabase, OG meta       | Open   |
| 3  | [KONFIRMASI] Rute-rute awal yang ingin ditampilkan sebagai dummy data (mis. Jogja→Solo) | Perlu untuk seed database awal                   | Open   |
| 4  | [KONFIRMASI] Armada dummy: nama kendaraan dan kapasitas (untuk seed data portofolio)    | Perlu untuk populate halaman armada              | Open   |
| 5  | [KONFIRMASI] Maksimal ukuran file upload di admin (rekomendasi: 2MB)                    | Validasi upload + konfigurasi Supabase Storage   | Open   |
| 6  | [KONFIRMASI] Apakah hapus armada juga hapus foto dari Supabase Storage, atau foto di-retain? | Logika delete di API route                   | Open   |
| 7  | [KONFIRMASI] Apakah halaman publik butuh dark mode? (Rekomendasi: tidak untuk MVP)      | Menambah ~20% kompleksitas design token          | Open   |

---

## 9. Setup Commands

```bash
# 1. Buat project
npx create-next-app@latest kelana-travel --typescript --tailwind --app --src-dir --import-alias "@/*"
cd kelana-travel

# 2. Dependencies utama
npm install framer-motion
npm install lucide-react
npm install next-auth@beta                    # NextAuth v5
npm install prisma @prisma/client
npm install @supabase/supabase-js
npm install bcryptjs @types/bcryptjs

# 3. Dev dependencies
npm install -D prisma

# 4. Inisialisasi Prisma
npx prisma init --datasource-provider postgresql

# 5. Google Fonts via next/font (Plus Jakarta Sans + Inter + JetBrains Mono)
# Tidak perlu install — tersedia langsung di next/font/google

# 6. Environment variables (.env.local)
# DATABASE_URL="postgresql://..."           # dari Supabase → Settings → Database
# NEXTAUTH_SECRET="..."                     # openssl rand -base64 32
# NEXTAUTH_URL="http://localhost:3000"
# SUPABASE_URL="https://xxx.supabase.co"
# SUPABASE_ANON_KEY="..."
# SUPABASE_SERVICE_ROLE_KEY="..."           # hanya di server-side

# 7. Run dev
npm run dev
```

---

## Catatan untuk ArTech (Portofolio Context)

Proyek ini dirancang agar bisa dipresentasikan ke calon klien bisnis travel dengan menunjukkan:

1. **Sistem yang lengkap** — bukan landing page statis, tapi web app dengan database dan auth
2. **Admin panel yang bisa langsung di-demo live** — buka `/admin`, login, update harga, refresh halaman publik
3. **Handover yang clean** — klien cukup belajar satu antarmuka (`/admin`) yang Anda desain sendiri,
   bukan antarmuka pihak ketiga
4. **Stack yang scalable** — Next.js + Supabase + Vercel adalah stack yang bisa tumbuh bersama bisnis klien
5. **Dapat dijadikan template** — untuk proyek travel serupa di kota lain, cukup update konten DB dan branding

Ketika presentasi ke calon klien: demo live `web-ar-tech.vercel.app` (portofolio ArTech) → buka
demo Kelana Travel → masuk ke `/admin` dan update konten secara live → refresh halaman publik.
Ini lebih convincing dari mockup statis.

---

*Living document. Item Section 8 perlu dikonfirmasi sebelum build dimulai.
Setelah item 1–4 dikonfirmasi, seed data bisa dibuat dan build bisa dimulai.*
