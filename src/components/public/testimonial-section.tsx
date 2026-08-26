"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Dummy data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Pelanggan Setia",
    content: "Tape ketan dari Bakung Kidul memang juara! Manisnya pas, airnya melimpah, dan kemasannya sangat rapi. Cocok sekali untuk oleh-oleh keluarga di luar kota.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=budi",
  },
  {
    id: 2,
    name: "Siti Aminah",
    role: "Reseller",
    content: "Saya sudah berlangganan mengambil tape dari UMKM di sini untuk dijual lagi. Kualitasnya selalu konsisten dan tidak pernah mengecewakan pelanggan saya.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=siti",
  },
  {
    id: 3,
    name: "Ahmad Wijaya",
    role: "Wisatawan",
    content: "Pertama kali mencoba tape ketan Bakung Kidul saat mampir ke Cirebon. Rasanya autentik dan harganya sangat terjangkau. Pasti akan beli lagi kalau ke sini.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=ahmad",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    role: "Ibu Rumah Tangga",
    content: "Keluarga sangat suka dengan tape ketan dari sini. Pengirimannya cepat jika pesan online dan kondisinya selalu segar sampai di rumah.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=dewi",
  },
];

export function TestimonialSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 6000, stopOnInteraction: true }),
  ]);
  
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section id="testimoni" className="bg-muted/10 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Apa Kata Pelanggan?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Testimoni jujur dari mereka yang telah mencicipi kelezatan tape ketan autentik Bakung Kidul.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="overflow-hidden px-2 pb-8 pt-4" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <div className="relative flex h-full flex-col rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-md">
                    <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10" />
                    
                    <div className="flex gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < testimonial.rating ? "fill-current" : "fill-transparent text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                      &quot;{testimonial.content}&quot;
                    </p>
                    
                    <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-center gap-4">
            <button
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:bg-muted focus:outline-none",
                !canScrollPrev && "opacity-50 cursor-not-allowed"
              )}
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:bg-muted focus:outline-none",
                !canScrollNext && "opacity-50 cursor-not-allowed"
              )}
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
