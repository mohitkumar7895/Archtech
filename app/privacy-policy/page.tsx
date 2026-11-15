import React from "react";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: `Privacy Policy | ${settings.companyName} (${settings.brandIdentity})`,
    description: `Privacy Policy for ${settings.companyName} – ${settings.brandIdentity}, located at ${settings.address}.`,
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicyPage() {
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
          <Breadcrumbs items={[{ name: "Privacy Policy", url: "/privacy-policy" }]} />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-slate-300">
            {settings.companyName} – {settings.brandIdentity}
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#F6F7FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 sm:p-10 border border-slate-200 shadow-sm space-y-5 text-sm text-[#172033]/85 leading-relaxed">
            <h2 className="font-serif text-xl font-bold text-[#071A35]">
              1. Information We Collect
            </h2>
            <p>
              When you submit a consultation or cost estimation form on the{" "}
              <strong>{settings.companyName} ({settings.brandIdentity})</strong> website, we collect your name, phone/WhatsApp number, email address, property location, approximate square footage, and service requirements so that{" "}
              <strong>{settings.contactPerson}</strong> and our architectural team can respond to your enquiry.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#071A35]">
              2. How We Use Your Information
            </h2>
            <p>
              Your contact information is used strictly to provide architectural consultations, site visits, Bill of Quantities (BOQ) quotations, and project updates. We never sell or rent client data to third-party marketers.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#071A35]">
              3. Contact Details for Privacy Queries
            </h2>
            <p>
              <strong>Company:</strong> {settings.companyName} – {settings.brandIdentity}
              <br />
              <strong>Primary Contact:</strong> {settings.contactPerson}
              <br />
              <strong>Phone / WhatsApp:</strong> +91 {settings.phone}
              <br />
              <strong>Email:</strong> {settings.email}
              <br />
              <strong>Address:</strong> {settings.address}
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
