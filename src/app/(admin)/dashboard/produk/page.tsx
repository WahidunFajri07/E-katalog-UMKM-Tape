"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  Save,
} from "lucide-react";

interface Kategori {
  id: number;
  namaKategori: string;
}

interface Umkm {
  id: number;
  namaUsaha: string;
}

interface Produk {
  id: number;
  namaProduk: string;
  deskripsi: string | null;
  harga: number;
  stok: number;
  fotoProduk: string | null;
  kategori: Kategori;
  umkm: { id: number; namaUsaha: string };
}

export default function KelolaProdukPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterUmkm, setFilterUmkm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduk, setEditingProduk] = useState<Produk | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    umkmId: "",
    kategoriId: "",
    namaProduk: "",
    deskripsi: "",
    harga: "",
    stok: "0",
    fotoProduk: "",
  });

  const fetchProduk = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterUmkm) params.set("umkmId", filterUmkm);
    const res = await fetch(`/api/produk?${params}`);
    const data = await res.json();
    setProdukList(data);
    setLoading(false);
  }, [filterUmkm]);

  useEffect(() => {
    fetchProduk();
    fetch("/api/kategori").then((r) => r.json()).then(setKategoriList);
    fetch("/api/umkm?all=true").then((r) => r.json()).then(setUmkmList);
  }, [fetchProduk]);

  function openAddModal() {
    setEditingProduk(null);
    setForm({ umkmId: "", kategoriId: "", namaProduk: "", deskripsi: "", harga: "", stok: "0", fotoProduk: "" });
    setShowModal(true);
  }

  function openEditModal(produk: Produk) {
    setEditingProduk(produk);
    setForm({
      umkmId: String(produk.umkm.id),
      kategoriId: String(produk.kategori.id),
      namaProduk: produk.namaProduk,
      deskripsi: produk.deskripsi || "",
      harga: String(produk.harga),
      stok: String(produk.stok),
      fotoProduk: produk.fotoProduk || "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editingProduk) {
      await fetch(`/api/produk/${editingProduk.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/produk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setSaving(false);
    setShowModal(false);
    fetchProduk();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((prev) => ({ ...prev, fotoProduk: data.url }));
    } catch (err) {
      alert("Gagal mengunggah foto. Pastikan ukuran maks 5MB.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    await fetch(`/api/produk/${id}`, { method: "DELETE" });
    fetchProduk();
  }

  function formatHarga(harga: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(harga);
  }

  const filtered = produkList.filter((p) =>
    p.namaProduk.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header + Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
            <Package className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
              Kelola Produk
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Tambah, ubah, atau hapus produk tape per UMKM
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:h-10 sm:w-auto sm:px-5"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm sm:max-w-xs sm:px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <select
          value={filterUmkm}
          onChange={(e) => setFilterUmkm(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">Semua UMKM</option>
          {umkmList.map((u) => (
            <option key={u.id} value={u.id}>{u.namaUsaha}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
          <Package className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Belum ada produk</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border border-border/50 bg-card shadow-sm sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 sm:px-5">Produk</th>
                  <th className="px-4 py-3 sm:px-5">UMKM</th>
                  <th className="px-4 py-3 sm:px-5">Kategori</th>
                  <th className="hidden px-4 py-3 md:table-cell sm:px-5">Harga</th>
                  <th className="hidden px-4 py-3 lg:table-cell sm:px-5">Stok</th>
                  <th className="px-4 py-3 text-right sm:px-5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((produk) => (
                  <tr key={produk.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 sm:px-5">
                      <p className="font-medium text-foreground">{produk.namaProduk}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{formatHarga(produk.harga)}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground sm:px-5">{produk.umkm.namaUsaha}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <span className="inline-flex rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {produk.kategori.namaKategori}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-foreground md:table-cell sm:px-5">
                      {formatHarga(produk.harga)}
                    </td>
                    <td className="hidden px-4 py-3 text-foreground lg:table-cell sm:px-5">{produk.stok}</td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openEditModal(produk)}
                          className="inline-flex h-7 items-center gap-1 rounded px-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(produk.id)}
                          className="inline-flex h-7 items-center gap-1 rounded px-2 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 sm:hidden">
            {filtered.map((produk) => (
              <div key={produk.id} className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-foreground">{produk.namaProduk}</p>
                    <p className="text-xs text-muted-foreground">{produk.umkm.namaUsaha}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                        {produk.kategori.namaKategori}
                      </span>
                      <span className="text-xs font-semibold text-primary">{formatHarga(produk.harga)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 border-t border-border/40 pt-3">
                  <button
                    onClick={() => openEditModal(produk)}
                    className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(produk.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">
                {editingProduk ? "Edit Produk" : "Tambah Produk"}
              </h2>
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
              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground sm:text-sm">
                  Kategori <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.kategoriId}
                  onChange={(e) => setForm({ ...form, kategoriId: e.target.value })}
                  required
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriList.map((k) => (
                    <option key={k.id} value={k.id}>{k.namaKategori}</option>
                  ))}
                </select>
              </div>
              {/* Nama Produk */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground sm:text-sm">
                  Nama Produk <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.namaProduk}
                  onChange={(e) => setForm({ ...form, namaProduk: e.target.value })}
                  required
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground sm:text-sm">Deskripsi</label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {/* Harga & Stok */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground sm:text-sm">
                    Harga (Rp) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.harga}
                    onChange={(e) => setForm({ ...form, harga: e.target.value })}
                    required
                    min="0"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground sm:text-sm">Stok</label>
                  <input
                    type="number"
                    value={form.stok}
                    onChange={(e) => setForm({ ...form, stok: e.target.value })}
                    min="0"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
              {/* Foto Produk */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground sm:text-sm">
                  Foto Produk (Opsional)
                </label>
                <div className="flex flex-col gap-2">
                  {form.fotoProduk && (
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border">
                      <img src={form.fotoProduk} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, fotoProduk: "" }))}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive/80 text-white transition-colors hover:bg-destructive"
                        title="Hapus Foto"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
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
