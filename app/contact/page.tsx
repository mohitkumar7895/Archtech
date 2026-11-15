import React from "react";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildPageMetadata } from "@/lib/metadata";
import { formatWhatsAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: `Contact ${settings.contactPerson} | ${settings.companyName} (${settings.brandIdentity})`,
    description: `Contact ${settings.contactPerson} at ${settings.companyName} (${settings.brandIdentity}), ${settings.address}. Call or WhatsApp +91 ${settings.phone} or email ${settings.email}.`,
    path: "/contact",
    ogImage: settings.heroImage,
  });
}

export default async function ContactPage() {
  const { settings, services, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  const waUrl = formatWhatsAppUrl(
    settings.whatsapp,
    `Hello ${settings.contactPerson} (${settings.companyName}), I would like to book a consultation.`
  );

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
          <Breadcrumbs items={[{ name: "Contact Us", url: "/contact" }]} />
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            DIRECT ARCHITECTURAL & TURNKEY CONSULTATION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl">
            Let&rsquo;s Plan & Build Your Dream Space
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl">
            Connect directly with <strong className="text-[#F2D99B]">{settings.contactPerson}</strong> at{" "}
            <strong>{settings.companyName} – {settings.brandIdentity}</strong> in Shahdara, Delhi.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Contact Information Cards */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-2xl bg-[#071A35] text-white p-7 border border-[#D6B36A]/40 shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D6B36A]">
                    OFFICIAL HEADQUARTERS
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white mt-1">
                    {settings.companyName}
                  </h2>
                  <p className="text-xs font-bold text-[#F2D99B] tracking-widest">
                    BRAND IDENTITY: {settings.brandIdentity}
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#10284A] border border-white/10">
                    <UserCheck className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-300 block">Primary Contact Person</span>
                      <strong className="text-base text-white">{settings.contactPerson}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#10284A] border border-white/10">
                    <PhoneCall className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-300 block">Phone & WhatsApp Number</span>
                      <a
                        href={`tel:+91${settings.phone}`}
                        className="text-base font-bold text-[#F2D99B] hover:underline"
                      >
                        +91 {settings.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#10284A] border border-white/10">
                    <Mail className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-300 block">Official Email</span>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-sm font-semibold text-white hover:text-[#F2D99B] break-all"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#10284A] border border-white/10">
                    <MapPin className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-300 block">Business Address</span>
                      <span className="text-sm text-white">{settings.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#10284A] border border-white/10">
                    <Clock className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-300 block">Consultation Timings</span>
                      <span className="text-sm text-white">{settings.workingHours}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-xl bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-105 transition shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat Directly with {settings.contactPerson} on WhatsApp
                </a>
              </div>
            </div>

            {/* Right Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-white p-7 sm:p-10 border border-slate-200 shadow-luxury space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                    ONLINE ENQUIRY & COST ESTIMATION
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#071A35] mt-1">
                    Submit Your Project Requirements
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Share your plot location, approximate square footage, and service needed. All enquiries are stored directly in our CRM for priority follow-up.
                  </p>
                </div>

                <ContactForm
                  sourcePage="/contact"
                  whatsappNumber={settings.whatsapp}
                  contactPerson={settings.contactPerson}
                />
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          {settings.googleMapsEmbedUrl && (
            <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm h-96">
              <iframe
                src={settings.googleMapsEmbedUrl}
                title={`${settings.companyName} Office Location Map`}
                width="100%"
                height="100%"
                loading="lazy"
                className="border-0 w-full h-full"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
