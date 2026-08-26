"use client";
// Force TS cache invalidation

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { formatHarga } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FeaturedProduct {
  id: number;
  namaProduk: string;
  harga: any;
  fotoProduk: string | null;
  deskripsi: string | null;
  umkm?: {
    slug: string;
  } | null;
}

interface HeroCarouselProps {
  products: FeaturedProduct[];
}

export function HeroCarousel({ products }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 sm:min-h-[400px]">
        <p className="text-sm text-muted-foreground">Belum ada produk unggulan.</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl bg-card shadow-sm border border-border/50">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative min-w-0 flex-[0_0_100%] sm:flex-[0_0_100%] md:flex-[0_0_100%]"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted md:aspect-auto md:w-1/2 lg:w-3/5">
                  {product.fotoProduk ? (
                    <Image
                      src={product.fotoProduk}
                      alt={product.namaProduk}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground">
                      <span>Tanpa Gambar</span>
                    </div>
                  )}
                  {/* Subtle gradient for text readability if needed on mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent md:hidden" />
                </div>

                {/* Content Section */}
                <div className="flex w-full flex-col justify-center px-6 py-6 sm:py-8 md:w-1/2 md:p-10 lg:w-2/5 lg:p-12 absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md md:relative md:bottom-auto md:bg-transparent md:backdrop-blur-none">
                  <div className="max-w-md">
                    <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                      {product.namaProduk}
                    </h2>
                    
                    {product.deskripsi && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-base md:mt-3 md:line-clamp-3">
                        {product.deskripsi}
                      </p>
                    )}
                    
                    <p className="mt-3 text-base font-semibold text-primary sm:text-xl lg:mt-6 lg:text-2xl">
                      {formatHarga(product.harga)}
                    </p>
                    
                    <div className="mt-4 lg:mt-8">
                      <Link
                        href={`/umkm/${product.umkm?.slug || ""}`}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:h-11 sm:px-8"
                      >
                        Lihat Detail
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="hidden md:block">
        <button
          className={cn(
            "absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-background focus:outline-none",
            !canScrollPrev && "opacity-50 cursor-not-allowed"
          )}
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          className={cn(
            "absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-background focus:outline-none",
            !canScrollNext && "opacity-50 cursor-not-allowed"
          )}
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 md:bottom-6">
        {products.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all focus:outline-none",
              index === selectedIndex 
                ? "bg-primary w-6" 
                : "bg-primary/30 hover:bg-primary/50"
            )}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function HeroCarouselSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl animate-pulse flex-col md:flex-row overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm h-[400px] md:h-[450px]">
      <div className="h-1/2 w-full bg-muted md:h-full md:w-1/2 lg:w-3/5" />
      <div className="flex flex-col justify-center p-6 md:w-1/2 md:p-10 lg:w-2/5">
        <div className="h-8 w-3/4 rounded-md bg-muted" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded-md bg-muted" />
          <div className="h-4 w-5/6 rounded-md bg-muted" />
        </div>
        <div className="mt-6 h-6 w-1/3 rounded-md bg-muted lg:mt-8" />
        <div className="mt-8 h-10 w-32 rounded-lg bg-muted lg:mt-10" />
      </div>
    </div>
  );
}
