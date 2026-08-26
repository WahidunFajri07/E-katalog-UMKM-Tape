import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";

interface Category {
  id: number;
  namaKategori: string;
  _count?: {
    produkList: number;
  };
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories || categories.length === 0) {
    return null; // Don't show the section if no categories
  }

  return (
    <section id="kategori" className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between sm:mb-10">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Kategori Unggulan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Temukan produk berdasarkan kategori favorit.
            </p>
          </div>
          <Link
            href="/umkm"
            className="hidden items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
          >
            Lihat semua
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/umkm?kategori=${encodeURIComponent(category.namaKategori)}`}
              className="group flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-4 text-center shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md sm:p-6"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
                <Package className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">
                {category.namaKategori}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {category._count?.produkList || 0} Produk
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/umkm"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Lihat semua kategori
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
