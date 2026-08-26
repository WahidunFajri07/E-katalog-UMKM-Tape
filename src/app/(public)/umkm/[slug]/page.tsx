import type { Metadata } from "next";
import {
  ArrowLeft,
  MapPin,
  Phone,
  ShoppingBasket,
  Image as ImageIcon,
  Store,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GalleryViewer } from "@/components/public/gallery-viewer";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const umkm = await prisma.umkm.findUnique({ where: { slug } });

  if (!umkm) {
    return { title: "UMKM Tidak Ditemukan" };
  }

  return {
    title: `${umkm.namaUsaha} — E-Katalog Tape Bakung Kidul`,
    description: `Detail UMKM ${umkm.namaUsaha} milik ${umkm.namaPemilik} di Desa Bakung Kidul.`,
  };
}

function formatHarga(harga: number | string) {
  const num = typeof harga === "string" ? parseFloat(harga) : harga;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}

export default async function DetailUmkmPage({ params }: Props) {
  const { slug } = await params;

  const umkm = await prisma.umkm.findUnique({
    where: { slug },
    include: {
      produkList: {
        include: { kategori: true },
        orderBy: { createdAt: "desc" },
      },
      galeriList: true,
    },
  });

  if (!umkm) {
    notFound();
  }

  const waLink = `https://wa.me/${umkm.noTelepon.replace(/[^0-9]/g, "")}?text=Halo, saya tertarik dengan produk dari ${umkm.namaUsaha}`;

  // Smart map URL resolution
  let iframeUrl = `https://www.google.com/maps?q=${encodeURIComponent(umkm.namaUsaha + " " + umkm.alamat)}&output=embed`;
  if (umkm.linkGmaps) {
    if (umkm.linkGmaps.includes("<iframe") && umkm.linkGmaps.match(/src="([^"]+)"/)) {
      iframeUrl = umkm.linkGmaps.match(/src="([^"]+)"/)?.[1] || iframeUrl;
    } else if (umkm.linkGmaps.includes("google.com/maps/embed")) {
      iframeUrl = umkm.linkGmaps;
    } else if (umkm.linkGmaps.includes("@")) {
      const coordsMatch = umkm.linkGmaps.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordsMatch) {
        iframeUrl = `https://www.google.com/maps?q=${coordsMatch[1]},${coordsMatch[2]}&output=embed`;
      }
    }
  } else if (umkm.latitude && umkm.longitude) {
    iframeUrl = `https://www.google.com/maps?q=${umkm.latitude},${umkm.longitude}&output=embed`;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      {/* ---- Breadcrumb / Back ---- */}
      <Link
        href="/umkm"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Katalog
      </Link>

      {/* ---- Profile Header ---- */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm lg:rounded-2xl">
        {/* Cover image */}
        <div className="relative h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 sm:h-44 md:h-52 lg:h-60">
          {umkm.fotoProfil && (
            <Image
              src={umkm.fotoProfil}
              alt={umkm.namaUsaha}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Profile info */}
        <div className="relative px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4 lg:px-8 lg:pb-8">
          {/* Profile photo */}
          <div className="-mt-12 mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-4 border-card bg-muted sm:-mt-14 sm:mb-4 sm:h-24 sm:w-24 lg:-mt-16 lg:h-28 lg:w-28">
            {umkm.fotoProfil ? (
              <Image
                src={umkm.fotoProfil}
                alt={umkm.namaUsaha}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            ) : (
              <Store className="h-8 w-8 text-primary/40" />
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                {umkm.namaUsaha}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {umkm.alamat}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {umkm.noTelepon}
                </span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1DA851] hover:shadow-md sm:h-11 sm:w-auto sm:px-6"
            >
              <Phone className="h-4 w-4" />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ---- Content Grid ---- */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 lg:grid-cols-3 lg:gap-8">
        {/* Main content — 2/3 width on desktop */}
        <div className="space-y-6 lg:col-span-2">
          {/* Daftar Produk */}
          <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm sm:p-5 lg:p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShoppingBasket className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                Daftar Produk ({umkm.produkList.length})
              </h2>
            </div>
            {umkm.produkList.length === 0 ? (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-8">
                <p className="text-sm text-muted-foreground">Belum ada produk</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {umkm.produkList.map((produk: any) => (
                  <div
                    key={produk.id}
                    className="flex gap-3 rounded-lg border border-border/40 bg-background/50 p-3 sm:p-4"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-20 sm:w-20">
                      {produk.fotoProduk ? (
                        <Image
                          src={produk.fotoProduk}
                          alt={produk.namaProduk}
                          width={80}
                          height={80}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <ShoppingBasket className="h-6 w-6 text-primary/40" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{produk.namaProduk}</p>
                      <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                        {produk.kategori.namaKategori}
                      </span>
                      <p className="text-sm font-bold text-primary">
                        {formatHarga(produk.harga)}
                      </p>
                      {produk.deskripsi && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {produk.deskripsi}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <GalleryViewer galeriList={umkm.galeriList} />
        </div>

        {/* Sidebar — 1/3 on desktop, full on mobile */}
        <div className="space-y-6">
          {/* Info UMKM */}
          <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm sm:p-5">
            <h3 className="mb-3 font-heading text-base font-bold text-foreground">
              Informasi Usaha
            </h3>
            <dl className="space-y-2.5 text-sm">
              {[
                ["Pemilik", umkm.namaPemilik],
                ["Tahun Berdiri", umkm.tahunBerdiri || "—"],
                ["Alamat", umkm.alamat],
                ["Telepon", umkm.noTelepon],
                ["Status", umkm.statusTampil ? "Aktif" : "Nonaktif"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Peta Lokasi */}
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
            <div className="border-b border-border/40 bg-muted/30 px-4 py-3 sm:px-5">
              <h3 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Titik Lokasi
              </h3>
            </div>
            
            <div className="relative aspect-[4/3] w-full sm:aspect-square md:aspect-[4/3]">
              <iframe
                src={iframeUrl}
                className="h-full w-full border-0 contrast-125 grayscale-[0.1] filter"
                loading="lazy"
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]" />
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detail Alamat</p>
                  <p className="text-sm font-medium text-foreground">{umkm.alamat}</p>
                </div>
                
                <a
                  href={umkm.linkGmaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(umkm.namaUsaha + " " + umkm.alamat)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  <MapPin className="h-4 w-4" />
                  Buka & Arahkan di Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
