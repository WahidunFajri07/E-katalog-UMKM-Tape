import Image from "next/image";
import Link from "next/link";
import { formatHarga } from "@/lib/utils";

interface ProductCardProps {
  produk: {
    id: number;
    namaProduk: string;
    harga: any; // Prisma Decimal
    fotoProduk: string | null;
    deskripsi: string | null;
    kategori?: {
      namaKategori: string;
    } | null;
    umkm?: {
      slug: string;
    } | null;
  };
}

export function ProductCard({ produk }: ProductCardProps) {
  return (
    <Link
      href={`/umkm/${produk.umkm?.slug || ""}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-md"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/50">
        {produk.fotoProduk ? (
          <Image
            src={produk.fotoProduk}
            alt={produk.namaProduk}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary/30 text-muted-foreground">
            <span className="text-xs">Tidak ada foto</span>
          </div>
        )}

        {/* Category Badge */}
        {produk.kategori && (
          <div className="absolute left-2.5 top-2.5 rounded-md bg-background/85 px-2 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm sm:left-3 sm:top-3 sm:text-xs">
            {produk.kategori.namaKategori}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-1 font-heading text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {produk.namaProduk}
        </h3>
        
        {produk.deskripsi && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {produk.deskripsi}
          </p>
        )}
        
        <div className="mt-auto pt-4">
          <p className="text-sm font-bold text-primary sm:text-base">
            {formatHarga(produk.harga)}
          </p>
        </div>
      </div>
    </Link>
  );
}
