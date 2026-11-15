"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall, MessageCircle, Sparkles } from "lucide-react";
import { Project, SiteSettings } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { useModal } from "@/hooks/useModal";
import { formatWhatsAppUrl } from "@/lib/utils";

const PROJECT_CATEGORIES = [
  "All",
  "Residential Homes",
  "Luxury Interiors",
  "Construction in Progress",
  "Villas & Farmhouses",
];

export function FeaturedProjectsSection({
  projects,
  title,
  subtitle,
  badgeText,
}: {
  projects: Project[];
  title: string;
  subtitle: string;
  badgeText?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered =
    selectedCategory === "All"
      ? projects.slice(0, 6)
      : projects.filter((p) => p.category === selectedCategory).slice(0, 6);

  return (
    <section className="py-20 bg-[#F6F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
              {badgeText || "FEATURED PORTFOLIO"}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35]">{title}</h2>
            <p className="text-sm sm:text-base text-[#172033]/75">{subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? "bg-[#071A35] text-[#F2D99B] shadow-md"
                    : "bg-white text-[#172033] border border-slate-200 hover:border-[#D6B36A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-sm hover:bg-[#10284A] transition shadow-lg"
          >
            <span>Explore Complete Project Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FinalCTABanner({
  settings,
  title,
  subtitle,
  badgeText,
}: {
  settings: SiteSettings;
  title?: string;
  subtitle?: string;
  badgeText?: string;
}) {
  const { openConsultationModal } = useModal();
  const waUrl = formatWhatsAppUrl(
    settings.whatsapp,
    `Hello ${settings.contactPerson} (${settings.companyName}), I want to schedule a free consultation.`
  );

  return (
    <section className="py-20 bg-gradient-to-br from-[#071A35] via-[#10284A] to-[#071A35] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-[#071A35]/80 border-2 border-[#D6B36A]/50 p-8 sm:p-12 lg:p-16 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
              {badgeText || settings.brandStatement}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {title || "Ready to Build or Transform Your Dream Space?"}
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              {subtitle ||
                `Consult directly with ${settings.contactPerson} at ${settings.companyName} (${settings.brandIdentity}) for architectural drawings, turnkey construction, or bespoke interiors.`}
            </p>
            <p className="text-xs text-[#F2D99B] font-semibold">
              Office: {settings.address} • Direct Phone / WhatsApp: +91 {settings.phone}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={() => openConsultationModal()}
              className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] font-bold text-sm tracking-wide shadow-gold hover:brightness-105 transition text-center"
            >
              Book Free Consultation with {settings.contactPerson}
            </button>

            <div className="flex items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:brightness-105 transition"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href={`tel:+91${settings.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-[#D6B36A]/50 text-[#F2D99B] font-bold text-sm hover:bg-white/10 transition"
              >
                <PhoneCall className="w-4 h-4 text-[#D6B36A]" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
