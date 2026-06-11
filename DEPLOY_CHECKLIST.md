# Deploy Checklist — Kelana Travel

Checklist langkah-langkah deploy ke Vercel + Supabase production.

---

## 1. Push ke GitHub

```bash
git push origin main
```

Pastikan repo `markomarr/Web-Kelana-Travel` sudah up to date.

---

## 2. Import Project ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Import repo `Web-Kelana-Travel`
3. Framework preset: **Next.js** (auto-detect)
4. Build command & output directory: default (jangan diubah)

---

## 3. Environment Variables di Vercel Dashboard

Set di **Project Settings → Environment Variables** (untuk environment Production,
dan Preview jika perlu):

| Variable | Sumber Nilai | Catatan |
|---|---|---|
| `DATABASE_URL` | Supabase → Project Settings → Database → Connection string (mode **Transaction/Pooling**, port 6543) | Wajib pakai pooling untuk serverless |
| `AUTH_SECRET` | `openssl rand -base64 32` | NextAuth v5 wajib ada di production |
| `NEXTAUTH_SECRET` | sama dengan `AUTH_SECRET` | untuk kompatibilitas |
| `NEXTAUTH_URL` | URL production, mis. `https://kelana-travel.vercel.app` | tanpa trailing slash |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public key | |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key | **Rahasia** — jangan expose ke client |
| `NEXT_PUBLIC_SUPABASE_URL` | sama dengan `SUPABASE_URL` | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sama dengan `SUPABASE_ANON_KEY` | |
| `NEXT_PUBLIC_SITE_URL` | URL production, mis. `https://kelana-travel.vercel.app` | dipakai untuk sitemap & robots |

Generate `AUTH_SECRET` / `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

---

## 4. Database Production Setup

Setelah env vars di-set, jalankan dari local (dengan `DATABASE_URL` production di
`.env`/`.env.local`):

```bash
npx prisma db push      # sync schema ke production DB
npm run db:seed          # opsional — isi data awal jika DB masih kosong
```

> Jika Supabase project sama dengan development, langkah ini sudah dilakukan dan
> bisa dilewati — cukup pastikan schema sudah sinkron (`npx prisma db push`).

---

## 5. Generate Password Admin Production

Ganti password admin default (`kelana2024`) sebelum go-live:

```bash
npm run admin:generate -- admin@kelanatravel.com
```

Script akan menampilkan password baru sekali — simpan di password manager.

---

## 6. Deploy

Trigger deploy di Vercel (otomatis setelah push, atau klik **Deploy**).
Tunggu build selesai dan pastikan tidak ada error.

---

## 7. Verifikasi

Lanjut ke `POST_DEPLOY_TEST.md` untuk checklist verifikasi setelah deploy.

---

## Catatan

- Lihat `SUPABASE_SETUP.md` untuk konfigurasi Storage bucket & CORS production.
- Domain custom (jika ada) perlu ditambahkan di Vercel → Settings → Domains, lalu
  update `NEXTAUTH_URL` dan `NEXT_PUBLIC_SITE_URL` ke domain tersebut.
