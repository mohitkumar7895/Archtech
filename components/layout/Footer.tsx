import React from "react";
import Link from "next/link";
import {
  PhoneCall,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ArrowUpRight,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { SiteSettings, Service, SocialLink, SEOPage } from "@/types";
import { formatWhatsAppUrl } from "@/lib/utils";

interface FooterProps {
  settings: SiteSettings;
  services: Service[];
  socialLinks: SocialLink[];
  seoPages?: SEOPage[];
}

export function Footer({ settings, services, socialLinks, seoPages = [] }: FooterProps) {
  const waUrl = formatWhatsAppUrl(
    settings.whatsapp,
    `Hello ${settings.contactPerson} (${settings.companyName} - ${settings.brandIdentity}), I would like to discuss my project.`
  );

  return (
    <footer className="bg-[#071A35] text-white border-t-2 border-[#D6B36A]/40">
      {/* Upper Highlight Ribbon */}
      <div className="bg-[#10284A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D6B36A] block mb-1">
              {settings.companyName} • {settings.brandIdentity}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {settings.tagline} <span className="text-[#F2D99B] font-normal text-lg block sm:inline">— {settings.supportingTagline}</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:brightness-105 transition shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp {settings.contactPerson}
            </a>
            <a
              href={`tel:+91${settings.phone}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D6B36A] text-[#071A35] font-bold text-sm hover:bg-[#F2D99B] transition"
            >
              <PhoneCall className="w-4 h-4" />
              +91 {settings.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Col 1: Brand & Overview */}
        <div className="lg:col-span-4 space-y-4">
          <Link href="/" className="inline-block">
            <img
              src={settings.logoUrl || "/logo.svg"}
              alt={`${settings.companyName} – ${settings.brandIdentity}`}
              width={230}
              height={56}
              loading="lazy"
              className="h-14 w-auto object-contain"
            />
          </Link>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D6B36A]">
            {settings.brandStatement}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">{settings.footerAbout}</p>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            {socialLinks
              .filter((s) => s.isActive)
              .map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10284A] border border-white/10 text-xs text-[#F2D99B] hover:border-[#D6B36A] transition"
                >
                  <span>{soc.platform}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              ))}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#D6B36A]">
            Quick Navigation
          </h3>
          <ul className="space-y-2.5 text-sm text-slate-300">
            <li>
              <Link href="/" className="hover:text-[#F2D99B] transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#F2D99B] transition">
                About Company
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-[#F2D99B] transition">
                All Services
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-[#F2D99B] transition">
                Construction Packages
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-[#F2D99B] transition">
                Project Portfolio
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[#F2D99B] transition">
                Architecture Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#F2D99B] transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="inline-flex items-center gap-1 text-[#D6B36A] hover:underline">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Services */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#D6B36A]">
            Core Services
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {services.slice(0, 8).map((srv) => (
              <li key={srv.id}>
                <Link href={`/services/${srv.slug}`} className="hover:text-[#F2D99B] transition flex items-center justify-between">
                  <span>{srv.name}</span>
                  <span className="text-[11px] text-[#D6B36A]">{srv.startingPrice}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact Information */}
        <div className="lg:col-span-3 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#D6B36A]">
            Head Office & Contact
          </h3>
          <div className="rounded-xl bg-[#10284A] p-4 border border-[#D6B36A]/30 space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-[#D6B36A] shrink-0 mt-1" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Primary Contact Person
                </span>
                <strong className="text-white font-semibold">{settings.contactPerson}</strong>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <PhoneCall className="w-4 h-4 text-[#D6B36A] shrink-0 mt-1" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Phone & WhatsApp
                </span>
                <a href={`tel:+91${settings.phone}`} className="text-[#F2D99B] font-bold hover:underline">
                  +91 {settings.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#D6B36A] shrink-0 mt-1" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Email Address
                </span>
                <a href={`mailto:${settings.email}`} className="text-slate-200 hover:text-[#F2D99B] break-all">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D6B36A] shrink-0 mt-1" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Office Address
                </span>
                <span className="text-slate-200">{settings.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#D6B36A] shrink-0 mt-1" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Consultation Hours
                </span>
                <span className="text-slate-300 text-xs">{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic SEO & Location Pages Links Strip */}
      {seoPages.length > 0 && (
        <div className="border-t border-white/10 bg-[#051226]/60 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[#D6B36A]">
              Service Locations & Guides:
            </span>
            {seoPages.map((sp) => (
              <Link
                key={sp.id}
                href={`${sp.routePrefix}/${sp.slug}`}
                className="hover:text-[#F2D99B] transition underline-offset-4 hover:underline"
              >
                {sp.breadcrumbTitle || sp.pageName}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-white/10 bg-[#040E1E] py-5 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{settings.copyrightText}</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="hover:text-[#F2D99B] transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#F2D99B] transition">
              Terms & Conditions
            </Link>
            <Link href="/sitemap.xml" className="hover:text-[#F2D99B] transition">
              XML Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
