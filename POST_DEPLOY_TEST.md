# Post-Deploy Test Checklist — Kelana Travel

Jalankan checklist ini setelah deploy ke Vercel berhasil dan env vars sudah di-set.
Catat hasil (✅/❌) dan catatan di kolom kanan.

| # | Item | Hasil | Catatan |
|---|---|---|---|
| 1 | Homepage (`/`) terbuka di URL production | [ ] | |
| 2 | Foto hero dan foto armada tampil (dari Supabase Storage CDN) | [ ] | |
| 3 | Form booking: isi semua field → submit → WhatsApp terbuka dengan pesan terformat | [ ] | |
| 4 | `/admin/login` → login dengan credentials admin berhasil | [ ] | |
| 5 | Admin: tambah rute baru → cek muncul di `/rute` (≤60 detik, ISR revalidate) | [ ] | |
| 6 | Admin: upload foto armada → tampil di File Manager (`/admin/media`) | [ ] | |
| 7 | `/rute`, `/armada`, `/faq`, `/kontak` semua terbuka tanpa error | [ ] | |
| 8 | Buka `/halaman-tidak-ada` → custom 404 tampil (branded, tombol "Kembali ke Beranda") | [ ] | |
| 9 | Mobile: buka di viewport 375px → semua section homepage berfungsi | [ ] | |
| 10 | `/sitemap.xml` dan `/robots.txt` dapat diakses dan berisi data yang benar | [ ] | |
| 11 | Akses `/admin/dashboard` tanpa login (incognito) → redirect ke `/admin/login` | [ ] | |
| 12 | Login gagal 6x berturut-turut → muncul pesan rate limit | [ ] | |

---

## Cara Pengujian Singkat

- **#3**: gunakan tanggal besok, jumlah penumpang valid, nama pemesan diisi.
- **#5**: tambah rute via `/admin/rute`, lalu refresh `/rute` setelah ~1 menit.
- **#10**: buka `https://<domain>/sitemap.xml` dan `https://<domain>/robots.txt`
  langsung di browser.
- **#12**: di `/admin/login`, masukkan password salah 6x dengan email yang sama.
