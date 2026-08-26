import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "./product-card";

interface LatestProductsProps {
  products: any[];
}

export function LatestProducts({ products }: LatestProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section id="produk-terbaru" className="bg-muted/30 py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between sm:mb-12">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Terbaru</span>
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Rekomendasi Produk
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Jelajahi berbagai varian produk tape terbaru yang diproduksi langsung oleh para pengrajin di Bakung Kidul.
            </p>
          </div>
          <Link
            href="/umkm"
            className="hidden items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
          >
            Lihat semua katalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} produk={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/umkm"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
          >
            Lihat semua katalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
