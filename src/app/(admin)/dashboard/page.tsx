"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Store,
  Package,
  Tag,
  EyeOff,
  Loader2,
} from "lucide-react";

interface Summary {
  totalUmkm: number;
  totalProduk: number;
  totalKategori: number;
  umkmNonaktif: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  const summaryCards = [
    {
      label: "Total UMKM",
      value: data?.totalUmkm ?? "—",
      icon: Store,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Total Produk",
      value: data?.totalProduk ?? "—",
      icon: Package,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Kategori",
      value: data?.totalKategori ?? "—",
      icon: Tag,
      color: "bg-tape-light/20 text-tape",
    },
    {
      label: "UMKM Nonaktif",
      value: data?.umkmNonaktif ?? "—",
      icon: EyeOff,
      color: "bg-destructive/10 text-destructive",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
          <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
            Dashboard
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Ringkasan data E-Katalog UMKM Tape
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border/50 bg-card p-3.5 shadow-sm transition-shadow hover:shadow-md sm:p-4 lg:p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${card.color}`}
              >
                <card.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    card.value
                  )}
                </p>
                <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
                  {card.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent UMKM Section */}
      <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm sm:p-5 lg:p-6">
        <h2 className="mb-4 font-heading text-base font-bold text-foreground sm:text-lg">
          Informasi Sistem
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            ✅ Database terhubung — MySQL
          </p>
          <p>
            ✅ Autentikasi aktif — NextAuth
          </p>
          <p>
            ✅ API endpoint tersedia — UMKM, Produk, Kategori, Galeri
          </p>
        </div>
      </div>
    </div>
  );
}
