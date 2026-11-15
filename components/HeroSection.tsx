"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  PhoneCall,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { SiteSettings } from "@/types";
import { useModal } from "@/hooks/useModal";

export function HeroSection({
  settings,
  badgeText,
}: {
  settings: SiteSettings;
  badgeText?: string;
}) {
  const { openConsultationModal } = useModal();

  return (
    <section className="relative overflow-hidden bg-[#071A35] text-white min-h-[84vh] flex items-center">
      {/* Large Architectural House Image with fetchpriority="high" (LCP Candidate per modern-web-guidance) */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImage}
          alt={`${settings.companyName} – ${settings.heroTitle}`}
          {...({ fetchpriority: "high" } as any)}
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A35] via-[#071A35]/88 to-[#071A35]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A35] via-transparent to-[#071A35]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Architectural Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10284A]/90 border border-[#D6B36A]/50 text-[#F2D99B] text-xs font-bold uppercase tracking-widest shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" aria-hidden="true" />
              <span>{badgeText || settings.brandStatement}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] sm:leading-[1.12] tracking-tight text-white break-words">
              {settings.heroTitle || "Your Dream Home, Our Expertise"}
            </h1>

            <p className="text-base sm:text-xl font-medium text-[#F2D99B] tracking-wide">
              {settings.heroSubtitle || "Thoughtful Design. Stronger Structure. Brighter Lives."}
            </p>

            <p className="text-xs sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              Welcome to <strong className="text-white">{settings.companyName} ({settings.brandIdentity})</strong>.
              Guided by <strong className="text-[#F2D99B]">{settings.contactPerson}</strong> in Shahdara, Delhi, we
              deliver bespoke 2D/3D architectural planning, seismic-safe residential & commercial construction, and
              luxury turnkey interiors.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <Link
                href={settings.heroCtaPrimaryLink || "/services"}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] font-bold text-sm tracking-wide shadow-gold hover:brightness-105 transition-all duration-100 cursor-pointer touch-manipulation active:scale-95 text-center"
              >
                <span>{settings.heroCtaPrimaryText || "Explore Our Services"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => openConsultationModal()}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-[#10284A]/90 border border-[#D6B36A]/60 text-white font-bold text-sm tracking-wide hover:bg-[#10284A] hover:border-[#F2D99B] transition-all duration-100 cursor-pointer touch-manipulation active:scale-95 text-center"
              >
                <span>{settings.heroCtaSecondaryText || "Get Free Consultation"}</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/15">
              <div className="bg-[#10284A]/70 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <p className="font-serif text-2xl font-bold text-[#F2D99B]">
                  {settings.experienceYears}+ Yrs
                </p>
                <p className="text-[11px] uppercase tracking-wider text-slate-300 mt-0.5">
                  Design & Civil Excellence
                </p>
              </div>
              <div className="bg-[#10284A]/70 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <p className="font-serif text-2xl font-bold text-[#F2D99B]">
                  {settings.projectsCompleted}+
                </p>
                <p className="text-[11px] uppercase tracking-wider text-slate-300 mt-0.5">
                  Projects Delivered
                </p>
              </div>
              <div className="bg-[#10284A]/70 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <p className="font-serif text-2xl font-bold text-[#F2D99B]">
                  {settings.sqftDelivered}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-slate-300 mt-0.5">
                  Built & Designed
                </p>
              </div>
              <div className="bg-[#10284A]/70 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <p className="font-serif text-2xl font-bold text-[#F2D99B]">
                  {settings.clientSatisfaction}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-slate-300 mt-0.5">
                  Client Satisfaction
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Architectural Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl bg-[#10284A]/90 backdrop-blur-xl border border-[#D6B36A]/45 p-6 sm:p-7 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#D6B36A] block">
                    INDICATIVE STARTING RATES
                  </span>
                  <h2 className="font-serif text-xl font-bold text-white mt-0.5">
                    2026 Turnkey & Design Packages
                  </h2>
                </div>
                <Award className="w-8 h-8 text-[#D6B36A]" aria-hidden="true" />
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#071A35]/90 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white">
                      Essential Home Construction
                    </p>
                    <p className="text-[11px] text-slate-300">Strong Structure & Quality Materials</p>
                  </div>
                  <span className="text-sm font-bold text-[#F2D99B]">₹1,099/sq.ft.</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#071A35]/90 border border-[#D6B36A]/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#F2D99B]">
                      Ready-to-Move Construction
                    </p>
                    <p className="text-[11px] text-slate-300">Enhanced Finishes & Modular Provisions</p>
                  </div>
                  <span className="text-sm font-bold text-[#D6B36A]">₹1,399/sq.ft.</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#071A35]/90 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white">
                      Premium Turnkey Solution
                    </p>
                    <p className="text-[11px] text-slate-300">Custom Design + Complete Interiors</p>
                  </div>
                  <span className="text-sm font-bold text-[#F2D99B]">₹1,899/sq.ft.</span>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D6B36A]/20 to-[#F2D99B]/10 border border-[#D6B36A]/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#F2D99B]">
                      Bespoke Interior Designing
                    </p>
                    <p className="text-[11px] text-slate-200">Kitchen, Wardrobes, Ceiling & Lighting</p>
                  </div>
                  <span className="text-sm font-bold text-[#F2D99B]">₹900/sq.ft.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D6B36A]" />
                    Lead: <strong className="text-white">{settings.contactPerson}</strong>
                  </span>
                  <a
                    href={`tel:+91${settings.phone}`}
                    className="inline-flex items-center gap-1 font-bold text-[#F2D99B] hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#D6B36A]" /> +91 {settings.phone}
                  </a>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" />
                  <span>{settings.address}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
