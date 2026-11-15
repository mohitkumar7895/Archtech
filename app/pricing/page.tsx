import React from "react";
import { Sparkles, CheckCircle2, Info } from "lucide-react";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PricingCard } from "@/components/PricingCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FinalCTABanner } from "@/components/HomepageClientSections";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: "Construction & Interior Designing Packages (Starting ₹900 - ₹1,899/sq.ft) | ARCH NEW ERA DESIGN",
    description:
      "Compare transparent house construction packages (Essential Home ₹1,099/sq.ft., Ready-to-Move ₹1,399/sq.ft., Premium Turnkey ₹1,899/sq.ft.) and Interior Designing starting at ₹900/sq.ft.",
    path: "/pricing",
    ogImage: settings.heroImage,
  });
}

export default async function PricingPage() {
  const { settings, services, pricingPackages, faqs, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  const constructionPkgs = pricingPackages.filter((p) => p.packageType === "Construction");
  const interiorPkgs = pricingPackages.filter((p) => p.packageType === "Interior");

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#071A35] to-[#10284A] text-white py-16 border-b border-[#D6B36A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs items={[{ name: "Pricing & Packages", url: "/pricing" }]} />
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            TRANSPARENT STAGE-WISE INVESTMENT
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl">
            Construction & Interior Designing Packages
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            All rates below are dynamically managed from our database as indicative starting rates. Final quotations are confirmed by <strong className="text-[#F2D99B]">{settings.companyName} ({settings.brandIdentity})</strong> after site evaluation.
          </p>
        </div>
      </section>

      {/* Construction Packages */}
      <section className="py-20 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
              RESIDENTIAL & TURNKEY BUILDING
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35]">
              Residential Construction Packages
            </h2>
            <p className="text-sm sm:text-base text-[#172033]/75">
              Choose the specification tier that fits your vision—from Essential Home structure to complete Turnkey luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {constructionPkgs.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          {/* Interior Designing Packages */}
          {interiorPkgs.length > 0 && (
            <div className="pt-12 space-y-8">
              <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                  CUSTOM WOODWORK, CEILING & LIGHTING
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071A35]">
                  Interior Designing Package
                </h2>
              </div>

              <div className="max-w-3xl mx-auto">
                {interiorPkgs.map((pkg) => (
                  <PricingCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            </div>
          )}

          {/* Responsive Comparison Table following modern-web-guidance responsive-table */}
          <div className="pt-10">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3
                  id="package-comparison-caption"
                  className="font-serif text-2xl font-bold text-[#071A35]"
                >
                  Quick Specification Comparison Matrix
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-[#F6F7FA] px-3 py-1.5 rounded-lg border border-slate-200">
                  <Info className="w-3.5 h-3.5 text-[#D6B36A]" />
                  All rates are indicative starting rates per sq. ft.
                </span>
              </div>

              <div
                tabIndex={0}
                role="region"
                aria-labelledby="package-comparison-caption"
                className="table-wrapper rounded-xl border border-slate-200"
              >
                <table
                  className="responsive-data-table text-left text-sm"
                  style={
                    {
                      "--label-2": '"Starting Rate"',
                      "--label-3": '"Category"',
                      "--label-4": '"Core Focus"',
                      "--label-5": '"Included Highlights"',
                    } as React.CSSProperties
                  }
                >
                  <caption className="sr-only">
                    Comparison of ARCH NEW ERA DESIGN construction and interior packages
                  </caption>
                  <thead className="bg-[#071A35] text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Package Name</th>
                      <th className="py-3.5 px-4 font-bold">Starting Rate</th>
                      <th className="py-3.5 px-4 font-bold">Type</th>
                      <th className="py-3.5 px-4 font-bold">Primary Positioning</th>
                      <th className="py-3.5 px-4 font-bold">Key Inclusions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {pricingPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-[#F6F7FA]/70">
                        <th className="py-4 px-4 font-serif font-bold text-[#071A35] bg-white">
                          {pkg.name}
                        </th>
                        <td className="py-4 px-4 font-bold text-[#B89246]">
                          {pkg.startingPrice} {pkg.priceUnit}
                        </td>
                        <td className="py-4 px-4 text-slate-700">{pkg.packageType}</td>
                        <td className="py-4 px-4 text-slate-700">{pkg.tagline}</td>
                        <td className="py-4 px-4 text-slate-700">
                          <span className="inline-flex items-center gap-1 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B36A]" />
                            {pkg.features.slice(0, 2).join(" • ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-[#071A35]">
                Pricing & Quotation FAQs
              </h2>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}

      <FinalCTABanner settings={settings} />
    </PublicShell>
  );
}
