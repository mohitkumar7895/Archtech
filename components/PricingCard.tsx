"use client";

import React from "react";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { PricingPackage } from "@/types";
import { useModal } from "@/hooks/useModal";

export function PricingCard({ pkg }: { pkg: PricingPackage }) {
  const { openEnquiryModal } = useModal();

  return (
    <div
      className={`rounded-2xl flex flex-col justify-between transition-all duration-300 overflow-hidden ${
        pkg.isPopular
          ? "bg-[#071A35] text-white border-2 border-[#D6B36A] shadow-2xl relative"
          : "bg-white text-[#172033] border border-slate-200 shadow-luxury"
      }`}
    >
      {pkg.isPopular && (
        <div className="bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] text-[11px] font-extrabold uppercase tracking-widest py-1.5 px-4 text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Most Popular Recommended Package
        </div>
      )}

      <div className="p-7 space-y-5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span
              className={`inline-block text-[11px] font-bold uppercase tracking-widest mb-1 ${
                pkg.isPopular ? "text-[#D6B36A]" : "text-[#B89246]"
              }`}
            >
              {pkg.packageType} Package
            </span>
            <h3
              className={`font-serif text-2xl font-bold ${
                pkg.isPopular ? "text-white" : "text-[#071A35]"
              }`}
            >
              {pkg.name}
            </h3>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            pkg.isPopular
              ? "bg-[#10284A] border-[#D6B36A]/40"
              : "bg-[#F6F7FA] border-slate-200/80"
          }`}
        >
          <span
            className={`text-[11px] uppercase tracking-wider font-semibold block ${
              pkg.isPopular ? "text-slate-300" : "text-slate-500"
            }`}
          >
            Indicative Starting Rate
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`font-serif text-3xl sm:text-4xl font-extrabold ${
                pkg.isPopular ? "text-[#F2D99B]" : "text-[#071A35]"
              }`}
            >
              {pkg.startingPrice}
            </span>
            <span
              className={`text-sm font-medium ${
                pkg.isPopular ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {pkg.priceUnit}
            </span>
          </div>
        </div>

        <p
          className={`text-sm leading-relaxed ${
            pkg.isPopular ? "text-slate-300" : "text-[#172033]/80"
          }`}
        >
          {pkg.description}
        </p>

        <div className="space-y-2.5 pt-2">
          <p
            className={`text-xs font-bold uppercase tracking-wider ${
              pkg.isPopular ? "text-[#D6B36A]" : "text-[#071A35]"
            }`}
          >
            Included Highlights & Specifications:
          </p>
          <ul className="space-y-2.5">
            {pkg.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    pkg.isPopular ? "text-[#D6B36A]" : "text-[#071A35]"
                  }`}
                />
                <span className={pkg.isPopular ? "text-slate-200" : "text-[#172033]"}>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-7 pt-0">
        <button
          type="button"
          onClick={() => openEnquiryModal(`${pkg.name} (${pkg.startingPrice}${pkg.priceUnit})`)}
          className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all duration-100 cursor-pointer touch-manipulation active:scale-[0.98] ${
            pkg.isPopular
              ? "bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] hover:brightness-105 shadow-gold"
              : "bg-[#071A35] text-[#F2D99B] hover:bg-[#10284A]"
          }`}
        >
          <span>Get Custom BOQ for {pkg.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p
          className={`text-[11px] text-center mt-2.5 ${
            pkg.isPopular ? "text-slate-400" : "text-slate-500"
          }`}
        >
          *Indicative starting rate. Final quote confirmed post site inspection.
        </p>
      </div>
    </div>
  );
}
