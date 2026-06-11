/**
 * Format angka menjadi string Rupiah, mis. 150000 -> "Rp 150.000".
 */
export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

/**
 * Bangun URL wa.me dengan pesan yang sudah di-encode.
 * @param phone Format: 628xxxxxxxxxx (tanpa + atau spasi)
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate slug dari teks: lowercase, spasi -> "-", hapus karakter non-alphanumeric.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
