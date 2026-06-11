"use client";

import { useState } from "react";
import { buildWhatsAppUrl } from "@/lib/utils";

interface ContactFormProps {
  siteName: string;
  phoneWhatsapp: string;
}

interface FormState {
  name: string;
  phone: string;
  message: string;
}

const INITIAL_STATE: FormState = { name: "", phone: "", message: "" };

export function ContactForm({ siteName, phoneWhatsapp }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) newErrors.name = "Wajib diisi";
    if (!form.phone.trim()) newErrors.phone = "Wajib diisi";
    if (!form.message.trim()) newErrors.message = "Wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const message =
      `Halo ${siteName}, saya ${form.name} (${form.phone}).\n` + `Pesan: ${form.message}`;

    const url = buildWhatsAppUrl(phoneWhatsapp, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20";
  const labelClass = "mb-1.5 block text-xs font-medium text-text-secondary";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="contact-name">
            Nama
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Nama lengkap"
            className={inputClass}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="contact-phone">
            Nomor HP
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            className={inputClass}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="contact-message">
            Pesan
          </label>
          <textarea
            id="contact-message"
            rows={4}
            placeholder="Tulis pesan Anda di sini"
            className={inputClass}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
          />
          {errors.message && <p className={errorClass}>{errors.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-dark transition-colors hover:bg-accent-hover active:scale-[0.99] sm:w-auto"
      >
        Kirim via WhatsApp
      </button>
    </form>
  );
}
