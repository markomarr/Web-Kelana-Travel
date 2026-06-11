# Supabase Production Setup — Kelana Travel

Konfigurasi yang perlu dilakukan di Supabase dashboard sebelum/saat go-live.

---

## 1. Storage Bucket "kelana-media" — Set Public

Foto armada, hero, dan media lain disajikan langsung lewat URL publik
Supabase Storage (dipakai oleh `next/image`), jadi bucket harus public.

1. Buka **Storage** di Supabase dashboard
2. Pilih bucket `kelana-media` (buat jika belum ada)
3. Klik **Edit bucket** → aktifkan **Public bucket**
4. Pastikan path pattern di `next.config.ts` cocok:
   `https://<project>.supabase.co/storage/v1/object/public/kelana-media/**`

---

## 2. CORS — Tambahkan Domain Production

Agar upload/fetch dari Storage API (file manager admin) tidak diblokir browser:

1. Buka **Project Settings → API → CORS** (atau **Storage → Configuration**
   tergantung versi dashboard)
2. Tambahkan origin:
   - `https://kelana-travel.vercel.app` (atau domain custom production)
   - `http://localhost:3000` (untuk development)

---

## 3. Row Level Security (RLS)

**Keputusan: RLS dibiarkan disabled untuk semua tabel pada MVP ini.**

Alasan:
- Semua akses database (read & write) dilakukan **server-side via Prisma**
  menggunakan `DATABASE_URL` (koneksi langsung ke Postgres), bukan lewat
  Supabase client/REST API dari browser.
- `SUPABASE_SERVICE_ROLE_KEY` (yang melewati RLS) hanya dipakai di server
  (`src/lib/supabase.ts` → `createServerClient()`), tidak pernah dikirim ke client.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` saat ini tidak dipakai untuk query data
  langsung dari client — hanya disiapkan untuk kebutuhan masa depan.
- Karena tidak ada jalur akses data langsung dari browser ke Supabase REST/Postgrest,
  RLS tidak menjadi lapisan keamanan yang relevan saat ini.

**Catatan untuk pengembangan lanjutan:** jika nanti ada fitur yang mengakses
Supabase langsung dari client (mis. realtime subscription, direct upload dari
browser ke Storage), RLS **wajib** diaktifkan dan policy ditulis sesuai kebutuhan
fitur tersebut sebelum fitur itu di-deploy.

---

## 4. Connection Pooling untuk `DATABASE_URL`

Vercel serverless functions membuka banyak koneksi singkat — gunakan connection
string **pooling mode** (Supavisor, port `6543`), bukan direct connection
(port `5432`), untuk `DATABASE_URL` di production:

```
postgresql://postgres.<ref>:<password>@<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
```
