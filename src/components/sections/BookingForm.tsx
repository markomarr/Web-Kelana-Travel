"use client";

import { useMemo, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/utils";

interface RoutePair {
  cityFrom: string;
  cityTo: string;
}

interface BookingFormProps {
  siteName: string;
  phoneWhatsapp: string;
  routePairs: RoutePair[];
}

interface FormState {
  cityFrom: string;
  cityTo: string;
  date: string;
  passengers: string;
  name: string;
}

const INITIAL_STATE: FormState = {
  cityFrom: "",
  cityTo: "",
  date: "",
  passengers: "1",
  name: "",
};

export function BookingForm({ siteName, phoneWhatsapp, routePairs }: BookingFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const cityFromOptions = useMemo(() => {
    return Array.from(new Set(routePairs.map((r) => r.cityFrom))).sort();
  }, [routePairs]);

  const cityToOptions = useMemo(() => {
    const pairs = form.cityFrom
      ? routePairs.filter((r) => r.cityFrom === form.cityFrom)
      : routePairs;
    return Array.from(new Set(pairs.map((r) => r.cityTo))).sort();
  }, [routePairs, form.cityFrom]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.cityFrom) newErrors.cityFrom = "Wajib diisi";
    if (!form.cityTo) newErrors.cityTo = "Wajib diisi";
    if (!form.date) {
      newErrors.date = "Wajib diisi";
    } else if (form.date < today) {
      newErrors.date = "Pilih tanggal yang akan datang";
    }
    if (!form.passengers || Number(form.passengers) < 1) newErrors.passengers = "Wajib diisi";
    if (!form.name.trim()) newErrors.name = "Wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const message =
      `Halo ${siteName}, saya ${form.name} ingin pesan travel:\n` +
      `🛣 Rute: ${form.cityFrom} → ${form.cityTo}\n` +
      `📅 Tanggal: ${form.date}\n` +
      `👥 Penumpang: ${form.passengers} orang`;

    const url = buildWhatsAppUrl(phoneWhatsapp, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20";
  const labelClass = "mb-1.5 block text-xs font-medium text-text-secondary";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="cityFrom">
            Kota Asal
          </label>
          <select
            id="cityFrom"
            className={inputClass}
            value={form.cityFrom}
            onChange={(e) => update("cityFrom", e.target.value)}
          >
            <option value="">Pilih kota</option>
            {cityFromOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.cityFrom && <p className={errorClass}>{errors.cityFrom}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="cityTo">
            Kota Tujuan
          </label>
          <select
            id="cityTo"
            className={inputClass}
            value={form.cityTo}
            onChange={(e) => update("cityTo", e.target.value)}
          >
            <option value="">Pilih kota</option>
            {cityToOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.cityTo && <p className={errorClass}>{errors.cityTo}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="date">
            Tanggal Berangkat
          </label>
          <input
            id="date"
            type="date"
            min={today}
            className={inputClass}
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
          {errors.date && <p className={errorClass}>{errors.date}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="passengers">
            Jumlah Penumpang
          </label>
          <input
            id="passengers"
            type="number"
            min={1}
            max={20}
            className={inputClass}
            value={form.passengers}
            onChange={(e) => update("passengers", e.target.value)}
          />
          {errors.passengers && <p className={errorClass}>{errors.passengers}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="name">
            Nama Pemesan
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nama lengkap"
            className={inputClass}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-dark transition-colors hover:bg-accent-hover active:scale-[0.99]"
      >
        Pesan Sekarang
      </button>
    </form>
  );
}
