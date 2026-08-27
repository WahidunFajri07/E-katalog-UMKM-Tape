import { Leaf, ArrowRight, Store, ShoppingBasket, MapPin } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroCarousel, HeroCarouselSkeleton } from "@/components/public/hero-carousel";

import { CategoryGrid } from "@/components/public/category-grid";
import { LatestProducts } from "@/components/public/latest-products";
import { PromoBanner } from "@/components/public/promo-banner";
import { TrustStats } from "@/components/public/trust-stats";
import { TestimonialSection } from "@/components/public/testimonial-section";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function BerandaPage() {
  const [totalUmkm, totalProduk, featuredProducts, categories, latestProducts] = await Promise.all([
    prisma.umkm.count({ where: { statusTampil: true } }),
    prisma.produk.count(),
    prisma.produk.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        umkm: { select: { slug: true } }
      }
    }).then(res => res.map(p => ({ ...p, harga: Number(p.harga) }))),
    prisma.kategori.findMany({
      include: {
        _count: {
          select: { produkList: true }
        }
      }
    }),
    prisma.produk.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        umkm: { select: { slug: true } },
        kategori: { select: { namaKategori: true } }
      }
    }).then(res => res.map(p => ({ ...p, harga: Number(p.harga) })))
  ]);

  return (
    <>
      {/* ============ HERO BANNER ============ */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Next/Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpeg"
            alt="Tape Bakung Kidul"
            className="h-full w-full object-cover"
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:px-4 sm:text-sm">
            <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Desa Bakung Kidul, Jamblang, Cirebon</span>
          </div>
          <h1 className="mx-auto max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Katalog Digital <br className="hidden sm:block" />
            <span className="text-primary">UMKM Tape Khas Cirebon</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg md:text-xl">
            Nikmati keaslian cita rasa tape ketan yang diproduksi secara higienis dan turun-temurun oleh warga lokal desa kami.
          </p>
        </div>
      </section>

      {/* ============ FEATURED CAROUSEL SECTION ============ */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-2 sm:p-4">
          <Suspense fallback={<HeroCarouselSkeleton />}>
            <HeroCarousel products={featuredProducts} />
          </Suspense>
        </div>
      </section>

      {/* ============ CATEGORY GRID SECTION ============ */}
      <CategoryGrid categories={categories} />

      {/* ============ PROMO BANNER SECTION ============ */}
      <PromoBanner />

      {/* ============ LATEST PRODUCTS SECTION ============ */}
      <LatestProducts products={latestProducts} />

      {/* ============ STATS / HIGHLIGHTS ============ */}
      <TrustStats totalUmkm={totalUmkm} totalProduk={totalProduk} />

      {/* ============ TESTIMONIALS ============ */}
      <TestimonialSection />

      {/* ============ ABOUT SECTION ============ */}
      <section id="tentang" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            Tentang Katalog Ini
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            E-Katalog ini mengumpulkan seluruh pelaku UMKM Tape di Desa Bakung
            Kidul dalam satu platform digital. Dikelola secara terpusat oleh
            admin desa agar data selalu akurat dan mudah ditemukan oleh calon
            pembeli dari mana saja.
          </p>
        </div>
      </section>
    </>
  );
}
