import React from "react";
import {
  CheckCircle2,
  UserCheck,
  Target,
  Eye,
  PhoneCall,
  MapPin,
  Sparkles,
} from "lucide-react";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FinalCTABanner } from "@/components/HomepageClientSections";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings, aboutSection } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: `About ${settings.companyName} (${settings.brandIdentity}) | Led by ${settings.contactPerson}`,
    description: aboutSection.subtitle || settings.footerAbout,
    path: "/about",
    ogImage: aboutSection.imageUrl || settings.heroImage,
  });
}

export default async function AboutPage() {
  const { settings, aboutSection, services, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#071A35] to-[#10284A] text-white py-16 border-b border-[#D6B36A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs items={[{ name: "About Us", url: "/about" }]} />
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            {settings.companyName} • {settings.brandIdentity}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl leading-tight">
            {aboutSection.title}
          </h1>
          <p className="text-base sm:text-lg text-[#F2D99B] max-w-2xl">
            {aboutSection.subtitle}
          </p>
        </div>
      </section>

      {/* Main Story & Image */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                OUR ARCHITECTURAL IDENTITY
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#071A35]">
                {settings.tagline} — {settings.supportingTagline}
              </h2>
              <div className="space-y-4 text-base text-[#172033]/85 leading-relaxed whitespace-pre-line">
                {aboutSection.content}
              </div>

              <ul className="space-y-3 pt-2">
                {(aboutSection.highlights || []).map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-semibold text-[#071A35]">
                    <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-2xl overflow-hidden border-2 border-[#D6B36A]/40 shadow-2xl">
                <img
                  src={aboutSection.imageUrl}
                  alt={aboutSection.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Leadership Card: Nidhi Sharma */}
              <div className="rounded-2xl bg-[#071A35] text-white p-7 border border-[#D6B36A]/50 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#D6B36A] text-[#071A35] flex items-center justify-center font-serif font-bold text-xl">
                      NS
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        {aboutSection.founderName || settings.contactPerson}
                      </h3>
                      <p className="text-xs text-[#F2D99B]">
                        {aboutSection.founderRole || "Primary Contact & Principal Project Lead"}
                      </p>
                    </div>
                  </div>
                  <UserCheck className="w-6 h-6 text-[#D6B36A]" />
                </div>

                <p className="text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;{aboutSection.founderMessage}&rdquo;
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D6B36A]" />
                    {settings.address}
                  </span>
                  <a
                    href={`tel:+91${settings.phone}`}
                    className="inline-flex items-center gap-1 font-bold text-[#F2D99B] hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#D6B36A]" />
                    +91 {settings.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Core Values */}
      <section className="py-20 bg-[#F6F7FA] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#071A35] text-[#F2D99B] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#071A35]">Our Mission</h3>
              <p className="text-sm text-[#172033]/85 leading-relaxed">{aboutSection.mission}</p>
            </div>

            <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#071A35] text-[#F2D99B] flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#071A35]">Our Vision</h3>
              <p className="text-sm text-[#172033]/85 leading-relaxed">{aboutSection.vision}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(aboutSection.valuesList || []).map((val, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#071A35] text-white p-6 border border-[#D6B36A]/35 space-y-2"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-[#D6B36A]">
                  0{idx + 1} • Core Value
                </span>
                <h4 className="font-serif text-xl font-bold text-[#F2D99B]">{val.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTABanner settings={settings} />
    </PublicShell>
  );
}
