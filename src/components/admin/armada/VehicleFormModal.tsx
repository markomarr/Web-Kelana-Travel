"use client";

import { useEffect, useState } from "react";
import type { Vehicle } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FACILITY_OPTIONS } from "@/lib/constants";

interface VehicleFormModalProps {
  open: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onSaved: (vehicle: Vehicle) => void;
  onError: (message: string) => void;
}

interface FormState {
  name: string;
  capacity: string;
  description: string;
  isActive: boolean;
  facilities: string[];
  photoUrl: string | null;
}

const EMPTY_FORM: FormState = {
  name: "",
  capacity: "",
  description: "",
  isActive: true,
  facilities: [],
  photoUrl: null,
};

function parseFacilities(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

export function VehicleFormModal({ open, vehicle, onClose, onSaved, onError }: VehicleFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<"name" | "capacity", string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        vehicle
          ? {
              name: vehicle.name,
              capacity: String(vehicle.capacity),
              description: vehicle.description ?? "",
              isActive: vehicle.isActive,
              facilities: parseFacilities(vehicle.facilities),
              photoUrl: vehicle.photoUrl,
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, vehicle]);

  function validate(): boolean {
    const next: Partial<Record<"name" | "capacity", string>> = {};
    if (!form.name.trim()) next.name = "Wajib diisi";
    const capacityNum = Number(form.capacity);
    if (!form.capacity || !Number.isInteger(capacityNum) || capacityNum <= 0) {
      next.capacity = "Wajib diisi, berupa angka positif";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function toggleFacility(facility: string) {
    setForm((f) => ({
      ...f,
      facilities: f.facilities.includes(facility)
        ? f.facilities.filter((x) => x !== facility)
        : [...f.facilities, facility],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = vehicle ? `/api/admin/vehicles/${vehicle.id}` : "/api/admin/vehicles";
      const method = vehicle ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          capacity: Number(form.capacity),
          description: form.description.trim(),
          isActive: form.isActive,
          facilities: form.facilities,
          photoUrl: form.photoUrl,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        onError(json.error ?? "Gagal menyimpan armada");
        return;
      }
      onSaved(json.data);
    } catch {
      onError("Gagal menyimpan armada");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={vehicle ? "Edit Armada" : "Tambah Armada"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Foto Armada</label>
          <ImageUploader
            folder="armada"
            value={form.photoUrl}
            onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
            onError={onError}
          />
        </div>

        <Input
          label="Nama Armada"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
        />
        <Input
          label="Kapasitas (penumpang)"
          type="number"
          min={1}
          value={form.capacity}
          onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
          error={errors.capacity}
        />
        <Textarea
          label="Deskripsi"
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Fasilitas</label>
          <div className="flex flex-wrap gap-2">
            {FACILITY_OPTIONS.map((facility) => {
              const active = form.facilities.includes(facility);
              return (
                <button
                  key={facility}
                  type="button"
                  onClick={() => toggleFacility(facility)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {facility}
                </button>
              );
            })}
          </div>
        </div>

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
