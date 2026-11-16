import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Database,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  HelpCircle,
  Building2,
  UserCheck,
  Globe,
  ArrowRight,
} from "lucide-react";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await cmsService.getPublicBootstrapData();
  return buildPageMetadata({
    title: `Privacy Policy | ${settings.companyName} (${settings.brandIdentity})`,
    description: `Official Privacy & Data Protection Policy for ${settings.companyName} (${settings.brandIdentity}) led by ${settings.contactPerson}. Learn how we protect client information, project data, and design enquiries across Delhi NCR.`,
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicyPage() {
  const { settings, services, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  const sections = [
    { id: "overview", title: "1. Overview & Commitment" },
    { id: "data-controller", title: "2. Data Controller Details" },
    { id: "information-collected", title: "3. Information We Collect" },
    { id: "how-we-use", title: "4. Purpose & Use of Data" },
    { id: "legal-basis", title: "5. Legal Basis for Processing" },
    { id: "data-sharing", title: "6. Data Sharing & Confidentiality" },
    { id: "data-security", title: "7. Security Safeguards" },
    { id: "cookies", title: "8. Cookies & Tracking Technologies" },
    { id: "user-rights", title: "9. Your Rights & Choices" },
    { id: "retention", title: "10. Data Retention Period" },
    { id: "grievance", title: "11. Grievance Officer & Contact" },
  ];

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#071A35] via-[#0D254C] to-[#071A35] text-white py-16 sm:py-20 border-b border-[#D6B36A]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#D6B36A]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-4">
          <Breadcrumbs items={[{ name: "Privacy Policy", url: "/privacy-policy" }]} />
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-wider text-[#F2D99B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B36A]" />
              Official Legal Policy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-xs font-medium text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#D6B36A]" />
              Effective: November 2026
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl leading-tight">
            Privacy & Data Protection Policy
          </h1>
          <p className="text-base sm:text-lg text-[#F2D99B] max-w-3xl leading-relaxed">
            Your trust is our highest foundation. Learn how{" "}
            <strong>{settings.companyName} ({settings.brandIdentity})</strong>, led by{" "}
            <strong>{settings.contactPerson}</strong>, responsibly collects, protects, and handles your information across architectural, construction, and turnkey interior design engagements.
          </p>
        </div>
      </section>

      {/* Main Body */}
      <section className="py-14 sm:py-20 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Sticky Navigation on Desktop */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#071A35] flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <FileText className="w-5 h-5 text-[#D6B36A]" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-1 text-sm">
                    {sections.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#071A35] hover:bg-[#F6F7FA] font-medium transition"
                      >
                        {sec.title}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Direct Contact Card in Sidebar */}
                <div className="bg-gradient-to-br from-[#071A35] to-[#10284A] text-white rounded-2xl p-6 border border-[#D6B36A]/30 shadow-md space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F2D99B]">
                    Direct Support
                  </span>
                  <h4 className="font-serif text-lg font-bold text-white">
                    Have privacy concerns?
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Contact {settings.contactPerson} directly for any data inquiries or clarification.
                  </p>
                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                    <a
                      href={`tel:+91${settings.phone}`}
                      className="flex items-center gap-2 text-slate-200 hover:text-[#F2D99B] transition"
                    >
                      <Phone className="w-4 h-4 text-[#D6B36A]" />
                      +91 {settings.phone}
                    </a>
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-center gap-2 text-slate-200 hover:text-[#F2D99B] transition"
                    >
                      <Mail className="w-4 h-4 text-[#D6B36A]" />
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Detailed Clauses */}
            <main className="lg:col-span-8 space-y-8">
              {/* Section 1 */}
              <article
                id="overview"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    1. Overview & Commitment
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    Welcome to <strong>{settings.companyName} ({settings.brandIdentity})</strong>. We are committed to safeguarding the privacy and personal data of every individual who visits our official website (<code>https://archtech-woad.vercel.app</code>), utilizes our construction cost estimator, requests 2D/3D design consultations, or engages our architectural, turnkey construction, and luxury interior design services across Delhi NCR.
                  </p>
                  <p>
                    This Privacy Policy outlines how your personal and property information is collected, stored, processed, and safeguarded under Indian data protection standards, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act (DPDPA).
                  </p>
                </div>
              </article>

              {/* Section 2 */}
              <article
                id="data-controller"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    2. Data Controller Information
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    The entity responsible for the custody, processing, and protection of your data is:
                  </p>
                  <div className="p-4 rounded-xl bg-[#F6F7FA] border border-slate-200 text-sm space-y-2 text-[#071A35]">
                    <p><strong>Firm Name:</strong> {settings.companyName} ({settings.brandIdentity})</p>
                    <p><strong>Principal Architect / Director:</strong> {settings.contactPerson}</p>
                    <p><strong>Head Office:</strong> {settings.address}</p>
                    <p><strong>Official Phone / WhatsApp:</strong> +91 {settings.phone}</p>
                    <p><strong>Official Email:</strong> {settings.email}</p>
                    <p><strong>Official Domain:</strong> https://archtech-woad.vercel.app</p>
                  </div>
                </div>
              </article>

              {/* Section 3 */}
              <article
                id="information-collected"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    3. Information We Collect
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 pt-2">
                  <p>
                    We collect only the essential information needed to provide premium architectural, structural, and construction solutions:
                  </p>
                  <ul className="space-y-3 pl-2">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Contact Details:</strong> Full name, phone/mobile number, active WhatsApp contact, and email address when you submit consultation requests or contact inquiries.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Property & Project Specifications:</strong> Plot or site address, city/neighborhood in Delhi NCR, built-up area (in sq. ft. or sq. yards), floor requirements (G+1, G+2, etc.), desired architectural style, and preferred service package.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Cost Estimator Inputs:</strong> Selected construction tier (Essential, Ready-to-Move, Luxury Turnkey, or Custom Interior), estimated plot size, and finishing selections entered into our interactive estimation tool.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Technical Device Information:</strong> Browser type, operating system, IP address, referral URL, and timestamps captured through automated server access logs for cybersecurity and platform optimization.
                      </span>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Section 4 */}
              <article
                id="how-we-use"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    4. Purpose & Use of Data
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 pt-2">
                  <p>
                    Your data is strictly utilized to deliver precision architectural planning and turnkey execution:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#F6F7FA] border border-slate-100">
                      <h4 className="font-bold text-[#071A35] text-sm mb-1">
                        Site Inspection & Consultations
                      </h4>
                      <p className="text-xs text-slate-500">
                        To schedule physical site assessments, soil reviews, and architectural alignment meetings across Delhi NCR.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F6F7FA] border border-slate-100">
                      <h4 className="font-bold text-[#071A35] text-sm mb-1">
                        BOQ & Quotation Preparation
                      </h4>
                      <p className="text-xs text-slate-500">
                        To calculate transparent Bill of Quantities (BOQ), material specifications, and structural estimates.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F6F7FA] border border-slate-100">
                      <h4 className="font-bold text-[#071A35] text-sm mb-1">
                        Milestone Project Updates
                      </h4>
                      <p className="text-xs text-slate-500">
                        To send CAD drawing revisions, site progress photography, and stage-wise completion reports via WhatsApp and email.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F6F7FA] border border-slate-100">
                      <h4 className="font-bold text-[#071A35] text-sm mb-1">
                        Zero Marketing Spam Policy
                      </h4>
                      <p className="text-xs text-slate-500">
                        We NEVER sell, trade, or monetize your contact information to third-party telemarketing or advertising networks.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 5 */}
              <article
                id="legal-basis"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    5. Legal Basis for Processing
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    We process your personal information under the following recognized legal grounds:
                  </p>
                  <p>
                    <strong>Consent:</strong> When you voluntarily submit consultation forms, WhatsApp enquiries, or cost estimator inquiries on our website.
                  </p>
                  <p>
                    <strong>Contractual Necessity:</strong> To fulfill architectural drafting, structural design, material procurement, and construction contracting agreements signed between you and {settings.companyName}.
                  </p>
                  <p>
                    <strong>Legal Compliance:</strong> To maintain GST invoicing, statutory municipal building compliance, and commercial records required by Indian law.
                  </p>
                </div>
              </article>

              {/* Section 6 */}
              <article
                id="data-sharing"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    6. Data Sharing & Confidentiality
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    We maintain strict confidentiality regarding all client floor plans, site elevations, and financial figures:
                  </p>
                  <ul className="space-y-2.5 pl-2">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Authorized Project Personnel Only:</strong> Shared exclusively with certified structural engineers, site project managers, and authorized construction crew working on your specific site.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Statutory Authorities:</strong> Disclosed only if mandated by court summons, municipal authorities (MCD, DDA, etc.), or tax regulators under statutory jurisdiction.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
                      <span>
                        <strong>No Commercial Sale:</strong> We never share or sell personal information to telemarketers or third-party brokers.
                      </span>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Section 7 */}
              <article
                id="data-security"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    7. Security Safeguards
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    We employ industry-standard administrative, physical, and digital safeguards:
                  </p>
                  <p>
                    <strong>SSL/TLS Encryption:</strong> All data transmitted between your web browser and our servers is protected by modern 256-bit encryption.
                  </p>
                  <p>
                    <strong>Access Control:</strong> Administrative access to client inquiries and project databases is restricted to authorized management personnel via secure JWT-authenticated portals.
                  </p>
                </div>
              </article>

              {/* Section 8 */}
              <article
                id="cookies"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    8. Cookies & Tracking Technologies
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    Our website uses standard essential cookies to deliver responsive navigation, remember user session state, and preserve cost estimator values during your browsing session.
                  </p>
                  <p>
                    You have complete control to adjust cookie preferences or disable them entirely via your web browser settings without impacting basic site reading capabilities.
                  </p>
                </div>
              </article>

              {/* Section 9 */}
              <article
                id="user-rights"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    9. Your Rights & Choices
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    As a client or website visitor, you retain full rights regarding your data:
                  </p>
                  <ul className="space-y-2 pl-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-1" />
                      <span><strong>Right of Access:</strong> Request a summary of personal information we maintain.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-1" />
                      <span><strong>Right of Correction:</strong> Update or rectify outdated phone numbers, email, or site addresses.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-1" />
                      <span><strong>Right of Erasure:</strong> Request deletion of inquiry data, subject to statutory tax and warranty obligations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-1" />
                      <span><strong>Right to Opt-Out:</strong> Stop receiving project alerts or promotional newsletters at any time.</span>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Section 10 */}
              <article
                id="retention"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    10. Data Retention Period
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-2">
                  <p>
                    General consultation inquiries that do not materialize into projects are archived or deleted after 180 days. For commissioned turnkey construction projects, architectural CAD drawings, structural calculations, and BOQ contracts are archived for up to 10 years to support ongoing structural warranty verification and client reference.
                  </p>
                </div>
              </article>

              {/* Section 11 */}
              <article
                id="grievance"
                className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200/80 shadow-sm space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#071A35]/5 flex items-center justify-center text-[#D6B36A]">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#071A35]">
                    11. Grievance Officer & Contact
                  </h2>
                </div>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3">
                  <p>
                    In accordance with the Information Technology Act, 2000 and rules made thereunder, questions or grievances regarding this policy may be directed to our designated officer:
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#071A35] text-white border border-[#D6B36A]/40 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#D6B36A]/20 flex items-center justify-center border border-[#D6B36A]/40 text-[#F2D99B] font-bold text-lg">
                      MK
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">
                        {settings.contactPerson}
                      </h4>
                      <p className="text-xs text-[#F2D99B]">
                        Principal Director & Grievance Officer
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs text-slate-300">
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium">Firm:</p>
                      <p className="font-semibold text-white">
                        {settings.companyName} ({settings.brandIdentity})
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium">Head Office:</p>
                      <p className="text-white">{settings.address}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium">Direct Telephone:</p>
                      <a
                        href={`tel:+91${settings.phone}`}
                        className="text-[#F2D99B] hover:underline font-semibold block"
                      >
                        +91 {settings.phone}
                      </a>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 font-medium">Official Email:</p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-[#F2D99B] hover:underline font-semibold block"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/91${settings.whatsapp}?text=Hello%20${encodeURIComponent(
                        settings.contactPerson
                      )},%20I%20have%20a%20query%20regarding%20your%20Privacy%20Policy`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white font-medium text-xs hover:bg-[#20bd5a] transition shadow-sm"
                    >
                      Chat on WhatsApp
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/20 transition"
                    >
                      Visit Contact Page
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
