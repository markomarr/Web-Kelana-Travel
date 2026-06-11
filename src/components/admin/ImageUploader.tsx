"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, X } from "lucide-react";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/constants";

interface ImageUploaderProps {
  folder: string;
  value: string | null;
  onChange: (url: string | null) => void;
  onError: (message: string) => void;
}

export function ImageUploader({ folder, value, onChange, onError }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      onError("Format tidak didukung. Hanya JPG, PNG, atau WebP");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      onError("Ukuran file maksimal 2MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) {
        onError(json.error ?? "Gagal mengunggah file");
        return;
      }
      onChange(json.data.url);
    } catch {
      onError("Gagal mengunggah file");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  if (value) {
    return (
      <div className="relative h-40 w-full overflow-hidden rounded-xl border border-slate-200">
        <Image src={value} alt="Preview foto" fill className="object-cover" sizes="320px" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
          aria-label="Hapus foto"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm transition-colors ${
        dragOver ? "border-primary-600 bg-primary-600/5" : "border-slate-300 text-slate-500 hover:border-primary-600"
      }`}
    >
      {uploading ? (
        <Loader2 size={24} className="animate-spin text-primary-600" />
      ) : (
        <>
          <UploadCloud size={24} />
          <span>Klik atau seret foto ke sini</span>
          <span className="text-xs text-slate-400">JPG, PNG, WebP — maks 2MB</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
