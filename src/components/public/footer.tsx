import Link from "next/link";
import { Leaf, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-primary/20 bg-primary text-primary-foreground dark:border-border/60 dark:bg-card dark:text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* ---- Brand ---- */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20 text-primary-foreground dark:bg-primary/10 dark:text-primary">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="font-heading text-lg font-bold tracking-tight">
                Tape Bakung
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/80 dark:text-muted-foreground">
              Katalog digital produk tape dari UMKM Desa Bakung Kidul, Kecamatan
              Jamblang, Kabupaten Cirebon.
            </p>
          </div>

          {/* ---- Navigasi ---- */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground dark:text-foreground/80">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm text-primary-foreground/80 dark:text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="inline-block transition-colors hover:text-primary-foreground dark:hover:text-foreground"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/#kategori"
                  className="inline-block transition-colors hover:text-primary-foreground dark:hover:text-foreground"
                >
                  Kategori
                </Link>
              </li>
              <li>
                <Link
                  href="/#produk-terbaru"
                  className="inline-block transition-colors hover:text-primary-foreground dark:hover:text-foreground"
                >
                  Terbaru
                </Link>
              </li>
              <li>
                <Link
                  href="/umkm"
                  className="inline-block transition-colors hover:text-primary-foreground dark:hover:text-foreground"
                >
                  Katalog UMKM
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimoni"
                  className="inline-block transition-colors hover:text-primary-foreground dark:hover:text-foreground"
                >
                  Testimoni
                </Link>
              </li>
              <li>
                <Link
                  href="/#tentang"
                  className="inline-block transition-colors hover:text-primary-foreground dark:hover:text-foreground"
                >
                  Tentang
                </Link>
              </li>
            </ul>
          </div>

          {/* ---- Kontak Desa ---- */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground dark:text-foreground/80">
              Kontak Desa
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80 dark:text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/60 dark:text-muted-foreground/60" />
                <span>
                  Desa Bakung Kidul, Kec. Jamblang,
                  <br className="hidden sm:inline" />
                  {" "}Kab. Cirebon, Jawa Barat
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary-foreground/60 dark:text-muted-foreground/60" />
                <span>Hubungi Kantor Desa</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mt-8 border-t border-primary-foreground/20 pt-6 dark:border-border/40 sm:mt-10 sm:pt-8">
          <p className="text-center text-xs leading-relaxed text-primary-foreground/70 dark:text-muted-foreground sm:text-sm">
            © {currentYear} E-Katalog UMKM Tape Bakung Kidul
            <span className="hidden sm:inline"> — </span>
            <br className="sm:hidden" />
            <span className="mt-1 block sm:mt-0 sm:inline">
              KKM UMC Kelompok 32
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
