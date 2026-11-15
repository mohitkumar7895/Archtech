import React from "react";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: `Terms & Conditions | ${settings.companyName} (${settings.brandIdentity})`,
    description: `Terms and Conditions for architectural, construction, and interior design services by ${settings.companyName} (${settings.brandIdentity}).`,
    path: "/terms",
  });
}

export default async function TermsPage() {
  const { settings, services, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      <section className="bg-[#071A35] text-white py-14 border-b border-[#D6B36A]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <Breadcrumbs items={[{ name: "Terms & Conditions", url: "/terms" }]} />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Terms & Conditions</h1>
          <p className="text-sm text-slate-300">
            {settings.companyName} – {settings.brandIdentity}
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#F6F7FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 sm:p-10 border border-slate-200 shadow-sm space-y-5 text-sm text-[#172033]/85 leading-relaxed">
            <h2 className="font-serif text-xl font-bold text-[#071A35]">
              1. Indicative Starting Package Rates
            </h2>
            <p>
              All package rates displayed on this website (such as Essential Home starting at ₹1,099/sq. ft., Ready-to-Move starting at ₹1,399/sq. ft., Premium Turnkey starting at ₹1,899/sq. ft., and Interior Designing starting at ₹900/sq. ft.) are indicative starting rates. Final project quotations, Bill of Quantities (BOQ), and timelines are confirmed in writing after on-site inspection, soil/plot evaluation, and final brand/material selection.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#071A35]">
              2. Architectural Drawings & Intellectual Property
            </h2>
            <p>
              All 2D floor layouts, 3D elevations, structural drawings, and interior visualizations prepared by{" "}
              <strong>{settings.companyName} ({settings.brandIdentity})</strong> remain intellectual property of the firm until formal project engagement terms are fulfilled.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#071A35]">
              3. Governing Office & Contact
            </h2>
            <p>
              <strong>Company:</strong> {settings.companyName} – {settings.brandIdentity}
              <br />
              <strong>Primary Contact Person:</strong> {settings.contactPerson}
              <br />
              <strong>Address:</strong> {settings.address}
              <br />
              <strong>Phone:</strong> +91 {settings.phone} | <strong>Email:</strong> {settings.email}
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
