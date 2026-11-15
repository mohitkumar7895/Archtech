"use client";

import React, { useEffect, useRef, useId } from "react";
import { X, Compass, PhoneCall } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { useModal } from "@/hooks/useModal";

export function ConsultationModal({
  whatsappNumber = "7535942407",
  contactPerson = "Manoj Kumar Sharma",
}: {
  whatsappNumber?: string;
  contactPerson?: string;
}) {
  const { isConsultationOpen, preselectedService, closeConsultationModal } = useModal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const pressedOutsideRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isConsultationOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isConsultationOpen && dialog.open) {
      dialog.close();
    }
  }, [isConsultationOpen]);

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
      onClose={closeConsultationModal}
      onPointerDown={(e) => {
        pressedOutsideRef.current = isOutside(e);
      }}
      onPointerUp={(e) => {
        if (pressedOutsideRef.current && isOutside(e)) {
          dialogRef.current?.close();
        }
      }}
      className="w-[calc(100%-1.5rem)] sm:w-full max-w-2xl m-auto rounded-2xl bg-white p-0 text-[#172033] shadow-2xl border border-[#D6B36A]/40 backdrop:bg-[#071A35]/75 backdrop:backdrop-blur-sm"
    >
      <div className="bg-gradient-to-r from-[#071A35] to-[#10284A] px-6 py-5 text-white flex items-center justify-between border-b border-[#D6B36A]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D6B36A]/20 border border-[#D6B36A]/40 flex items-center justify-center text-[#F2D99B]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D6B36A] block">
              ARCH NEW ERA DESIGN • NRBL TECH
            </span>
            <h2 id={titleId} className="font-serif text-xl font-bold text-white">
              Schedule Your Free Consultation
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={closeConsultationModal}
          aria-label="Close consultation dialog"
          className="w-9 h-9 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 max-h-[80dvh] overflow-y-auto">
        <div className="mb-5 rounded-xl bg-[#F6F7FA] border border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[#172033]/80">
            Direct Project Consultation with <strong className="text-[#071A35]">{contactPerson}</strong> (Shahdara, Delhi & NCR)
          </span>
          <a
            href={`tel:+91${whatsappNumber}`}
            className="inline-flex items-center gap-1.5 font-bold text-[#071A35] hover:text-[#B89246]"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D6B36A]" />
            +91 {whatsappNumber}
          </a>
        </div>

        <ContactForm
          defaultService={preselectedService || "Architecture & Planning"}
          sourcePage="ConsultationModal"
          compact
          whatsappNumber={whatsappNumber}
          contactPerson={contactPerson}
          onSuccess={closeConsultationModal}
        />
      </div>
    </dialog>
  );
}
