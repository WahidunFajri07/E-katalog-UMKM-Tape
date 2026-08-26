"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, X } from "lucide-react";

interface Galeri {
  id: number;
  urlFoto: string;
  keterangan: string | null;
}

interface GalleryViewerProps {
  galeriList: Galeri[];
}

export function GalleryViewer({ galeriList }: GalleryViewerProps) {
  const [selectedImage, setSelectedImage] = useState<Galeri | null>(null);

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-4 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
          Galeri Foto ({galeriList.length})
        </h2>
      </div>
      
      {galeriList.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-8">
          <p className="text-sm text-muted-foreground">Belum ada foto</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {galeriList.map((foto) => (
            <div
              key={foto.id}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted transition-all hover:opacity-90 hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background"
              onClick={() => setSelectedImage(foto)}
            >
              <Image
                src={foto.urlFoto}
                alt={foto.keterangan || "Foto galeri"}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              {foto.keterangan && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-2">
                  <p className="truncate text-xs font-medium text-background">{foto.keterangan}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative flex max-h-full max-w-4xl flex-col items-center justify-center rounded-lg"
            onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing
          >
            <button 
              className="absolute -top-10 right-0 rounded-full bg-background/20 p-2 text-background transition-colors hover:bg-background/40 md:-right-10 md:top-0"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative aspect-video w-[90vw] max-w-4xl overflow-hidden rounded-lg bg-black/50 md:aspect-auto md:h-[80vh]">
              <Image
                src={selectedImage.urlFoto}
                alt={selectedImage.keterangan || "Foto galeri"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            
            {selectedImage.keterangan && (
              <div className="mt-4 w-full rounded-lg bg-background/10 p-3 text-center text-background backdrop-blur-md">
                <p className="text-sm md:text-base">{selectedImage.keterangan}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
