"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@prisma/client";
import { Star } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface TestimonialFormModalProps {
  open: boolean;
  testimonial: Testimonial | null;
  onClose: () => void;
  onSaved: (testimonial: Testimonial) => void;
  onError: (message: string) => void;
}

interface FormState {
  name: string;
  rating: number;
  review: string;
  routeUsed: string;
  published: boolean;
  photoUrl: string | null;
}

const EMPTY_FORM: FormState = {
  name: "",
  rating: 5,
  review: "",
  routeUsed: "",
  published: false,
  photoUrl: null,
};

export function TestimonialFormModal({ open, testimonial, onClose, onSaved, onError }: TestimonialFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<"name" | "review", string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        testimonial
          ? {
              name: testimonial.name,
              rating: testimonial.rating,
              review: testimonial.review,
              routeUsed: testimonial.routeUsed ?? "",
              published: testimonial.published,
              photoUrl: testimonial.photoUrl,
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, testimonial]);

  function validate(): boolean {
    const next: Partial<Record<"name" | "review", string>> = {};
    if (!form.name.trim()) next.name = "Wajib diisi";
    if (!form.review.trim()) next.review = "Wajib diisi";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = testimonial ? `/api/admin/testimonials/${testimonial.id}` : "/api/admin/testimonials";
      const method = testimonial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          rating: form.rating,
          review: form.review.trim(),
          routeUsed: form.routeUsed.trim(),
          published: form.published,
          photoUrl: form.photoUrl,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        onError(json.error ?? "Gagal menyimpan testimonial");
        return;
      }
      onSaved(json.data);
    } catch {
      onError("Gagal menyimpan testimonial");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={testimonial ? "Edit Testimonial" : "Tambah Testimonial"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Foto (opsional)</label>
          <ImageUploader
            folder="testimonial"
            value={form.photoUrl}
            onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
            onError={onError}
          />
        </div>

        <Input
          label="Nama"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm((f) => ({ ...f, rating: star }))}
                aria-label={`Rating ${star}`}
                className="text-amber-400"
              >
                <Star size={24} fill={star <= form.rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Ulasan"
          rows={4}
          value={form.review}
          onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
          error={errors.review}
        />

        <Input
          label="Rute yang digunakan (opsional)"
          value={form.routeUsed}
          onChange={(e) => setForm((f) => ({ ...f, routeUsed: e.target.value }))}
          placeholder="contoh: Jakarta - Bandung"
        />

        <Select
          label="Status"
          value={form.published ? "published" : "draft"}
          onChange={(e) => setForm((f) => ({ ...f, published: e.target.value === "published" }))}
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
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
