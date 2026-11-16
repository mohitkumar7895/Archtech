"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Home,
  MapPin,
  Handshake,
  TrendingUp,
  FileCheck2,
  Landmark,
  KeyRound,
  ArrowRight,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  Layers,
  Bed,
  Bath,
  Maximize2,
  Tag,
  ShieldCheck,
  Calendar,
  Send,
} from "lucide-react";
import { RealEstateSection as IRealEstateSection, RealEstateProperty, SiteSettings } from "@/types";
import { formatWhatsAppUrl } from "@/lib/utils";
import { useModal } from "@/hooks/useModal";

interface RealEstateSectionProps {
  sectionData?: IRealEstateSection;
  properties?: RealEstateProperty[];
  settings: SiteSettings;
}

const CATEGORY_FILTERS = [
  "All",
  "Builder Floor",
  "Residential Plot",
  "PG / Hostel Building",
  "Joint Venture / Collaboration",
  "Commercial Shop / Office",
];

export function RealEstateSection({
  sectionData,
  properties = [],
  settings,
}: RealEstateSectionProps) {
  const { openConsultationModal } = useModal();
  const [activeTab, setActiveTab] = useState<"properties" | "services" | "collaboration">("properties");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const data = sectionData || {
    badgeText: "REAL ESTATE & PROPERTY SOLUTIONS",
    title: "Buy, Sell, Collaborate & Invest in Verified Properties Across Delhi NCR",
    subtitle:
      "Under the guidance of Manoj Kumar Sharma (ARCH NEW ERA DESIGN – NRBL TECH) — 100% Freehold Registry Plots, Luxury Builder Floors, Joint Venture Collaborations & High-Yield Commercial Assets.",
    description:
      "We combine architectural authority with premier real estate. From builder floors with lifts and stilt parking to zero-investment 50:50 builder collaborations and clear-title plots, we ensure complete peace of mind.",
    highlights: [
      "100% Clear Title Verification & Freehold Registry",
      "50:50 Builder Collaboration (Zero Investment by Plot Owner)",
      "Architect-Designed 2, 3 & 4 BHK Builder Floors with Lift",
      "80% to 90% Bank Loan Approved (SBI, HDFC, ICICI, PNB)",
    ],
    stats: [
      { label: "Verified Deals", value: "150+" },
      { label: "Builder Collaborations", value: "35+" },
      { label: "Bank Loan Assistance", value: "80%–90%" },
      { label: "Title Due Diligence", value: "100% Clear" },
    ],
    servicesOffered: [],
    collaborationCtaTitle: "Have a Plot or Old House? Let's Build Together with Zero Investment from You!",
    collaborationCtaSubtitle:
      "Partner with Manoj Kumar Sharma for a 50:50 Builder Collaboration. We finance 100% construction and build a luxury apartment complex on your land.",
    isEnabled: true,
    updatedAt: new Date().toISOString(),
  };

  const filteredProperties = properties.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.category === selectedCategory;
  });

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Home":
        return <Home className="w-5 h-5 text-[#D6B36A]" />;
      case "Handshake":
        return <Handshake className="w-5 h-5 text-[#D6B36A]" />;
      case "Building2":
        return <Building2 className="w-5 h-5 text-[#D6B36A]" />;
      case "MapPin":
        return <MapPin className="w-5 h-5 text-[#D6B36A]" />;
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5 text-[#D6B36A]" />;
      case "FileCheck2":
        return <FileCheck2 className="w-5 h-5 text-[#D6B36A]" />;
      case "Landmark":
        return <Landmark className="w-5 h-5 text-[#D6B36A]" />;
      case "KeyRound":
        return <KeyRound className="w-5 h-5 text-[#D6B36A]" />;
      default:
        return <Building2 className="w-5 h-5 text-[#D6B36A]" />;
    }
  };

  return (
    <section id="real-estate" className="py-20 bg-gradient-to-b from-[#F6F7FA] via-white to-[#F6F7FA] border-t border-slate-200/80 relative overflow-hidden">
      {/* Decorative Gold Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D6B36A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#071A35]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#071A35] text-[#F2D99B] border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-[#D6B36A]" />
            {data.badgeText}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#071A35] leading-tight">
            {data.title}
          </h2>
          <p className="text-sm sm:text-base text-[#172033]/80 leading-relaxed max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-[#071A35] text-white p-6 sm:p-8 rounded-2xl border border-[#D6B36A]/40 shadow-xl">
          {(data.stats || []).map((s, idx) => (
            <div key={idx} className="text-center space-y-1 border-r last:border-r-0 border-white/10 px-2">
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F2D99B] tracking-tight">
                {s.value}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main Tab Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("properties")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition inline-flex items-center gap-2 ${
              activeTab === "properties"
                ? "bg-[#071A35] text-[#F2D99B] shadow-md border border-[#D6B36A]/40"
                : "bg-white text-[#172033] border border-slate-200 hover:border-[#D6B36A]"
            }`}
          >
            <Home className="w-4 h-4 text-[#D6B36A]" />
            <span>Featured Properties ({properties.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition inline-flex items-center gap-2 ${
              activeTab === "services"
                ? "bg-[#071A35] text-[#F2D99B] shadow-md border border-[#D6B36A]/40"
                : "bg-white text-[#172033] border border-slate-200 hover:border-[#D6B36A]"
            }`}
          >
            <Layers className="w-4 h-4 text-[#D6B36A]" />
            <span>All Real Estate Services (संपूर्ण कार्य)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("collaboration")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition inline-flex items-center gap-2 ${
              activeTab === "collaboration"
                ? "bg-[#071A35] text-[#F2D99B] shadow-md border border-[#D6B36A]/40"
                : "bg-white text-[#172033] border border-slate-200 hover:border-[#D6B36A]"
            }`}
          >
            <Handshake className="w-4 h-4 text-[#D6B36A]" />
            <span>50:50 Builder Collaboration (पार्टनरशिप)</span>
          </button>
        </div>

        {/* TAB 1: FEATURED PROPERTIES */}
        {activeTab === "properties" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedCategory === cat
                        ? "bg-[#D6B36A] text-[#071A35] shadow"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-[#D6B36A]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openConsultationModal("Real Estate & Property Consultation")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#071A35] hover:text-[#B89246] transition underline underline-offset-4"
              >
                <span>Need custom plot / floor requirement? Speak with Manoj Kumar Sharma</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProperties.map((prop) => {
                const waUrl = formatWhatsAppUrl(
                  prop.contactPhone || settings.whatsapp || "7535942407",
                  `Hello Manoj Kumar Sharma, I am interested in ${prop.title} (${prop.price}) located at ${prop.location}. Please share complete details, site visit schedule, and floor layout.`
                );

                return (
                  <div
                    key={prop.id}
                    className="rounded-2xl bg-white border border-slate-200 hover:border-[#D6B36A] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                  >
                    {/* Thumbnail & Badges */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                      <img
                        src={prop.featuredImage || "/uploads/service-5-storey-elevation-manoj-kumar-sharma.jpg"}
                        alt={prop.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071A35]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-md bg-[#071A35]/90 text-white text-[11px] font-bold tracking-wide backdrop-blur-sm border border-white/20">
                          {prop.category}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold backdrop-blur-sm shadow ${
                            prop.status === "Ready to Move"
                              ? "bg-emerald-600 text-white"
                              : prop.status === "Booking Open"
                              ? "bg-[#D6B36A] text-[#071A35]"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {prop.status}
                        </span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="bg-[#071A35]/95 text-white px-3.5 py-1.5 rounded-xl border border-[#D6B36A]/60 backdrop-blur-sm shadow-lg">
                          <span className="text-[10px] text-slate-300 block uppercase tracking-wider font-medium">Price</span>
                          <span className="font-serif font-bold text-base sm:text-lg text-[#F2D99B]">
                            {prop.price}
                          </span>
                        </div>

                        <span className="text-[11px] font-semibold text-white/90 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                          {prop.propertyType}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" />
                          <span className="truncate">{prop.location}</span>
                        </div>

                        <h3 className="font-serif text-lg font-bold text-[#071A35] group-hover:text-[#B89246] transition leading-snug line-clamp-2">
                          {prop.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {prop.shortDescription}
                        </p>
                      </div>

                      {/* Specification Tags */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                        <div className="flex items-center gap-1 bg-[#F6F7FA] p-1.5 rounded-lg truncate">
                          <Maximize2 className="w-3 h-3 text-[#D6B36A] shrink-0" />
                          <span className="truncate font-medium">{prop.areaSqFt}</span>
                        </div>
                        {prop.bedrooms && prop.bedrooms !== "N/A (Plot)" ? (
                          <div className="flex items-center gap-1 bg-[#F6F7FA] p-1.5 rounded-lg truncate">
                            <Bed className="w-3 h-3 text-[#D6B36A] shrink-0" />
                            <span className="truncate font-medium">{prop.bedrooms}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-[#F6F7FA] p-1.5 rounded-lg truncate">
                            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate font-medium">Freehold</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 bg-[#F6F7FA] p-1.5 rounded-lg truncate">
                          <Calendar className="w-3 h-3 text-[#D6B36A] shrink-0" />
                          <span className="truncate font-medium">{prop.possessionDate || "Immediate"}</span>
                        </div>
                      </div>

                      {/* Key Features Chips */}
                      {prop.features && prop.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {prop.features.slice(0, 3).map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="text-[10px] font-medium bg-[#071A35]/5 text-[#071A35] px-2 py-0.5 rounded-md border border-slate-200"
                            >
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action CTA Buttons */}
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba5a] transition shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            openConsultationModal(`Site Visit: ${prop.title} (${prop.location})`)
                          }
                          className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs hover:bg-[#10284A] transition"
                        >
                          <span>Book Site Visit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ALL REAL ESTATE SERVICES COVERED */}
        {activeTab === "services" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#071A35]">
                Complete Real Estate Solutions (A to Z Property Services)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                From finding verified freehold plots to drafting architectural maps, executing civil construction, managing MCD approvals, and handing over keys with registry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(data.servicesOffered || []).map((srv) => (
                <div
                  key={srv.id}
                  className="rounded-2xl bg-white border border-slate-200 hover:border-[#D6B36A] p-6 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#071A35] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      {getServiceIcon(srv.iconName)}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#071A35] group-hover:text-[#B89246] transition">
                        {srv.title}
                      </h4>
                      <p className="text-[11px] font-bold text-[#B89246] uppercase tracking-wider mt-0.5">
                        {srv.subtitle}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {(srv.highlights || []).map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => openConsultationModal(`Real Estate Service: ${srv.title}`)}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-[#F6F7FA] hover:bg-[#071A35] hover:text-[#F2D99B] text-[#071A35] font-bold text-xs transition border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <span>Inquire for {srv.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 50:50 BUILDER COLLABORATION HIGHLIGHT */}
        {activeTab === "collaboration" && (
          <div className="rounded-3xl bg-[#071A35] text-white p-7 sm:p-10 lg:p-12 border-2 border-[#D6B36A]/50 shadow-2xl space-y-10 animate-fadeIn relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/50 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
                  <Handshake className="w-3.5 h-3.5 text-[#D6B36A]" />
                  ZERO-INVESTMENT BUILDER COLLABORATION (JV)
                </span>

                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {data.collaborationCtaTitle}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {data.collaborationCtaSubtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    "100% Construction Financed by Manoj Kumar Sharma",
                    "Owner Retains Ground / Preferred Luxury Floors",
                    "MCD/DDA Sanctioned Maps & Seismic-IV Safety",
                    "High-Speed Lift & Covered Stilt Parking for Every Floor",
                    "Registered Legal Joint-Venture Agreement with Bank Guarantee",
                    "Full Rental Subsidy Provided During Construction Months",
                  ].map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200">{pt}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href={formatWhatsAppUrl(
                      settings.whatsapp || "7535942407",
                      "Hello Manoj Kumar Sharma, I own an old house / residential plot in Delhi NCR and want to discuss a 50:50 Builder Collaboration project."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:brightness-105 transition shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Manoj Kumar Sharma (Direct)</span>
                  </a>

                  <a
                    href={`tel:+91${settings.phone || "7535942407"}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#D6B36A]/60 text-[#F2D99B] font-bold text-sm hover:bg-white/10 transition"
                  >
                    <PhoneCall className="w-4 h-4 text-[#D6B36A]" />
                    <span>Call +91 {settings.phone || "7535942407"}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden border-2 border-[#D6B36A]/50 shadow-2xl relative">
                  <img
                    src="/uploads/featured-5-storey-luxury-building.jpg"
                    alt="5-Storey Luxury Builder Collaboration Building by Manoj Kumar Sharma"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A35] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#D6B36A]">
                      REALIZED IN EAST DELHI
                    </p>
                    <p className="font-serif text-lg font-bold text-white">
                      5-Storey Luxury Residence & Stilt Parking
                    </p>
                    <p className="text-xs text-slate-300">
                      Designed & Executed on Collaboration by Manoj Kumar Sharma
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-xs text-slate-200 flex items-center justify-between">
                  <span>Want a free valuation of your plot or old house?</span>
                  <button
                    type="button"
                    onClick={() => openConsultationModal("Old House / Plot Collaboration Assessment")}
                    className="px-3 py-1.5 rounded-lg bg-[#D6B36A] text-[#071A35] font-bold text-xs hover:brightness-105 transition"
                  >
                    Get Free Site Visit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Property Submission CTA Box */}
        <div className="rounded-2xl bg-gradient-to-r from-[#071A35] via-[#10284A] to-[#071A35] p-6 sm:p-8 text-white border border-[#D6B36A]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D6B36A]">
              LOOKING TO BUY, SELL OR COLLABORATE?
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Connect Directly with Manoj Kumar Sharma at ARCH NEW ERA DESIGN
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Visit our office at B-366, Ashok Nagar, Shahdara, Delhi – 110093 or schedule an on-site property evaluation today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/real-estate"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] font-bold text-xs sm:text-sm hover:brightness-105 transition shadow-gold"
            >
              <span>Explore All Listings & Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => openConsultationModal("Real Estate & Plot Consultation")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/30 text-white font-bold text-xs sm:text-sm hover:bg-white/10 transition"
            >
              <Send className="w-4 h-4 text-[#D6B36A]" />
              <span>Submit Your Property</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
