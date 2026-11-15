import React from "react";
import { Sparkles } from "lucide-react";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ServiceCard } from "@/components/ServiceCard";
import { FinalCTABanner } from "@/components/HomepageClientSections";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: "Architecture, Construction & Interior Designing Services | ARCH NEW ERA DESIGN",
    description:
      "Explore all 12 services offered by ARCH NEW ERA DESIGN (NRBL TECH) in Shahdara, Delhi: Architecture & Planning, Home Construction, Modular Kitchen, Bedroom/Living/Office Interiors, and Turnkey Construction.",
    path: "/services",
    ogImage: settings.heroImage,
  });
}

export default async function ServicesPage() {
  const { settings, services, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      <section className="bg-gradient-to-r from-[#071A35] to-[#10284A] text-white py-16 border-b border-[#D6B36A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs items={[{ name: "Our Services", url: "/services" }]} />
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            END-TO-END ARCHITECTURAL & TURNKEY SOLUTIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl">
            Our Architecture, Construction & Interior Services
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl">
            Every service is personally supervised by <strong className="text-[#F2D99B]">{settings.contactPerson}</strong> and our civil & interior engineering team across Delhi NCR.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <FinalCTABanner settings={settings} />
    </PublicShell>
  );
}
