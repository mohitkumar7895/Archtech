import React from "react";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProjectsPortfolioClient } from "@/components/ProjectsPortfolioClient";
import { FinalCTABanner } from "@/components/HomepageClientSections";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: "Architecture, Construction & Interior Project Portfolio | ARCH NEW ERA DESIGN",
    description:
      "Explore completed and ongoing Residential Homes, Luxury Interiors, Construction in Progress, Villas & Farmhouses, and Commercial Projects by ARCH NEW ERA DESIGN (NRBL TECH).",
    path: "/projects",
    ogImage: settings.heroImage,
  });
}

export default async function ProjectsPage() {
  const [{ settings, services, projects, socialLinks, seoPages }, galleryItems] =
    await Promise.all([cmsService.getPublicBootstrapData(), db.getGallery()]);

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      <section className="bg-gradient-to-r from-[#071A35] to-[#10284A] text-white py-16 border-b border-[#D6B36A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs items={[{ name: "Project Portfolio", url: "/projects" }]} />
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            ARCHITECTURAL & TURNKEY PORTFOLIO
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl">
            Signature Projects & Active Sites
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            Filter across Residential Homes, Luxury Interiors, Construction in Progress, Villas & Farmhouses, and Commercial Projects.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectsPortfolioClient projects={projects} galleryItems={galleryItems} />
        </div>
      </section>

      <FinalCTABanner settings={settings} />
    </PublicShell>
  );
}
