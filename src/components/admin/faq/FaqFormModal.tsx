"use client";

import { useEffect, useState } from "react";
import type { FaqItem } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface FaqFormModalProps {
  open: boolean;
  faq: FaqItem | null;
  onClose: () => void;
  onSaved: (faq: FaqItem) => void;
  onError: (message: string) => void;
}

interface FormState {
  question: string;
  answer: string;
}

const EMPTY_FORM: FormState = { question: "", answer: "" };

export function FaqFormModal({ open, faq, onClose, onSaved, onError }: FaqFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(faq ? { question: faq.question, answer: faq.answer } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, faq]);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.question.trim()) next.question = "Wajib diisi";
    if (!form.answer.trim()) next.answer = "Wajib diisi";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = faq ? `/api/admin/faq/${faq.id}` : "/api/admin/faq";
      const method = faq ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: form.question.trim(),
          answer: form.answer.trim(),
        }),
      });
      const json = await res.json();
      if (!json.success) {
        onError(json.error ?? "Gagal menyimpan FAQ");
        return;
      }
      onSaved(json.data);
    } catch {
      onError("Gagal menyimpan FAQ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={faq ? "Edit FAQ" : "Tambah FAQ"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Pertanyaan"
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          error={errors.question}
        />
        <Textarea
          label="Jawaban"
          rows={4}
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          error={errors.answer}
        />

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
