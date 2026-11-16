import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  UserCheck,
  PhoneCall,
  MapPin,
} from "lucide-react";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { HeroSection } from "@/components/HeroSection";
import { ServiceCard } from "@/components/ServiceCard";
import { PricingCard } from "@/components/PricingCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { BlogCard } from "@/components/BlogCard";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { FeaturedProjectsSection, FinalCTABanner } from "@/components/HomepageClientSections";
import { RealEstateSection } from "@/components/RealEstateSection";
import { generateFAQSchema } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: `${settings.companyName} – ${settings.brandIdentity} | Architecture, Construction & Interior Designing in Delhi`,
    description: `${settings.tagline} ${settings.supportingTagline} Premier Architecture, Construction, Interior Designing & Turnkey Solutions at ${settings.address}. Primary Contact: ${settings.contactPerson} (+91 ${settings.phone}).`,
    path: "/",
    ogImage: settings.heroImage,
  });
}

export default async function HomePage() {
  const {
    settings,
    homepageSections,
    services,
    pricingPackages,
    projects,
    testimonials,
    faqs,
    blogs,
    socialLinks,
    seoPages,
    realEstateSection,
    realEstateProperties,
  } = await cmsService.getPublicBootstrapData();

  const secMap = new Map(homepageSections.map((s) => [s.sectionKey, s]));
  const isSectionEnabled = (key: string) => secMap.get(key)?.isEnabled ?? true;

  const whyUsSection = secMap.get("why_choose_us");
  let whyUsItems: { title: string; description: string; icon: string }[] = [];
  try {
    whyUsItems = whyUsSection?.contentJson ? JSON.parse(whyUsSection.contentJson) : [];
  } catch {}

  const processSection = secMap.get("our_process");
  let processSteps: { step: string; title: string; description: string }[] = [];
  try {
    processSteps = processSection?.contentJson ? JSON.parse(processSection.contentJson) : [];
  } catch {}

  const constructionPackages = pricingPackages.filter((p) => p.packageType === "Construction");
  const interiorPackage =
    pricingPackages.find((p) => p.packageType === "Interior") || pricingPackages[3];

  const faqSchema = generateFAQSchema(
    faqs.map((f) => ({ question: f.question, answer: f.answer }))
  );

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

      {/* 1. HERO SECTION */}
      {isSectionEnabled("hero") && (
        <HeroSection
          settings={settings}
          badgeText={secMap.get("hero")?.badgeText || settings.brandStatement}
        />
      )}

      {/* 2. COMPANY INTRODUCTION */}
      {isSectionEnabled("introduction") && (
        <section className="py-20 bg-white border-b border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF6EA] border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#B89246]">
                  <Sparkles className="w-3.5 h-3.5" />
                  {settings.introBadge || "ARCH NEW ERA DESIGN • NRBL TECH"}
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35] leading-tight">
                  {settings.introTitle}
                </h2>

                <p className="text-base text-[#172033]/85 leading-relaxed">
                  {settings.introDescription}
                </p>

                <ul className="space-y-3 pt-1">
                  {(settings.introHighlights || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-medium text-[#172033]">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Primary Contact Person Highlight Card */}
                <div className="rounded-2xl bg-[#F6F7FA] border border-[#D6B36A]/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#071A35] text-[#F2D99B] flex items-center justify-center shrink-0">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#B89246] block">
                        Primary Project Contact
                      </span>
                      <p className="font-serif text-lg font-bold text-[#071A35]">
                        {settings.contactPerson}
                      </p>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D6B36A]" />
                        {settings.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <a
                      href={`tel:+91${settings.phone}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs hover:bg-[#10284A] transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#D6B36A]" />
                      +91 {settings.phone}
                    </a>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-300 text-[#071A35] font-bold text-xs hover:border-[#D6B36A] transition"
                    >
                      About Us <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden h-52 sm:h-64 shadow-luxury border border-slate-200">
                    <img
                      src="/uploads/service-5-storey-night-lighting-elevation.jpg"
                      alt="Modern Residential Architecture by ARCH NEW ERA DESIGN"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl bg-[#071A35] text-white p-5 sm:p-6 border border-[#D6B36A]/40">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#D6B36A] mb-1">
                      BRAND STATEMENT
                    </p>
                    <p className="font-serif text-lg sm:text-xl font-bold text-[#F2D99B]">
                      &ldquo;{settings.brandStatement}&rdquo;
                    </p>
                    <p className="text-xs text-slate-300 mt-2">
                      {settings.supportingTagline}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-0 sm:pt-6">
                  <div className="rounded-2xl bg-[#10284A] text-white p-5 sm:p-6 border border-[#D6B36A]/40">
                    <p className="font-serif text-3xl font-bold text-[#F2D99B]">100%</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-white mt-1">
                      Architect-Supervised Turnkey Delivery
                    </p>
                    <p className="text-xs text-slate-300 mt-1.5">
                      2D/3D Plans • Structural RCC • Bespoke Interiors
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden h-52 sm:h-64 shadow-luxury border border-slate-200">
                    <img
                      src="/uploads/service-hotel-pg-corridor.jpg"
                      alt="Luxury Interior Designing by ARCH NEW ERA DESIGN"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. OUR SERVICES */}
      {isSectionEnabled("services") && (
        <section className="py-20 bg-[#F6F7FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                  {secMap.get("services")?.badgeText || "OUR CORE EXPERTISE"}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35]">
                  {secMap.get("services")?.title || "Our Architecture, Construction & Interior Services"}
                </h2>
                <p className="text-sm sm:text-base text-[#172033]/75">
                  {secMap.get("services")?.subtitle}
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs uppercase tracking-wider hover:bg-[#10284A] transition shrink-0"
              >
                <span>View All {services.length} Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {services.slice(0, 6).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. WHY CHOOSE US */}
      {isSectionEnabled("why_choose_us") && (
        <section className="py-20 bg-[#071A35] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
                {whyUsSection?.badgeText || "WHY CHOOSE ARCH NEW ERA DESIGN"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                {whyUsSection?.title || "Why Choose Us"}
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                {whyUsSection?.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyUsItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#10284A] border border-[#D6B36A]/30 hover:border-[#D6B36A] p-7 transition space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#D6B36A]/20 border border-[#D6B36A]/50 text-[#F2D99B] flex items-center justify-center">
                    <IconRenderer name={item.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CONSTRUCTION PACKAGES */}
      {isSectionEnabled("pricing_packages") && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                {secMap.get("pricing_packages")?.badgeText || "TRANSPARENT PACKAGES"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35]">
                {secMap.get("pricing_packages")?.title || "Construction Packages"}
              </h2>
              <p className="text-sm sm:text-base text-[#172033]/75">
                {secMap.get("pricing_packages")?.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {constructionPackages.map((pkg) => (
                <PricingCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. INTERIOR DESIGNING HIGHLIGHT */}
      {isSectionEnabled("interior_highlight") && interiorPackage && (
        <section className="py-20 bg-gradient-to-r from-[#071A35] to-[#10284A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/50 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
                  {secMap.get("interior_highlight")?.badgeText || "BESPOKE INTERIOR DESIGNING"}
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {interiorPackage.name} — Starting at{" "}
                  <span className="text-[#F2D99B]">
                    {interiorPackage.startingPrice}
                    {interiorPackage.priceUnit}
                  </span>
                </h2>

                <p className="text-base text-slate-300 leading-relaxed">
                  {interiorPackage.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {interiorPackage.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#071A35]/60 border border-white/10"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-200">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] font-bold text-sm hover:brightness-105 transition shadow-gold"
                  >
                    <span>Compare All Packages & Specifications</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/services/interior-designing"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#D6B36A]/50 text-[#F2D99B] font-bold text-sm hover:bg-white/10 transition"
                  >
                    Explore Interior Portfolio
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border-2 border-[#D6B36A]/50 shadow-2xl relative">
                  <img
                    src={interiorPackage.imageUrl}
                    alt={interiorPackage.name}
                    loading="lazy"
                    className="w-full h-[440px] object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#071A35] via-[#071A35]/80 to-transparent p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#D6B36A]">
                      {settings.brandStatement}
                    </p>
                    <p className="font-serif text-xl font-bold text-white mt-0.5">
                      Modular Kitchen • Wardrobes • False Ceiling • Office Fit-Outs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. FEATURED PROJECTS */}
      {isSectionEnabled("featured_projects") && (
        <FeaturedProjectsSection
          projects={projects}
          title={secMap.get("featured_projects")?.title || "Signature Architectural & Interior Portfolio"}
          subtitle={
            secMap.get("featured_projects")?.subtitle ||
            "Explore our residential homes, luxury interiors, active construction sites, and villas."
          }
          badgeText={secMap.get("featured_projects")?.badgeText}
        />
      )}

      {/* 8. REAL ESTATE, BUILDER FLOORS & LAND INVESTMENTS */}
      {isSectionEnabled("real_estate") && (
        <RealEstateSection
          sectionData={realEstateSection}
          properties={realEstateProperties}
          settings={settings}
        />
      )}

      {/* 8. OUR PROCESS */}
      {isSectionEnabled("our_process") && (
        <section className="py-20 bg-white border-t border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                {processSection?.badgeText || "HOW WE WORK"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35]">
                {processSection?.title || "Our 6-Step Execution Process"}
              </h2>
              <p className="text-sm sm:text-base text-[#172033]/75">{processSection?.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((stepObj, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#F6F7FA] border border-slate-200/90 hover:border-[#D6B36A] p-7 transition relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#071A35] text-[#F2D99B] font-serif font-bold text-lg shadow">
                      {stepObj.step}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                      Phase {stepObj.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#071A35] mb-2">
                    {stepObj.title}
                  </h3>
                  <p className="text-sm text-[#172033]/80 leading-relaxed">{stepObj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. TESTIMONIALS */}
      {isSectionEnabled("testimonials") && testimonials.length > 0 && (
        <section className="py-20 bg-[#F6F7FA] border-t border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                {secMap.get("testimonials")?.badgeText || "CLIENT FEEDBACK"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35]">
                {secMap.get("testimonials")?.title || "Client Experiences"}
              </h2>
              <p className="text-sm sm:text-base text-[#172033]/75">
                {secMap.get("testimonials")?.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {testimonials.slice(0, 3).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      {isSectionEnabled("faq") && faqs.length > 0 && (
        <section className="py-20 bg-white border-t border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                {secMap.get("faq")?.badgeText || "KNOWLEDGE CENTER"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35]">
                {secMap.get("faq")?.title || "Frequently Asked Questions"}
              </h2>
              <p className="text-sm sm:text-base text-[#172033]/75">{secMap.get("faq")?.subtitle}</p>
            </div>

            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* 11. LATEST BLOG ARTICLES */}
      {isSectionEnabled("latest_blogs") && blogs.length > 0 && (
        <section className="py-20 bg-[#F6F7FA] border-t border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                  {secMap.get("latest_blogs")?.badgeText || "EDITORIAL JOURNAL"}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35]">
                  {secMap.get("latest_blogs")?.title || "Latest Architecture & Construction Articles"}
                </h2>
                <p className="text-sm sm:text-base text-[#172033]/75">
                  {secMap.get("latest_blogs")?.subtitle}
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs uppercase tracking-wider hover:bg-[#10284A] transition shrink-0"
              >
                <span>Read All Articles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {blogs.slice(0, 3).map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12. FINAL CTA SECTION */}
      {isSectionEnabled("final_cta") && (
        <FinalCTABanner
          settings={settings}
          title={secMap.get("final_cta")?.title}
          subtitle={secMap.get("final_cta")?.subtitle}
          badgeText={secMap.get("final_cta")?.badgeText}
        />
      )}
    </PublicShell>
  );
}
