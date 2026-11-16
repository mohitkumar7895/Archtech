import React from "react";
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
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { RealEstateSection } from "@/components/RealEstateSection";
import { buildPageMetadata } from "@/lib/metadata";
import { generateFAQSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings, realEstateSection } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: "Real Estate, Luxury Builder Floors & Freehold Plots in Shahdara Delhi NCR | ARCH NEW ERA DESIGN",
    description:
      realEstateSection?.subtitle ||
      `Explore verified freehold plots, 2/3/4 BHK builder floors with lift, 50:50 builder collaborations, and high-yield PG buildings in Delhi NCR by Manoj Kumar Sharma (+91 ${settings.phone}).`,
    path: "/real-estate",
    ogImage: settings.heroImage,
  });
}

const REAL_ESTATE_FAQS = [
  {
    question: "How does 50:50 Builder Collaboration work with Manoj Kumar Sharma?",
    answer:
      "If you own an old house or residential plot in Delhi NCR, you can collaborate with ARCH NEW ERA DESIGN (NRBL TECH). We invest 100% of the construction capital to construct a 4 to 5-storey luxury apartment complex with lift and stilt parking. The completed floors are shared between you (the plot owner) and us as per a mutually agreed, legally registered joint venture agreement. You spend ₹0 from your own pocket.",
  },
  {
    question: "Are the builder floors and plots eligible for home loans?",
    answer:
      "Yes! All our builder floors and freehold plots are 100% clear-title with complete chain documents, registered mutation, and approved building plans. They are pre-approved for 80% to 90% bank loans by leading nationalized and private banks including SBI, HDFC, ICICI, and PNB.",
  },
  {
    question: "What is the starting price for builder floors in Shahdara / East Delhi?",
    answer:
      "Modern 2 BHK & 3 BHK luxury builder floors with lift and reserved parking start around ₹45 Lakhs to ₹75 Lakhs depending on plot location, road width, and custom interior finishes. 4 BHK luxury residences start from ₹95 Lakhs onwards.",
  },
  {
    question: "Do you handle government registry and MCD/DDA map approvals?",
    answer:
      "Yes, our in-house team handles the entire process: architectural blueprints, structural stability certificates, MCD/DDA sanction maps, chain title due diligence, and registration at the Sub-Registrar office.",
  },
  {
    question: "How do I invest in a turnkey PG or student hostel building?",
    answer:
      "We design, build, and deliver ready-to-operate PG hostel buildings (like our showcased G+4 complex with 28 rooms) near institutional hubs and universities in Delhi NCR, delivering assured monthly rental yields of ₹1.5 Lakh to ₹3.5 Lakh.",
  },
];

export default async function RealEstatePage() {
  const {
    settings,
    services,
    socialLinks,
    seoPages,
    realEstateSection,
    realEstateProperties,
    faqs,
  } = await cmsService.getPublicBootstrapData();

  const realEstateCmsFaqs = faqs.filter(
    (f) => f.category === "Real Estate" || f.category === "Real Estate & Plots"
  );
  const displayFaqs = realEstateCmsFaqs.length > 0 ? realEstateCmsFaqs : REAL_ESTATE_FAQS;

  const faqSchema = generateFAQSchema(displayFaqs);

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#071A35] via-[#10284A] to-[#071A35] text-white py-16 sm:py-20 border-b border-[#D6B36A]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,179,106,0.15),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-[#F2D99B] text-xs font-bold uppercase tracking-widest">
            <Building2 className="w-3.5 h-3.5 text-[#D6B36A]" />
            REAL ESTATE & PROPERTY EXPERTS • NRBL TECH
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Verified Real Estate, Luxury Builder Floors & Freehold Plots
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Guided by <strong className="text-[#F2D99B]">Manoj Kumar Sharma</strong> — Offering 100% Freehold Registry Plots, 2/3/4 BHK Modern Builder Floors with Lift & Stilt Parking, and Zero-Investment 50:50 Builder Collaborations across Delhi NCR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={`https://wa.me/91${settings.whatsapp || "7535942407"}?text=${encodeURIComponent(
                "Hello Manoj Kumar Sharma, I am interested in Real Estate / Builder Floors / Plot Collaboration."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:brightness-105 transition shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Manoj Kumar Sharma (Direct)</span>
            </a>

            <a
              href={`tel:+91${settings.phone || "7535942407"}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition"
            >
              <PhoneCall className="w-4 h-4 text-[#D6B36A]" />
              <span>Call +91 {settings.phone || "7535942407"}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Interactive Real Estate Showcase */}
      <RealEstateSection
        sectionData={realEstateSection}
        properties={realEstateProperties}
        settings={settings}
      />

      {/* Real Estate FAQs Section */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
              REAL ESTATE FAQ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35]">
              Frequently Asked Questions About Property & Collaboration
            </h2>
            <p className="text-sm text-slate-600">
              Clear answers regarding title verification, builder collaborations, registry, and bank loan procedures in Shahdara & Delhi NCR.
            </p>
          </div>

          <div className="space-y-4">
            {displayFaqs.map((faq, idx) => (
              <div
                key={'id' in faq && (faq as any).id ? (faq as any).id : `re-faq-${idx}`}
                className="rounded-2xl bg-[#F6F7FA] border border-slate-200/90 p-6 space-y-2 hover:border-[#D6B36A] transition"
              >
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#071A35] flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#071A35] text-[#F2D99B] text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Contact Prompt */}
          <div className="text-center pt-6">
            <p className="text-sm text-slate-600">
              Have a plot or want an on-site property evaluation?{" "}
              <Link
                href="/contact"
                className="font-bold text-[#071A35] hover:text-[#B89246] underline underline-offset-4"
              >
                Schedule an appointment with Manoj Kumar Sharma
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
