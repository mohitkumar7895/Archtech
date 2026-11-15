"use client";

import React from "react";
import { MessageCircle, PhoneCall } from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";

export function WhatsAppButton({
  whatsappNumber = "7535942407",
  contactPerson = "Nidhi Sharma",
}: {
  whatsappNumber?: string;
  contactPerson?: string;
}) {
  const url = formatWhatsAppUrl(
    whatsappNumber,
    `Hello ${contactPerson} (ARCH NEW ERA DESIGN - NRBL TECH), I need architectural / construction / interior consultation.`
  );

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-30 flex flex-col items-end gap-2.5">
      <a
        href={`tel:+91${whatsappNumber}`}
        aria-label={`Call ${contactPerson} at +91 ${whatsappNumber}`}
        className="inline-flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full bg-[#071A35] text-[#F2D99B] border border-[#D6B36A]/50 shadow-xl hover:bg-[#10284A] transition text-xs font-bold"
      >
        <PhoneCall className="w-4 h-4 text-[#D6B36A]" />
        <span className="hidden sm:inline">Call {contactPerson}: +91 {whatsappNumber}</span>
      </a>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp with ${contactPerson}`}
        className="inline-flex items-center gap-2 p-3 sm:px-5 sm:py-3 rounded-full bg-[#25D366] text-white font-bold text-sm shadow-2xl hover:scale-[1.02] transition"
      >
        <MessageCircle className="w-5 h-5 fill-white/20" />
        <span className="hidden sm:inline">WhatsApp Us</span>
      </a>
    </div>
  );
}
