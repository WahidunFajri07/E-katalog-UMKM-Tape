"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, Pencil, Trash2, X, Loader2, Save, Check } from "lucide-react";

interface Kategori {
  id: number;
  namaKategori: string;
  _count?: { produkList: number };
}

export default function KelolaKategoriPage() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingKategori, setEditingKategori] = useState<Kategori | null>(null);
  const [namaKategori, setNamaKategori] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchKategori() {
    setLoading(true);
    const res = await fetch("/api/kategori");
    const data = await res.json();
    setKategoriList(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchKategori();
  }, []);

  function openAddModal() {
    setEditingKategori(null);
    setNamaKategori("");
    setError("");
    setShowModal(true);
  }

  function openEditModal(kat: Kategori) {
    setEditingKategori(kat);
    setNamaKategori(kat.namaKategori);
    setError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    let res;
    if (editingKategori) {
      res = await fetch(`/api/kategori/${editingKategori.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaKategori }),
      });
    } else {
      res = await fetch("/api/kategori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaKategori }),
      });
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menyimpan.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setShowModal(false);
    fetchKategori();
  }

  async function handleDelete(kat: Kategori) {
    if (!confirm(`Yakin ingin menghapus kategori "${kat.namaKategori}"?`)) return;

    const res = await fetch(`/api/kategori/${kat.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Gagal menghapus.");
      return;
    }
    fetchKategori();
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header + Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent sm:h-11 sm:w-11">
            <Tag className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
              Kelola Kategori
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Tambah, ubah, atau hapus kategori produk tape
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:h-10 sm:w-auto sm:px-5"
        >
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </button>
      </div>

      {/* Category list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : kategoriList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
          <Tag className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Belum ada kategori</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {kategoriList.map((kat) => (
            <div
              key={kat.id}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-card px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md sm:px-5 sm:py-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground sm:text-base">
                    {kat.namaKategori}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {kat._count?.produkList ?? 0} produk
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditModal(kat)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={`Edit ${kat.namaKategori}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(kat)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Hapus ${kat.namaKategori}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">
                {editingKategori ? "Edit Kategori" : "Tambah Kategori"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground sm:text-sm">
                  Nama Kategori <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={namaKategori}
                  onChange={(e) => setNamaKategori(e.target.value)}
                  required
                  placeholder="Contoh: Tape Singkong"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
