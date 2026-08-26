"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Store,
  Plus,
  Search,
  ToggleRight,
  ToggleLeft,
  Pencil,
  Trash2,
  X,
  Loader2,
  Save,
} from "lucide-react";

interface Umkm {
  id: number;
  namaUsaha: string;
  slug: string;
  namaPemilik: string;
  alamat: string;
  noTelepon: string;
  tahunBerdiri: string | null;
  fotoProfil: string | null;
  sampulToko: string | null;
  statusTampil: boolean;
  linkGmaps: string | null;
  _count?: { produkList: number; galeriList: number };
}

export default function KelolaUmkmPage() {
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUmkm, setEditingUmkm] = useState<Umkm | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    namaUsaha: "",
    namaPemilik: "",
    alamat: "",
    noTelepon: "",
    tahunBerdiri: "",
    fotoProfil: "",
    sampulToko: "",
    linkGmaps: "",
  });

  const fetchUmkm = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/umkm?all=true&search=${search}`);
    const data = await res.json();
    setUmkmList(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchUmkm();
  }, [fetchUmkm]);

  function openAddModal() {
    setEditingUmkm(null);
    setForm({ namaUsaha: "", namaPemilik: "", alamat: "", noTelepon: "", tahunBerdiri: "", fotoProfil: "", sampulToko: "", linkGmaps: "" });
    setShowModal(true);
  }

  function openEditModal(umkm: Umkm) {
    setEditingUmkm(umkm);
    setForm({
      namaUsaha: umkm.namaUsaha,
      namaPemilik: umkm.namaPemilik,
      alamat: umkm.alamat,
      noTelepon: umkm.noTelepon,
      tahunBerdiri: umkm.tahunBerdiri || "",
      fotoProfil: umkm.fotoProfil || "",
      sampulToko: umkm.sampulToko || "",
      linkGmaps: umkm.linkGmaps || "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editingUmkm) {
      await fetch(`/api/umkm/${editingUmkm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/umkm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setSaving(false);
    setShowModal(false);
    fetchUmkm();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) {
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
      setForm((prev) => ({ ...prev, [fieldKey]: data.url }));
    } catch (err) {
      alert("Gagal mengunggah foto. Pastikan ukuran maks 5MB.");
    }
  }

  async function handleToggle(id: number) {
    await fetch(`/api/umkm/${id}/toggle-status`, { method: "PATCH" });
    fetchUmkm();
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus UMKM ini? Data produk dan galeri terkait juga akan terhapus.")) return;
    await fetch(`/api/umkm/${id}`, { method: "DELETE" });
    fetchUmkm();
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header + Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
            <Store className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
              Kelola UMKM
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Tambah, ubah, atau hapus data pelaku UMKM Tape
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:h-10 sm:w-auto sm:px-5"
        >
          <Plus className="h-4 w-4" />
          Tambah UMKM
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm sm:max-w-sm sm:px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari UMKM..."
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : umkmList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
          <Store className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Belum ada data UMKM</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border border-border/50 bg-card shadow-sm sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 sm:px-5">Nama Usaha</th>
                  <th className="px-4 py-3 sm:px-5">Pemilik</th>
                  <th className="hidden px-4 py-3 md:table-cell sm:px-5">Alamat</th>
                  <th className="px-4 py-3 sm:px-5">Status</th>
                  <th className="px-4 py-3 text-right sm:px-5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {umkmList.map((umkm) => (
                  <tr key={umkm.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Store className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{umkm.namaUsaha}</p>
                          <p className="text-xs text-muted-foreground">
                            {umkm._count?.produkList ?? 0} produk
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground sm:px-5">{umkm.namaPemilik}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell sm:px-5">
                      {umkm.alamat}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <button
                        onClick={() => handleToggle(umkm.id)}
                        className="flex items-center gap-1.5"
                      >
                        {umkm.statusTampil ? (
                          <>
                            <ToggleRight className="h-5 w-5 text-accent" />
                            <span className="text-xs text-accent">Aktif</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Nonaktif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openEditModal(umkm)}
                          className="inline-flex h-7 items-center gap-1 rounded px-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(umkm.id)}
                          className="inline-flex h-7 items-center gap-1 rounded px-2 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                          Hapus
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
            {umkmList.map((umkm) => (
              <div
                key={umkm.id}
                className="rounded-xl border border-border/50 bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{umkm.namaUsaha}</p>
                      <p className="text-xs text-muted-foreground">{umkm.namaPemilik}</p>
                    </div>
                  </div>
                  <button onClick={() => handleToggle(umkm.id)}>
                    {umkm.statusTampil ? (
                      <ToggleRight className="h-5 w-5 text-accent" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="mt-3 flex gap-2 border-t border-border/40 pt-3">
                  <button
                    onClick={() => openEditModal(umkm)}
                    className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(umkm.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
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
                {editingUmkm ? "Edit UMKM" : "Tambah UMKM"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "namaUsaha", label: "Nama Usaha", required: true, type: "text" },
                { key: "namaPemilik", label: "Nama Pemilik", required: true, type: "text" },
                { key: "alamat", label: "Alamat", required: true, type: "text" },
                { key: "noTelepon", label: "No. Telepon", required: true, type: "text" },
                { key: "tahunBerdiri", label: "Tahun Berdiri", required: false, type: "text" },
                { key: "fotoProfil", label: "Foto Profil (Opsional)", required: false, type: "file" },
                { key: "sampulToko", label: "Sampul Toko (Opsional)", required: false, type: "file" },
                { key: "linkGmaps", label: "Link Lokasi (Google Maps)", required: false, type: "text" },
              ].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground sm:text-sm">
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </label>
                  {field.type === "file" ? (
                    <div className="flex flex-col gap-2">
                      {form[field.key as keyof typeof form] && (
                        <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border">
                          <img src={form[field.key as keyof typeof form]} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, field.key)}
                        className="w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      required={field.required}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                disabled={saving}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
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
