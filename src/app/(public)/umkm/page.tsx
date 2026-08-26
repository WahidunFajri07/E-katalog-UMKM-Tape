"use client";

import { useState, useEffect, useCallback } from "react";
import { Store, Search, MapPin, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Umkm {
  id: number;
  namaUsaha: string;
  slug: string;
  namaPemilik: string;
  alamat: string;
  fotoProfil: string | null;
  _count?: { produkList: number };
  produkList?: { kategori: { namaKategori: string } }[];
}

interface Kategori {
  id: number;
  namaKategori: string;
}

export default function DaftarUmkmPage() {
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  const fetchUmkm = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedKategori) params.set("kategori", selectedKategori);
    const res = await fetch(`/api/umkm?${params}`);
    const data = await res.json();
    setUmkmList(data);
    setLoading(false);
  }, [search, selectedKategori]);

  useEffect(() => {
    fetchUmkm();
    fetch("/api/kategori").then((r) => r.json()).then(setKategoriList);
  }, [fetchUmkm]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      {/* ---- Page Header ---- */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mb-4 sm:h-14 sm:w-14">
          <Store className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Katalog UMKM Tape
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
          Daftar seluruh pelaku UMKM Tape di Desa Bakung Kidul
        </p>
      </div>

      {/* ---- Search & Filter Bar ---- */}
      <div className="mx-auto mt-6 max-w-xl sm:mt-8 md:mt-10">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground sm:h-5 sm:w-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari UMKM atau produk..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        {/* Category filter chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedKategori("")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:px-4 sm:py-1.5 sm:text-sm ${
              selectedKategori === ""
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            Semua
          </button>
          {kategoriList.map((kat) => (
            <button
              key={kat.id}
              onClick={() => setSelectedKategori(kat.namaKategori)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:px-4 sm:py-1.5 sm:text-sm ${
                selectedKategori === kat.namaKategori
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {kat.namaKategori}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Grid ---- */}
      <div className="mt-8 sm:mt-10 md:mt-12">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : umkmList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Store className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Tidak ada UMKM yang ditemukan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {umkmList.map((umkm) => (
              <Link
                key={umkm.id}
                href={`/umkm/${umkm.slug}`}
                className="group overflow-hidden rounded-xl border border-border/50 bg-card transition-shadow hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full bg-muted">
                  {umkm.fotoProfil ? (
                    <Image
                      src={umkm.fotoProfil}
                      alt={umkm.namaUsaha}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
                      <Store className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="space-y-2 p-4 sm:p-5">
                  <h3 className="font-heading text-base font-bold text-foreground sm:text-lg group-hover:text-primary transition-colors">
                    {umkm.namaUsaha}
                  </h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {umkm.namaPemilik}
                  </p>
                  <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {umkm.alamat.length > 30 ? umkm.alamat.substring(0, 30) + "..." : umkm.alamat}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {umkm._count?.produkList ?? 0} produk
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
