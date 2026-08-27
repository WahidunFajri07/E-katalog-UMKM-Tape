"use client";

import { useState, useEffect, useRef } from "react";
import {
  ImageIcon,
  Upload,
  Trash2,
  X,
  Loader2,
  Save,
} from "lucide-react";
import Image from "next/image";

interface Umkm {
  id: number;
  namaUsaha: string;
}

interface Galeri {
  id: number;
  urlFoto: string;
  keterangan: string | null;
  umkm: { namaUsaha: string };
}

export default function KelolaGaleriPage() {
  const [galeriList, setGaleriList] = useState<Galeri[]>([]);
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUmkm, setFilterUmkm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    umkmId: "",
    urlFoto: "",
    keterangan: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function fetchGaleri() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterUmkm) params.set("umkmId", filterUmkm);
    const res = await fetch(`/api/galeri?${params}`);
    const data = await res.json();
    setGaleriList(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchGaleri();
    fetch("/api/umkm?all=true").then((r) => r.json()).then(setUmkmList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterUmkm]);

  async function handleFileUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      setForm({ ...form, urlFoto: data.url });
      setPreviewUrl(data.url);
    } else {
      alert(data.error || "Gagal upload.");
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.urlFoto) {
      alert("Upload foto terlebih dahulu.");
      return;
    }
    setSaving(true);

    await fetch("/api/galeri", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    setShowModal(false);
    setPreviewUrl(null);
    setForm({ umkmId: "", urlFoto: "", keterangan: "" });
    fetchGaleri();
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus foto ini?")) return;
    await fetch(`/api/galeri/${id}`, { method: "DELETE" });
    fetchGaleri();
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header + Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tape-light/20 text-tape sm:h-11 sm:w-11">
            <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
              Kelola Galeri
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Upload dan kelola foto dokumentasi UMKM
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm({ umkmId: "", urlFoto: "", keterangan: "" });
            setPreviewUrl(null);
            setShowModal(true);
          }}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:h-10 sm:w-auto sm:px-5"
        >
          <Upload className="h-4 w-4" />
          Upload Foto
        </button>
      </div>

      {/* UMKM Filter */}
      <select
        value={filterUmkm}
        onChange={(e) => setFilterUmkm(e.target.value)}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:max-w-xs"
      >
        <option value="">Semua UMKM</option>
        {umkmList.map((u) => (
          <option key={u.id} value={u.id}>{u.namaUsaha}</option>
        ))}
      </select>

      {/* Photo grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : galeriList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
          <ImageIcon className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Belum ada foto</p>
        </div>
      ) : (
        <div>
          <h2 className="mb-3 font-heading text-base font-bold text-foreground sm:mb-4 sm:text-lg">
            Foto Terupload ({galeriList.length})
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
            {galeriList.map((foto) => (
              <div
                key={foto.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border/50 bg-muted"
              >
                <Image
                  src={foto.urlFoto}
                  alt={foto.keterangan || "Foto galeri"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/40 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleDelete(foto.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg sm:h-9 sm:w-9"
                    aria-label="Hapus foto"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-2">
                  <p className="truncate text-xs text-white">
                    {foto.keterangan || foto.umkm.namaUsaha}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">Upload Foto</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* UMKM */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground sm:text-sm">
                  UMKM <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.umkmId}
                  onChange={(e) => setForm({ ...form, umkmId: e.target.value })}
                  required
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Pilih UMKM</option>
                  {umkmList.map((u) => (
                    <option key={u.id} value={u.id}>{u.namaUsaha}</option>
                  ))}
                </select>
              </div>

              {/* Upload zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-border bg-card/50 p-6 text-center transition-colors hover:border-primary/40"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {uploading ? (
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                ) : previewUrl ? (
                  <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-lg">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Klik atau drag foto di sini</p>
                    <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP — max 10MB</p>
                  </>
                )}
              </div>

              {/* Keterangan */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground sm:text-sm">Keterangan</label>
                <input
                  type="text"
                  value={form.keterangan}
                  onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                  placeholder="Deskripsi singkat foto"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <button
                type="submit"
                disabled={saving || !form.urlFoto}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
