"use client";

import { useState } from "react";
import type { SiteSettings } from "@prisma/client";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import { buildWhatsAppUrl } from "@/lib/utils";

interface SettingsFormProps {
  initialSettings: SiteSettings | null;
}

interface FormState {
  siteName: string;
  phoneWhatsapp: string;
  phoneDisplay: string;
  email: string;
  address: string;
  mapsEmbedUrl: string;
  heroTagline: string;
  heroSubtext: string;
  heroImageUrl: string | null;
}

function toFormState(settings: SiteSettings | null): FormState {
  return {
    siteName: settings?.siteName ?? "",
    phoneWhatsapp: settings?.phoneWhatsapp ?? "",
    phoneDisplay: settings?.phoneDisplay ?? "",
    email: settings?.email ?? "",
    address: settings?.address ?? "",
    mapsEmbedUrl: settings?.mapsEmbedUrl ?? "",
    heroTagline: settings?.heroTagline ?? "",
    heroSubtext: settings?.heroSubtext ?? "",
    heroImageUrl: settings?.heroImageUrl ?? null,
  };
}

type RequiredField = "siteName" | "phoneWhatsapp" | "phoneDisplay" | "heroTagline";

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>(toFormState(initialSettings));
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<RequiredField, string>> = {};
    if (!form.siteName.trim()) next.siteName = "Wajib diisi";
    if (!form.phoneWhatsapp.trim()) next.phoneWhatsapp = "Wajib diisi";
    if (!form.phoneDisplay.trim()) next.phoneDisplay = "Wajib diisi";
    if (!form.heroTagline.trim()) next.heroTagline = "Wajib diisi";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: form.siteName.trim(),
          phoneWhatsapp: form.phoneWhatsapp.trim(),
          phoneDisplay: form.phoneDisplay.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          mapsEmbedUrl: form.mapsEmbedUrl.trim(),
          heroTagline: form.heroTagline.trim(),
          heroSubtext: form.heroSubtext.trim(),
          heroImageUrl: form.heroImageUrl,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error ?? "Gagal menyimpan pengaturan", "error");
        return;
      }
      setForm(toFormState(json.data));
      showToast("Pengaturan berhasil disimpan");
    } catch {
      showToast("Gagal menyimpan pengaturan", "error");
    } finally {
      setLoading(false);
    }
  }

  const waPreview = form.phoneWhatsapp.trim()
    ? buildWhatsAppUrl(form.phoneWhatsapp.trim(), `Halo ${form.siteName || "Kelana Travel"}, saya ingin bertanya.`)
    : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-800">Informasi Bisnis</h2>
        <Input
          label="Nama Bisnis"
          value={form.siteName}
          onChange={(e) => update("siteName", e.target.value)}
          error={errors.siteName}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nomor WhatsApp (format 62xxx)"
            value={form.phoneWhatsapp}
            onChange={(e) => update("phoneWhatsapp", e.target.value)}
            error={errors.phoneWhatsapp}
            placeholder="6281234567890"
          />
          <Input
            label="Nomor Telepon (tampilan)"
            value={form.phoneDisplay}
            onChange={(e) => update("phoneDisplay", e.target.value)}
            error={errors.phoneDisplay}
            placeholder="0812-3456-7890"
          />
        </div>
        {waPreview && (
          <p className="text-xs text-slate-500">
            Preview link WhatsApp:{" "}
            <a href={waPreview} target="_blank" rel="noreferrer" className="text-primary-600 underline">
              {waPreview}
            </a>
          </p>
        )}
        <Input
          label="Email (opsional)"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <Textarea
          label="Alamat (opsional)"
          rows={2}
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
        />
        <Input
          label="Google Maps Embed URL (opsional)"
          value={form.mapsEmbedUrl}
          onChange={(e) => update("mapsEmbedUrl", e.target.value)}
          placeholder="https://www.google.com/maps/embed?..."
        />
      </section>

      <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-800">Hero Section</h2>
        <Input
          label="Tagline Hero"
          value={form.heroTagline}
          onChange={(e) => update("heroTagline", e.target.value)}
          error={errors.heroTagline}
        />
        <Textarea
          label="Subteks Hero (opsional)"
          rows={2}
          value={form.heroSubtext}
          onChange={(e) => update("heroSubtext", e.target.value)}
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Gambar Hero (opsional)</label>
          <ImageUploader
            folder="settings"
            value={form.heroImageUrl}
            onChange={(url) => update("heroImageUrl", url)}
            onError={(msg) => showToast(msg, "error")}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
