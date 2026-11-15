import React from "react";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BlogListingClient } from "@/components/BlogListingClient";
import { FinalCTABanner } from "@/components/HomepageClientSections";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: "Architecture, Construction Cost & Interior Design Blog | ARCH NEW ERA DESIGN",
    description:
      "Read expert articles by Nidhi Sharma and ARCH NEW ERA DESIGN (NRBL TECH) on house construction cost per sq. ft. in Delhi NCR, Vastu planning, and luxury interior trends.",
    path: "/blog",
    ogImage: settings.heroImage,
  });
}

export default async function BlogListingPage() {
  const [{ settings, services, blogs, socialLinks, seoPages }, categories] =
    await Promise.all([cmsService.getPublicBootstrapData(), db.getBlogCategories()]);

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      <section className="bg-gradient-to-r from-[#071A35] to-[#10284A] text-white py-16 border-b border-[#D6B36A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs items={[{ name: "Architecture & Construction Blog", url: "/blog" }]} />
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            KNOWLEDGE & INSIGHTS JOURNAL
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl">
            Architecture, Construction & Interior Guides
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            Practical insights on construction costs per sq. ft., Vastu layouts, structural materials, and bespoke interiors across Delhi NCR.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogListingClient blogs={blogs} categories={categories} />
        </div>
      </section>

      <FinalCTABanner settings={settings} />
    </PublicShell>
  );
}
