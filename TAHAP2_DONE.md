# TAHAP 2 — Admin Panel — DONE

## Catatan Penting

- **Foto armada/testimonial/hero saat data dihapus**: foto yang sudah diunggah ke
  Supabase Storage **TIDAK ikut dihapus** saat record (armada/testimonial) dihapus —
  hanya record di DB yang dihapus, file tetap ada di bucket `kelana-media`. Ini untuk
  menghindari penghapusan file yang ternyata masih dipakai/di-share di tempat lain, dan
  admin tetap bisa membersihkannya manual lewat halaman Media. Pesan konfirmasi hapus
  pada halaman Armada sudah menyebutkan hal ini.
- `src/lib/auth.ts`: ditambahkan `secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET`
  pada konfigurasi NextAuth — NextAuth v5 secara default membaca `AUTH_SECRET`, sedangkan
  `.env.local` dari Tahap 1 memakai nama `NEXTAUTH_SECRET`. Tanpa baris ini, NextAuth
  melempar error `MissingSecret` saat halaman `/admin/login` dirender.
- Logika listing file Supabase Storage (`listAllFiles`/`listAllFilesSorted`) diekstrak ke
  `src/lib/media.ts` agar bisa dipakai bersama oleh API route `/api/admin/media` dan
  server component `/admin/media`.
- Pengujian end-to-end (login form, CRUD via browser) **belum bisa dijalankan** di sesi ini
  karena koneksi Postgres ke `db.<project>.supabase.co:5432` tidak reachable dari environment
  saat ini (REST API Supabase tetap reachable). `npm run build` dan `tsc --noEmit` sudah
  lulus tanpa error — perlu verifikasi manual login & CRUD begitu koneksi DB tersedia.

---

## Checklist

### Layout & Auth
- [x] Sidebar admin (260px, bg `#1A3C5E`, teks putih, item aktif `#2E6DA4`), menu:
      Dashboard, Rute & Harga, Armada, Testimonial, FAQ, Media, Pengaturan
      (`src/components/admin/Sidebar.tsx`)
- [x] Sidebar collapse di mobile via hamburger (`src/components/admin/AdminShell.tsx`)
- [x] Content area background `#F1F5F9`
- [x] Layout admin (`src/app/admin/(panel)/layout.tsx`) hanya aktif untuk `/admin/*`
      kecuali `/admin/login` (dipisah via route group `(panel)`)
- [x] `/admin/login` — form email+password, validasi inline, error
      "Email atau password salah", loading state, redirect ke `/admin/dashboard`,
      standalone (tanpa sidebar), dark navy background
- [x] Semua `/admin/*` redirect ke login jika belum login (`src/proxy.ts` + `auth.ts`)

### Dashboard
- [x] `/admin/dashboard` — stats card: Total Rute Aktif, Total Armada,
      Total Testimonial Published, Total FAQ (data real dari Prisma, server component)
- [x] Quick action buttons ke setiap halaman CRUD
- [x] Sambutan "Selamat datang, [nama admin]"

### CRUD Rute & Harga (`/admin/rute`)
- [x] Tabel: No, Rute, Durasi, Status, Jumlah Harga, Aksi — paginasi 10/halaman
- [x] Tambah/Edit rute via modal (Kota Asal, Kota Tujuan, Estimasi Durasi, Status)
- [x] Toggle aktif/nonaktif tanpa reload
- [x] Hapus dengan konfirmasi
- [x] Manajemen harga per rute (modal terpisah): list Armada — Harga, tambah
      (dropdown armada yang belum punya harga + input harga + preview Rupiah),
      edit inline, hapus

### CRUD Armada (`/admin/armada`)
- [x] Grid kartu: foto thumbnail, nama, kapasitas, badge fasilitas, status, aksi
- [x] Tambah/Edit via modal: Nama, Kapasitas, Deskripsi, Status, fasilitas
      (toggle chip: AC, Charger, Toilet, WiFi, Musik, TV, Snack)
- [x] Upload foto: drag & drop / klik, preview sebelum simpan, validasi
      jpg/png/webp max 2MB, upload ke bucket `kelana-media` folder `armada/`,
      URL disimpan ke `photo_url`
- [x] Toggle aktif/nonaktif, edit, hapus dengan konfirmasi

### File Manager (`/admin/media`)
- [x] Galeri grid semua file di bucket `kelana-media` (urut terbaru dulu)
- [x] Upload area drag & drop / klik dengan validasi format & ukuran
- [x] File baru langsung muncul di galeri setelah upload
- [x] Tombol "Salin URL" per file
- [x] Hapus file dengan konfirmasi
- [x] Toast notification untuk semua aksi

### CRUD Testimonial (`/admin/testimonial`)
- [x] Tabel: Nama, Rating (bintang), Rute, Status (Published/Draft toggle), Aksi —
      paginasi 10/halaman
- [x] Toggle published langsung dari tabel
- [x] Form tambah/edit: Nama, Rating (klik bintang 1-5), Ulasan, Rute yang Digunakan,
      Foto (upload opsional)
- [x] Hapus dengan konfirmasi

### CRUD FAQ (`/admin/faq`)
- [x] Tabel: Order, Pertanyaan (terpotong 60 karakter), Aksi
- [x] Tombol naik/turun untuk reorder (swap field `order` di DB)
- [x] Form tambah/edit: Pertanyaan, Jawaban
- [x] Hapus dengan konfirmasi

### Pengaturan (`/admin/settings`)
- [x] Form single-page: Informasi Bisnis (Nama, No. WA, No. Tampilan, Email, Alamat,
      Maps Embed URL), Hero (Tagline, Subteks, upload gambar hero)
- [x] Preview link `wa.me` dari nomor WA yang diisi
- [x] Satu tombol "Simpan Perubahan" + toast sukses

### API Routes (`src/app/api/admin/*`)
- [x] `GET/POST /api/admin/routes`, `GET/PUT/DELETE /api/admin/routes/[id]`
- [x] `GET/POST /api/admin/routes/[id]/prices`, `PUT/DELETE /api/admin/routes/[id]/prices/[priceId]`
- [x] `GET/POST /api/admin/vehicles`, `GET/PUT/DELETE /api/admin/vehicles/[id]`
- [x] `GET/POST /api/admin/testimonials`, `GET/PUT/DELETE /api/admin/testimonials/[id]`
- [x] `GET/POST /api/admin/faq`, `GET/PUT/DELETE /api/admin/faq/[id]`
- [x] `GET/PUT /api/admin/settings`
- [x] `POST /api/admin/media/upload`, `GET /api/admin/media`, `DELETE /api/admin/media/[...path]`
- [x] Semua route memanggil `requireSession()` dan return 401 (`{ success: false, error }`)
      jika tidak ada session, response konsisten `{ success, data?, error? }`

### Build
- [x] `npm run build` sukses (Next.js 16 + Turbopack), tidak ada error TypeScript
- [x] `npx tsc --noEmit` bersih

## Belum Diverifikasi (perlu koneksi DB)

- [ ] Login `/admin/login` dengan kredensial seed (`admin@kelanatravel.com` / `kelana2024`)
- [ ] CRUD penuh via browser (rute, armada, testimonial, faq, settings)
- [ ] Upload foto end-to-end ke Supabase Storage dari UI

## Langkah Selanjutnya

1. Pastikan koneksi ke `db.<project>.supabase.co:5432` tersedia, lalu jalankan `npm run dev`
   dan verifikasi seluruh checklist "Belum Diverifikasi" di atas.
2. Lanjut ke Tahap 3 — Website Publik.
