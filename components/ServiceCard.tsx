"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Eye, Images } from "lucide-react";
import { Service } from "@/types";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { useModal } from "@/hooks/useModal";

export function ServiceCard({ service }: { service: Service }) {
  const { openServiceDetailsModal, openConsultationModal } = useModal();

  return (
    <article className="group rounded-2xl bg-white border border-slate-200/90 hover:border-[#D6B36A] shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col overflow-hidden">
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#071A35]">
        <img
          src={service.featuredImage}
          alt={service.name}
          loading="lazy"
          width={600}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A35]/90 via-[#071A35]/20 to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#071A35]/85 backdrop-blur-sm border border-[#D6B36A]/40 text-[11px] font-bold text-[#F2D99B]">
            {service.category}
          </span>
        </div>

        {service.gallery && service.gallery.length > 0 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#071A35]/85 backdrop-blur-sm border border-white/20 text-[10px] font-bold text-white shadow-sm">
              <Images className="w-3 h-3 text-[#D6B36A]" />
              {service.gallery.length} Photos
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#D6B36A] text-[#071A35] flex items-center justify-center shadow-md">
            <IconRenderer name={service.iconName} className="w-5 h-5" />
          </div>
          {service.startingPrice && (
            <span className="px-3 py-1 rounded-lg bg-[#10284A]/95 border border-[#D6B36A]/50 text-xs font-bold text-[#F2D99B]">
              Starting {service.startingPrice}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <Link href={`/services/${service.slug}`} className="block">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#071A35] group-hover:text-[#B89246] transition-colors">
              {service.name}
            </h3>
          </Link>
          <p className="text-sm text-[#172033]/80 line-clamp-3 leading-relaxed">
            {service.shortDescription}
          </p>

          {service.features?.length > 0 && (
            <ul className="pt-2 space-y-1.5 border-t border-slate-100">
              {service.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#172033]/85">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B36A] shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#071A35] hover:text-[#B89246] transition"
          >
            <span>Explore Details</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => openServiceDetailsModal(service)}
              aria-label={`Quick view ${service.name}`}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:border-[#D6B36A] hover:text-[#071A35] transition-all duration-100 cursor-pointer touch-manipulation active:scale-90"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openConsultationModal(service.name)}
              className="px-3.5 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A] transition-all duration-100 cursor-pointer touch-manipulation active:scale-95"
            >
              Enquire
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
