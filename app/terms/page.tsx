import React from "react";
import Link from "next/link";
import {
  Scale,
  FileCheck2,
  Building2,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ShieldCheck,
  CreditCard,
  PenTool,
  ArrowRight,
} from "lucide-react";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: `Terms & Conditions | ${settings.companyName} (${settings.brandIdentity})`,
    description: `Official Terms and Conditions for architectural design, turnkey construction, structural engineering, and interior design services by ${settings.companyName} (${settings.brandIdentity}), led by ${settings.contactPerson}.`,
    path: "/terms",
  });
}

export default async function TermsPage() {
  const { settings, services, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "scope", title: "2. Scope of Services" },
    { id: "package-rates", title: "3. Indicative Starting Rates & BOQ" },
    { id: "consultation", title: "4. Consultations & Site Inspections" },
    { id: "milestone-payments", title: "5. Milestone-Based Payments" },
    { id: "intellectual-property", title: "6. Architectural Drawings & IP" },
    { id: "client-obligations", title: "7. Client Obligations & Approvals" },
    { id: "material-standards", title: "8. Quality Standards & Warranties" },
    { id: "timelines-handover", title: "9. Timelines & Handover" },
    { id: "change-orders", title: "10. Variations & Change Orders" },
    { id: "cancellation", title: "11. Termination & Dispute Resolution" },
    { id: "governing-office", title: "12. Governing Office & Contact" },
  ];

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#071A35] via-[#0D254C] to-[#071A35] text-white py-16 sm:py-20 border-b border-[#D6B36A]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#D6B36A]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-4">
          <Breadcrumbs items={[{ name: "Terms & Conditions", url: "/terms" }]} />

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-wider text-[#F2D99B]">
              <Scale className="w-3.5 h-3.5 text-[#D6B36A]" />
              Client Service Agreement
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-xs font-medium text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#D6B36A]" />
              Version 2.0 • November 2026
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl leading-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-base sm:text-lg text-[#F2D99B] max-w-3xl leading-relaxed">
            Transparent, professional terms governing architectural planning, turnkey civil construction, seismic structural engineering, and bespoke luxury interior designs provided by{" "}
            <strong>{settings.companyName} ({settings.brandIdentity})</strong> under the leadership of{" "}
            <strong>{settings.contactPerson}</strong>.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <section className="py-14 sm:py-20 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Sticky Navigation on Desktop */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#071A35] flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <FileCheck2 className="w-5 h-5 text-[#D6B36A]" />
                    Agreement Sections
                  </h3>
                  <nav className="space-y-1 text-sm">
                    {sections.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#071A35] hover:bg-[#F6F7FA] font-medium transition"
                      >
                        {sec.title}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Direct Consultation Box */}
                <div className="bg-gradient-to-br from-[#071A35] to-[#10284A] text-white rounded-2xl p-6 border border-[#D6B36A]/30 shadow-md space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F2D99B]">
                    Project Inquiries
                  </span>
                  <h4 className="font-serif text-lg font-bold text-white">
                    Need BOQ or Contract Clarification?
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our team provides complete transparency before any contract signing. Reach {settings.contactPerson} directly.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                    <a
                      href={`tel:+91${settings.phone}`}
                      className="flex items-center gap-2 text-slate-200 hover:text-[#F2D99B] transition"
                    >
                      <Phone className="w-4 h-4 text-[#D6B36A]" />
                      +91 {settings.phone}
                    </a>
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-center gap-2 text-slate-200 hover:text-[#F2D99B] transition"
                    >
                      <Mail className="w-4 h-4 text-[#D6B36A]" />
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Detailed Clauses */}
            <main className="lg:col-span-8 space-y-8">
              {/* Section 1 */}
              <article
                id="acceptance"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    1. Acceptance of Terms
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    By engaging the services of, requesting a quote from, or accessing the website and digital tools of{" "}
                    <strong>{settings.companyName} ({settings.brandIdentity})</strong> (located at {settings.address} and led by <strong>{settings.contactPerson}</strong>), you agree to be bound by these Terms and Conditions.
                  </p>
                  <p>
                    These terms constitute a legally binding agreement governing all site visits, structural engineering calculations, 2D architectural drafts, 3D renderings, material procurement, turnkey construction contracts, and interior renovation engagements across Delhi, Noida, Greater Noida, Ghaziabad, Gurgaon, and Faridabad.
                  </p>
                </div>
              </article>

              {/* Section 2 */}
              <article
                id="scope"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    2. Scope of Services
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 pt-2">
                  <p>
                    {settings.companyName} operates as an integrated architecture, engineering, and construction firm providing:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#F6F7FA] border border-slate-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-[#071A35]">
                        Architectural Planning & 2D/3D Elevation
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F6F7FA] border border-slate-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-[#071A35]">
                        Seismic Structural Drawings & Soil Testing
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F6F7FA] border border-slate-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-[#071A35]">
                        Turnkey Residential & Commercial Construction
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F6F7FA] border border-slate-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-[#071A35]">
                        Bespoke Interior Design & Modular Woodwork
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F6F7FA] border border-slate-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-[#071A35]">
                        Vastu-Compliant Spatial Layouts
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F6F7FA] border border-slate-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-[#071A35]">
                        Real Estate Advisory & Joint Ventures
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 3 */}
              <article
                id="package-rates"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    3. Indicative Starting Rates & BOQ Disclaimers
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 pt-2">
                  <p>
                    All rates published on our website, cost calculator, or marketing materials represent <strong>indicative baseline rates</strong>:
                  </p>
                  <ul className="space-y-2.5 pl-2">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Essential Home Construction:</strong> Starting at ₹1,099/sq. ft. (standard structural framing, essential brickwork, and basic civil finishes).
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Ready-to-Move Home Package:</strong> Starting at ₹1,399/sq. ft. (branded flooring, modular electricals, sanitary fittings, and smooth emulsion coats).
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Premium Turnkey Luxury Living:</strong> Starting at ₹1,899/sq. ft. (high-grade seismic steel, designer Italian marble/vitrified tiles, false ceilings, and luxury woodwork).
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Custom Interior Designing:</strong> Starting at ₹900/sq. ft. for full turnkey interior scopes.
                      </span>
                    </li>
                  </ul>
                  <div className="p-4 rounded-xl bg-[#D6B36A]/10 border border-[#D6B36A]/30 text-xs sm:text-sm text-[#071A35] flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                    <p>
                      <strong>Important Notice:</strong> Final contractual pricing is exclusively governed by a mutually agreed <strong>Bill of Quantities (BOQ)</strong> signed after on-site plot inspection, soil load-bearing verification, elevation complexity, and exact client material brand selections.
                    </p>
                  </div>
                </div>
              </article>

              {/* Section 4 */}
              <article
                id="consultation"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    4. Consultations & Site Inspections
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    Initial phone, WhatsApp, and studio consultations are complimentary. Physical site inspections across Delhi NCR are scheduled upon mutual confirmation.
                  </p>
                  <p>
                    Where a nominal site evaluation or soil testing fee applies for distant locations outside central Delhi NCR, that entire amount is adjusted as a credit against the project booking advance upon formal contract signing.
                  </p>
                </div>
              </article>

              {/* Section 5 */}
              <article
                id="milestone-payments"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    5. Milestone-Based Payments
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    To ensure complete security and mutual transparency, all turnkey construction projects are executed under a strict <strong>Milestone-Based Escrow or Stage Payment Schedule</strong>:
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <p><strong>Stage 1:</strong> Booking & Architectural Drafting Advance (10%)</p>
                    <p><strong>Stage 2:</strong> Excavation, Foundation & Plinth Beam Casting (15%)</p>
                    <p><strong>Stage 3:</strong> Ground Floor / Stilt Slab Casting (15%)</p>
                    <p><strong>Stage 4:</strong> Upper Floors Slab Castings (15%)</p>
                    <p><strong>Stage 5:</strong> Brick Masonry, Plaster & Electrical/Plumbing Conduits (15%)</p>
                    <p><strong>Stage 6:</strong> Flooring, Tile Work, Windows & False Ceilings (15%)</p>
                    <p><strong>Stage 7:</strong> Paint, Fixtures, Final Detailing & Keys Handover (10%)</p>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    Work on the subsequent stage initiates once the preceding milestone has been inspected and settled.
                  </p>
                </div>
              </article>

              {/* Section 6 */}
              <article
                id="intellectual-property"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    6. Architectural Drawings & Intellectual Property
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    All 2D floor plans, 3D exterior elevations, structural designs, and interior sketches created by{" "}
                    <strong>{settings.companyName} ({settings.brandIdentity})</strong> are the original intellectual property of our firm.
                  </p>
                  <p>
                    The client is granted an exclusive, perpetual license to use these designs for the construction of their designated plot or site once professional design fees are cleared. Re-selling, replicating, or using our proprietary designs for unauthorized commercial developments without written permission from {settings.contactPerson} is strictly prohibited.
                  </p>
                </div>
              </article>

              {/* Section 7 */}
              <article
                id="client-obligations"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    7. Client Obligations & Clearances
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    The client guarantees undisputed ownership/title to the construction site and agrees to provide:
                  </p>
                  <ul className="space-y-2 pl-2 text-xs sm:text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>Unrestricted physical access for construction machinery, material trucks, and labour.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>Adequate water supply and electrical connection at site for civil works.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>Timely approval of floor plans, material selections, and milestone stage inspections.</span>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Section 8 */}
              <article
                id="material-standards"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    8. Quality Standards & Warranties
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    We construct exclusively with certified Indian Standard (IS) materials:
                  </p>
                  <p>
                    <strong>Civil Materials:</strong> High-grade TMT steel (Tata Tiscon / Jindal Panther / equivalent) and Grade 43/53 Portland Pozzolana Cement (UltraTech / Ambuja / ACC).
                  </p>
                  <p>
                    <strong>Warranties:</strong> Manufacturer warranties for sanitaryware (Kohler / Jaquar), electrical fixtures (Havells / Polycab), and paint coats (Asian Paints / Berger) are passed directly to the client at handover.
                  </p>
                </div>
              </article>

              {/* Section 9 */}
              <article
                id="timelines-handover"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    9. Timelines & Handover
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    Project completion schedules are formalized in writing within the primary BOQ contract. Standard turnkey residential homes (G+2 / G+3) are typically delivered within 6 to 10 months from foundation casting.
                  </p>
                  <p>
                    Force majeure events including extreme government environmental construction bans (GRAP III/IV winter dust bans in Delhi NCR), strikes, natural catastrophes, or delayed client approvals shall extend the timeline equitably.
                  </p>
                </div>
              </article>

              {/* Section 10 */}
              <article
                id="change-orders"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    10. Variations & Change Orders
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    Any change in spatial layout, room dimensions, or luxury material upgrade requested by the client after milestone work has commenced will be documented through a written <strong>Change Order</strong> specifying cost impact and timeline modifications before execution.
                  </p>
                </div>
              </article>

              {/* Section 11 */}
              <article
                id="cancellation"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    11. Termination & Dispute Resolution
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    Either party may terminate the contract with written notice in case of a material breach. Upon termination, completed construction stages and procured materials remain payable.
                  </p>
                  <p>
                    Any disputes arising out of or related to these terms shall first be addressed through amicable mediation. If unresolved, disputes are subject to the exclusive jurisdiction of the competent courts in <strong>Delhi, India</strong>.
                  </p>
                </div>
              </article>

              {/* Section 12 */}
              <article
                id="governing-office"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    12. Governing Office & Contact
                  </h2>
                </div>

                <div className="p-6 rounded-2xl bg-[#071A35] text-white border border-[#D6B36A]/40 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#D6B36A]/20 flex items-center justify-center border border-[#D6B36A]/40 text-[#F2D99B] font-bold text-lg">
                      MK
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">
                        {settings.contactPerson}
                      </h4>
                      <p className="text-xs text-[#F2D99B]">
                        Director & Lead Project Coordinator
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs text-slate-300">
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium">Company Name:</p>
                      <p className="font-semibold text-white">
                        {settings.companyName} ({settings.brandIdentity})
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium">Office Address:</p>
                      <p className="text-white">{settings.address}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium">Direct Telephone:</p>
                      <a
                        href={`tel:+91${settings.phone}`}
                        className="text-[#F2D99B] hover:underline font-semibold block"
                      >
                        +91 {settings.phone}
                      </a>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium">Official Email:</p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-[#F2D99B] hover:underline font-semibold block"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/91${settings.whatsapp}?text=Hello%20${encodeURIComponent(
                        settings.contactPerson
                      )},%20I%20have%20a%20question%20regarding%20your%20Service%20Terms`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white font-medium text-xs hover:bg-[#20bd5a] transition shadow-sm"
                    >
                      Chat on WhatsApp
                    </a>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/20 transition"
                    >
                      View Pricing Packages
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
