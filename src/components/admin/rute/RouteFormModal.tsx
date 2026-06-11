"use client";

import { useEffect, useState } from "react";
import type { Route } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface RouteFormModalProps {
  open: boolean;
  route: Route | null;
  onClose: () => void;
  onSaved: (route: Route) => void;
  onError: (message: string) => void;
}

interface FormState {
  cityFrom: string;
  cityTo: string;
  durationEst: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = { cityFrom: "", cityTo: "", durationEst: "", isActive: true };

export function RouteFormModal({ open, route, onClose, onSaved, onError }: RouteFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        route
          ? {
              cityFrom: route.cityFrom,
              cityTo: route.cityTo,
              durationEst: route.durationEst ?? "",
              isActive: route.isActive,
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, route]);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.cityFrom.trim()) next.cityFrom = "Wajib diisi";
    if (!form.cityTo.trim()) next.cityTo = "Wajib diisi";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = route ? `/api/admin/routes/${route.id}` : "/api/admin/routes";
      const method = route ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityFrom: form.cityFrom.trim(),
          cityTo: form.cityTo.trim(),
          durationEst: form.durationEst.trim(),
          isActive: form.isActive,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        onError(json.error ?? "Gagal menyimpan rute");
        return;
      }
      onSaved(json.data);
    } catch {
      onError("Gagal menyimpan rute");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={route ? "Edit Rute" : "Tambah Rute"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Kota Asal"
          value={form.cityFrom}
          onChange={(e) => setForm((f) => ({ ...f, cityFrom: e.target.value }))}
          error={errors.cityFrom}
        />
        <Input
          label="Kota Tujuan"
          value={form.cityTo}
          onChange={(e) => setForm((f) => ({ ...f, cityTo: e.target.value }))}
          error={errors.cityTo}
        />
        <Input
          label="Estimasi Durasi"
          placeholder="Mis. 2-3 jam"
          value={form.durationEst}
          onChange={(e) => setForm((f) => ({ ...f, durationEst: e.target.value }))}
          error={errors.durationEst}
        />
        <Select
          label="Status"
          value={form.isActive ? "aktif" : "nonaktif"}
          onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === "aktif" }))}
        >
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </Select>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
