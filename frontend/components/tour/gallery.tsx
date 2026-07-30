"use client";

import Image from "next/image";
import { useState } from "react";
import { Images, Play, X } from "lucide-react";

export default function TourGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const visible = images.slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[var(--radius-lg)]" style={{ height: 440 }}>
        <button
          onClick={() => setLightboxIndex(0)}
          className="relative col-span-2 row-span-2 overflow-hidden"
        >
          <Image src={visible[0]} alt={title} fill sizes="50vw" className="object-cover transition-transform duration-500 hover:scale-105" />
        </button>
        {visible.slice(1).map((src, i) => (
          <button key={i} onClick={() => setLightboxIndex(i + 1)} className="relative overflow-hidden">
            <Image src={src} alt={`${title} photo ${i + 2}`} fill sizes="25vw" className="object-cover transition-transform duration-500 hover:scale-105" />
            {i === visible.length - 2 && images.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-sm font-medium text-white">
                <Images size={14} className="mr-1.5" /> +{images.length - 5} more
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => setLightboxIndex(0)}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-ink"
        >
          <Images size={13} /> View all photos
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-ink">
          <Play size={13} /> Watch video
        </button>
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-ink/95 p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="ml-auto grid h-10 w-10 place-items-center rounded-full text-white/80 hover:text-gold"
            aria-label="Close gallery"
          >
            <X size={22} />
          </button>
          <div className="relative flex-1">
            <Image
              src={images[lightboxIndex]}
              alt={`${title} photo ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <div className="mx-auto mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ${i === lightboxIndex ? "ring-2 ring-gold" : "opacity-60"}`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
