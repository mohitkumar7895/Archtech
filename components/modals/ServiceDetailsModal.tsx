"use client";

import React, { useEffect, useRef, useId } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";

export function ServiceDetailsModal() {
  const {
    activeServiceModal,
    closeServiceDetailsModal,
    openConsultationModal,
    openImagePreview,
  } = useModal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const pressedOutsideRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeServiceModal && !dialog.open) {
      dialog.showModal();
    } else if (!activeServiceModal && dialog.open) {
      dialog.close();
    }
  }, [activeServiceModal]);

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
      onClose={closeServiceDetailsModal}
      onPointerDown={(e) => {
        pressedOutsideRef.current = isOutside(e);
      }}
      onPointerUp={(e) => {
        if (pressedOutsideRef.current && isOutside(e)) {
          dialogRef.current?.close();
        }
      }}
      className="w-[calc(100%-1.5rem)] sm:w-full max-w-2xl m-auto rounded-2xl bg-white p-0 text-[#172033] shadow-2xl border border-[#D6B36A]/40 backdrop:bg-[#071A35]/75"
    >
      {activeServiceModal && (
        <div>
          <div className="relative h-56 w-full overflow-hidden bg-[#071A35]">
            <img
              src={activeServiceModal.featuredImage}
              alt={activeServiceModal.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071A35] via-[#071A35]/40 to-transparent" />
            <button
              type="button"
              onClick={closeServiceDetailsModal}
              aria-label="Close service details"
              className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-[#071A35]/80 text-white hover:bg-[#071A35] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-[#D6B36A] text-[#071A35] text-xs font-bold mb-2">
                Indicative Starting: {activeServiceModal.startingPrice}
              </span>
              <h2 id={titleId} className="font-serif text-2xl font-bold">
                {activeServiceModal.name}
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[65dvh] overflow-y-auto">
            <p className="text-sm text-[#172033]/85 leading-relaxed whitespace-pre-line">
              {activeServiceModal.fullDescription}
            </p>

            {activeServiceModal.features?.length > 0 && (
              <div className="bg-[#F6F7FA] p-4 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A35] mb-3">
                  Key Deliverables & Specifications
                </h3>
                <ul className="space-y-2">
                  {activeServiceModal.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#172033]">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeServiceModal.gallery && activeServiceModal.gallery.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A35]">
                  Service Gallery ({activeServiceModal.gallery.length} Photos - Click to Zoom)
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {activeServiceModal.gallery.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        openImagePreview({
                          url: imgUrl,
                          title: `${activeServiceModal.name} – Photo #${i + 1}`,
                        });
                      }}
                      className="group relative h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-[#D6B36A] focus:outline-none"
                    >
                      <img
                        src={imgUrl}
                        alt={`${activeServiceModal.name} thumbnail ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">
                        #{i + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <Link
                href={`/services/${activeServiceModal.slug}`}
                onClick={closeServiceDetailsModal}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#071A35] hover:text-[#B89246]"
              >
                Open Full Service Page <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  const name = activeServiceModal.name;
                  closeServiceDetailsModal();
                  openConsultationModal(name);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-semibold text-sm hover:bg-[#10284A] transition"
              >
                Book Consultation for {activeServiceModal.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
