"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Ruler, UserCheck } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";

export function ProjectGalleryModal() {
  const { galleryProject, closeProjectGallery, openConsultationModal } = useModal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const pressedOutsideRef = useRef(false);

  useEffect(() => {
    setActiveIndex(0);
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (galleryProject && !dialog.open) {
      dialog.showModal();
    } else if (!galleryProject && dialog.open) {
      dialog.close();
    }
  }, [galleryProject]);

  const images =
    galleryProject && galleryProject.galleryImages?.length > 0
      ? galleryProject.galleryImages
      : galleryProject
      ? [galleryProject.coverImage]
      : [];

  const isOutside = (e: React.PointerEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return false;
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: "any" } as any)}
      onClose={closeProjectGallery}
      onPointerDown={(e) => {
        pressedOutsideRef.current = isOutside(e);
      }}
      onPointerUp={(e) => {
        if (pressedOutsideRef.current && isOutside(e)) {
          dialogRef.current?.close();
        }
      }}
      className="w-[calc(100%-1.5rem)] sm:w-full max-w-4xl m-auto rounded-2xl bg-[#071A35] text-white p-0 shadow-2xl border border-[#D6B36A]/40 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      {galleryProject && (
        <div>
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D6B36A]">
                {galleryProject.category}
              </span>
              <h2 id={titleId} className="font-serif text-xl font-bold text-white">
                {galleryProject.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeProjectGallery}
              aria-label="Close project lightbox"
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative bg-black/50 aspect-[16/10] max-h-[60dvh] w-full flex items-center justify-center overflow-hidden">
            <img
              src={images[activeIndex]}
              alt={`${galleryProject.title} - Image ${activeIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
                  aria-label="Previous project image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#071A35]/85 border border-[#D6B36A]/50 text-[#F2D99B] flex items-center justify-center hover:bg-[#071A35]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                  aria-label="Next project image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#071A35]/85 border border-[#D6B36A]/50 text-[#F2D99B] flex items-center justify-center hover:bg-[#071A35]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <div className="p-6 bg-[#071A35] space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#D6B36A]" />
                {galleryProject.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[#D6B36A]" />
                {galleryProject.areaSqFt}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#D6B36A]" />
                {galleryProject.completionDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#D6B36A]" />
                Lead: {galleryProject.architectLead}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{galleryProject.shortDescription}</p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <Link
                href={`/projects/${galleryProject.slug}`}
                onClick={closeProjectGallery}
                className="text-xs font-bold uppercase tracking-wider text-[#F2D99B] hover:underline"
              >
                View Full Case Study & Specifications →
              </Link>
              <button
                type="button"
                onClick={() => {
                  const title = galleryProject.title;
                  closeProjectGallery();
                  openConsultationModal(`Similar to: ${title}`);
                }}
                className="px-4 py-2 rounded-lg bg-[#D6B36A] text-[#071A35] font-bold text-xs hover:bg-[#F2D99B] transition"
              >
                Build Similar Project
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
