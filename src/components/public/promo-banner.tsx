import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 shadow-lg sm:px-12 sm:py-16">
          {/* Decorative Background Elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-2xl text-center md:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                <BadgePercent className="h-4 w-4" />
                <span>Pusat Oleh-Oleh</span>
              </div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Cari Oleh-Oleh Khas Cirebon?
              </h2>
              <p className="mt-4 text-primary-foreground/90 sm:text-lg">
                Dukung UMKM lokal dengan membeli langsung produk tape ketan khas Bakung Kidul. Dijamin autentik, manis alami, dan diproduksi dengan cara tradisional yang higienis.
              </p>
              
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <Link
                  href="/umkm"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-primary shadow-sm transition-colors hover:bg-white/90"
                >
                  Jelajahi Katalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Optional Illustration / Graphic */}
            <div className="relative hidden aspect-square w-64 shrink-0 overflow-hidden rounded-full border-4 border-white/20 bg-white/10 md:block lg:w-80">
              <div className="absolute inset-0 flex items-center justify-center text-white/50">
                {/* You can replace this with an actual illustration of tape ketan if available */}
                <BadgePercent className="h-32 w-32 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
