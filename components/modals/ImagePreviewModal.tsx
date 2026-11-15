"use client";

import React, { useEffect, useRef, useId } from "react";
import { X } from "lucide-react";
import { useModal } from "@/hooks/useModal";

export function ImagePreviewModal() {
  const { previewImage, closeImagePreview } = useModal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const pressedOutsideRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (previewImage && !dialog.open) {
      dialog.showModal();
    } else if (!previewImage && dialog.open) {
      dialog.close();
    }
  }, [previewImage]);

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
      onClose={closeImagePreview}
      onPointerDown={(e) => {
        pressedOutsideRef.current = isOutside(e);
      }}
      onPointerUp={(e) => {
        if (pressedOutsideRef.current && isOutside(e)) {
          dialogRef.current?.close();
        }
      }}
      className="w-[calc(100%-1.5rem)] sm:w-full max-w-4xl m-auto rounded-2xl bg-[#071A35] text-white p-0 shadow-2xl border border-[#D6B36A]/40 backdrop:bg-black/80"
    >
      {previewImage && (
        <div>
          <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
            <h2 id={titleId} className="font-serif text-lg font-semibold text-white">
              {previewImage.title || "Architectural Image Preview"}
            </h2>
            <button
              type="button"
              onClick={closeImagePreview}
              aria-label="Close image preview"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 flex items-center justify-center bg-black/40 max-h-[75dvh] overflow-hidden">
            <img
              src={previewImage.url}
              alt={previewImage.alt || previewImage.title || "Preview"}
              className="max-h-[70dvh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
