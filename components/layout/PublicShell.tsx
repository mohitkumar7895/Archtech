import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { GlobalModals } from "@/components/modals/GlobalModals";
import { SiteSettings, Service, SocialLink, SEOPage } from "@/types";
import { generateOrganizationSchema } from "@/lib/seo";

export function PublicShell({
  settings,
  services,
  socialLinks,
  seoPages,
  children,
}: {
  settings: SiteSettings;
  services: Service[];
  socialLinks: SocialLink[];
  seoPages?: SEOPage[];
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema(settings);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7FA] text-[#172033]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Navbar settings={settings} services={services} />
      <main className="flex-1">{children}</main>
      <Footer
        settings={settings}
        services={services}
        socialLinks={socialLinks}
        seoPages={seoPages}
      />
      <WhatsAppButton
        whatsappNumber={settings.whatsapp}
        contactPerson={settings.contactPerson}
      />
      <GlobalModals
        whatsappNumber={settings.whatsapp}
        contactPerson={settings.contactPerson}
      />
    </div>
  );
}
