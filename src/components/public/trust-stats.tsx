"use client";

import React, { useEffect, useState, useRef } from "react";
import { Store, ShoppingBasket, MapPin } from "lucide-react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function Counter({ end, duration = 2000, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      {count}
      {suffix}
    </div>
  );
}

interface TrustStatsProps {
  totalUmkm: number;
  totalProduk: number;
}

export function TrustStats({ totalUmkm, totalProduk }: TrustStatsProps) {
  return (
    <section className="border-y border-border/60 bg-card/80">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {/* Stat 1 */}
          <div className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/50 bg-background/50 p-6 text-center transition-colors hover:bg-primary/5 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
              <Store className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <Counter end={totalUmkm} suffix="+" />
              <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
                UMKM Tape Terdaftar
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/50 bg-background/50 p-6 text-center transition-colors hover:bg-primary/5 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
              <ShoppingBasket className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <Counter end={totalProduk} suffix="+" />
              <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
                Varian Produk Tape
              </p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/50 bg-background/50 p-6 text-center transition-colors hover:bg-primary/5 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
              <MapPin className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <Counter end={1} />
              <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
                Desa Bakung Kidul
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
