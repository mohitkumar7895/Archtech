"use client";

import React from "react";
import { Maximize2, Image as ImageIcon } from "lucide-react";
import { useModal } from "@/hooks/useModal";

interface ServiceGalleryProps {
  images: string[];
  serviceName: string;
}

export function ServiceGallery({ images, serviceName }: ServiceGalleryProps) {
  const { openImagePreview } = useModal();

  if (!images || images.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D6B36A]/20 text-[#071A35] flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-[#B89246]" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
              Visual Reference Gallery
            </h3>
            <p className="text-xs text-slate-500">
              {images.length} verified project & design renders
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Click to Zoom
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 pt-2">
        {images.map((imgUrl, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() =>
              openImagePreview({
                url: imgUrl,
                title: `${serviceName} – Visual Reference #${idx + 1}`,
                alt: `${serviceName} architectural render ${idx + 1}`,
              })
            }
            className="group relative h-36 sm:h-56 w-full rounded-xl overflow-hidden border border-slate-200 bg-[#071A35] text-left focus:outline-none focus:ring-2 focus:ring-[#D6B36A] cursor-pointer touch-manipulation active:scale-[0.97] transition-transform duration-100"
          >
            <img
              src={imgUrl}
              alt={`${serviceName} reference photo ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071A35]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5 justify-between">
              <span className="text-xs font-medium text-white truncate pr-2">
                Photo #{idx + 1}
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#D6B36A] text-[#071A35] flex items-center justify-center shrink-0 shadow">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white group-hover:hidden">
              #{idx + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
