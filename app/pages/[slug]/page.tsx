import React from "react";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { FAQAccordion } from "@/components/FAQAccordion";
import { generateLocalBusinessSchemaForSEOPage, generateFAQSchema } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await db.getSEOPageBySlug(params.slug);
  if (!page) {
    return buildPageMetadata({
      title: "Page Not Found",
      description: "Requested page could not be found.",
      path: `/pages/${params.slug}`,
      robotsIndex: false,
    });
  }

  return buildPageMetadata({
    title: page.metaTitle || page.pageName,
    description: page.metaDescription,
    path: `/pages/${page.slug}`,
    canonicalUrl: page.canonicalUrl,
    ogTitle: page.ogTitle || page.metaTitle,
    ogDescription: page.ogDescription || page.metaDescription,
    ogImage: page.ogImage || page.featuredImage,
    keywords: [page.focusKeyword, ...(page.secondaryKeywords || [])].filter(Boolean),
    robotsIndex: page.robotsIndex,
    robotsFollow: page.robotsFollow,
    isPublished: page.status === "Published",
  });
}

export default async function DynamicLandingSEOPage({ params }: { params: { slug: string } }) {
  const page = await db.getSEOPageBySlug(params.slug);
  if (!page || page.status !== "Published") {
    notFound();
  }

  const { settings, services, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  const schema = generateLocalBusinessSchemaForSEOPage(page, settings);
  const faqSchema = generateFAQSchema(page.faqContent || []);

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section className="bg-gradient-to-r from-[#071A35] to-[#10284A] text-white py-16 border-b border-[#D6B36A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs
            items={[{ name: page.breadcrumbTitle || page.pageName, url: `/pages/${page.slug}` }]}
          />
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            {settings.companyName} • {settings.brandIdentity}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl leading-tight">
            {page.h1Heading || page.pageName}
          </h1>
          <p className="text-base text-slate-300 max-w-3xl">{page.metaDescription}</p>
        </div>
      </section>

      <section className="py-16 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8">
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                {page.featuredImage && (
                  <img
                    src={page.featuredImage}
                    alt={page.imageAltText || page.h1Heading}
                    className="w-full h-80 object-cover"
                  />
                )}
                <div className="p-7 sm:p-9">
                  <div
                    className="prose-arch text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: page.pageContent }}
                  />
                </div>
              </div>

              {page.faqContent?.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-bold text-[#071A35]">
                    Frequently Asked Questions
                  </h2>
                  <FAQAccordion faqs={page.faqContent} />
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white p-7 border-2 border-[#D6B36A]/50 shadow-luxury space-y-5 sticky top-28">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                  DIRECT CONSULTATION
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#071A35]">
                  Speak with {settings.contactPerson}
                </h2>
                <ContactForm
                  sourcePage={`/pages/${page.slug}`}
                  compact
                  whatsappNumber={settings.whatsapp}
                  contactPerson={settings.contactPerson}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
