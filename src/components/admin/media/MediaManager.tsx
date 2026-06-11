"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, Trash2, Copy } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/constants";
import type { FileEntry } from "@/lib/media";

interface MediaManagerProps {
  initialFiles: FileEntry[];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaManager({ initialFiles }: MediaManagerProps) {
  const { showToast } = useToast();
  const [files, setFiles] = useState<FileEntry[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FileEntry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showToast("Format tidak didukung. Hanya JPG, PNG, atau WebP", "error");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast("Ukuran file maksimal 2MB", "error");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "uploads");

      const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error ?? "Gagal mengunggah file", "error");
        return;
      }

      const newEntry: FileEntry = {
        name: json.data.path.split("/").pop(),
        path: json.data.path,
        url: json.data.url,
        size: file.size,
        createdAt: new Date().toISOString(),
      };
      setFiles((prev) => [newEntry, ...prev]);
      showToast("File berhasil diunggah");
    } catch {
      showToast("Gagal mengunggah file", "error");
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

  async function handleCopy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      showToast("URL berhasil disalin");
    } catch {
      showToast("Gagal menyalin URL", "error");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const segments = deleteTarget.path.split("/").map(encodeURIComponent).join("/");
      const res = await fetch(`/api/admin/media/${segments}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error ?? "Gagal menghapus file", "error");
        return;
      }
      setFiles((prev) => prev.filter((f) => f.path !== deleteTarget.path));
      showToast("File berhasil dihapus");
      setDeleteTarget(null);
    } catch {
      showToast("Gagal menghapus file", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
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
        className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-white text-sm transition-colors ${
          dragOver ? "border-primary-600 bg-primary-600/5" : "border-slate-300 text-slate-500 hover:border-primary-600"
        }`}
      >
        {uploading ? (
          <Loader2 size={24} className="animate-spin text-primary-600" />
        ) : (
          <>
            <UploadCloud size={24} />
            <span>Klik atau seret file ke sini untuk mengunggah</span>
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

      {files.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-slate-400 shadow-sm">
          Belum ada file yang diunggah.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {files.map((file) => (
            <div key={file.path} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="relative h-32 w-full bg-slate-100">
                <Image src={file.url} alt={file.name} fill className="object-cover" sizes="200px" />
              </div>
              <div className="flex flex-col gap-2 p-3">
                <p className="truncate text-xs font-medium text-slate-700" title={file.path}>
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleCopy(file.url)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Copy size={12} />
                    Salin URL
                  </button>
                  <button
                    onClick={() => setDeleteTarget(file)}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Hapus file"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus File"
        description={`Hapus file "${deleteTarget?.name ?? ""}"? Pastikan file ini tidak sedang digunakan.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
