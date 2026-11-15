import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, PhoneCall, MessageCircle, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ServiceGallery } from "@/components/ServiceGallery";
import { generateServiceSchema, generateFAQSchema } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/metadata";
import { formatWhatsAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await db.getServiceBySlug(params.slug);
  if (!service) {
    return buildPageMetadata({
      title: "Service Not Found",
      description: "Requested service could not be found.",
      path: `/services/${params.slug}`,
      robotsIndex: false,
    });
  }
  return buildPageMetadata({
    title: service.seoTitle || `${service.name} | ARCH NEW ERA DESIGN`,
    description: service.metaDescription || service.shortDescription,
    path: `/services/${service.slug}`,
    ogImage: service.featuredImage,
    isPublished: service.status === "Published",
  });
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await db.getServiceBySlug(params.slug);
  if (!service || service.status !== "Published") {
    notFound();
  }

  const { settings, services, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  const serviceSchema = generateServiceSchema(service, settings);
  const faqSchema = generateFAQSchema(service.faqs || []);
  const waUrl = formatWhatsAppUrl(
    settings.whatsapp,
    `Hello ${settings.contactPerson} (${settings.companyName}), I would like a consultation for ${service.name}.`
  );

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero Banner */}
      <section className="relative bg-[#071A35] text-white py-16 lg:py-24 overflow-hidden border-b border-[#D6B36A]/30">
        <div className="absolute inset-0 opacity-25">
          <img
            src={service.featuredImage}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A35] via-[#071A35]/90 to-[#071A35]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <Breadcrumbs
            items={[
              { name: "Services", url: "/services" },
              { name: service.name, url: `/services/${service.slug}` },
            ]}
          />

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-[#D6B36A] text-[#071A35] text-xs font-bold uppercase tracking-wider">
              {service.category}
            </span>
            {service.startingPrice && (
              <span className="px-3.5 py-1 rounded-full bg-[#10284A] border border-[#D6B36A]/50 text-[#F2D99B] text-xs font-bold">
                Indicative Starting Rate: {service.startingPrice}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl">
            {service.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-3xl leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* Main Content + Enquiry Sidebar */}
      <section className="py-16 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Details */}
            <div className="lg:col-span-7 space-y-8">
              <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                <img
                  src={service.featuredImage}
                  alt={service.name}
                  className="w-full h-56 sm:h-80 md:h-[380px] object-cover"
                />
                <div className="p-5 sm:p-7 space-y-5">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#071A35]">
                    Comprehensive {service.name} by {settings.companyName}
                  </h2>
                  <div className="text-base text-[#172033]/85 leading-relaxed whitespace-pre-line">
                    {service.fullDescription}
                  </div>
                </div>
              </div>

              {/* Service Features */}
              {service.features?.length > 0 && (
                <div className="rounded-2xl bg-white p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#071A35]">
                    Key Scope & Deliverables
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {service.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F6F7FA] border border-slate-200/80"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-[#172033]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Gallery */}
              {service.gallery && service.gallery.length > 0 && (
                <ServiceGallery images={service.gallery} serviceName={service.name} />
              )}

              {/* Service FAQs */}
              {service.faqs?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#071A35]">
                    Frequently Asked Questions About {service.name}
                  </h3>
                  <FAQAccordion faqs={service.faqs} />
                </div>
              )}
            </div>

            {/* Right Sticky Consultation Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl bg-white p-6 sm:p-7 border-2 border-[#D6B36A]/50 shadow-luxury space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                    GET FREE CONSULTATION & BOQ
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#071A35] mt-1">
                    Enquire About {service.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Direct consultation with <strong>{settings.contactPerson}</strong> (+91 {settings.phone})
                  </p>
                </div>

                <ContactForm
                  defaultService={service.name}
                  sourcePage={`/services/${service.slug}`}
                  compact
                  whatsappNumber={settings.whatsapp}
                  contactPerson={settings.contactPerson}
                />

                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:brightness-105 transition"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp {settings.contactPerson}
                  </a>
                  <a
                    href={`tel:+91${settings.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs hover:bg-[#10284A] transition"
                  >
                    <PhoneCall className="w-4 h-4 text-[#D6B36A]" /> Call Now
                  </a>
                </div>
              </div>

              {/* Other Services List */}
              <div className="rounded-2xl bg-[#071A35] text-white p-6 border border-[#D6B36A]/35 space-y-3">
                <h4 className="font-serif text-lg font-bold text-[#F2D99B]">
                  Explore Other Services
                </h4>
                <ul className="space-y-2 text-sm">
                  {services
                    .filter((s) => s.slug !== service.slug)
                    .slice(0, 7)
                    .map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#10284A] text-slate-200 hover:text-[#F2D99B] transition"
                        >
                          <span>{s.name}</span>
                          <ArrowRight className="w-4 h-4 text-[#D6B36A]" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
