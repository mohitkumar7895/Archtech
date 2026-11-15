"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface SimpleFAQ {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

export function FAQAccordion({ faqs }: { faqs: SimpleFAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `faq-panel-${idx}`;
        const btnId = `faq-btn-${idx}`;
        return (
          <div
            key={faq.id || idx}
            className={`rounded-2xl border transition-colors ${
              isOpen
                ? "bg-white border-[#D6B36A] shadow-md"
                : "bg-white/90 border-slate-200 hover:border-[#D6B36A]/60"
            }`}
          >
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer touch-manipulation active:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-3 font-serif text-base sm:text-lg font-bold text-[#071A35]">
                  <HelpCircle className="w-5 h-5 text-[#D6B36A] shrink-0" aria-hidden="true" />
                  <span>{faq.question}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#071A35] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#D6B36A]" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="px-6 pb-5 pt-1 text-sm text-[#172033]/85 leading-relaxed border-t border-slate-100"
            >
              {faq.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
