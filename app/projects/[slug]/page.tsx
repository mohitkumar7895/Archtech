import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Ruler,
  UserCheck,
  ArrowLeft,
  ArrowRight,
  Layers,
} from "lucide-react";
import { db } from "@/lib/db";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await db.getProjectBySlug(params.slug);
  if (!project) {
    return buildPageMetadata({
      title: "Project Not Found",
      description: "Requested project could not be found.",
      path: `/projects/${params.slug}`,
      robotsIndex: false,
    });
  }
  return buildPageMetadata({
    title: project.seoTitle || `${project.title} | ARCH NEW ERA DESIGN`,
    description: project.metaDescription || project.shortDescription,
    path: `/projects/${project.slug}`,
    ogImage: project.coverImage,
    isPublished: project.status === "Published",
  });
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { settings, services, projects, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  const currentIndex = projects.findIndex((p) => p.slug === params.slug);
  if (currentIndex < 0) {
    notFound();
  }

  const project = projects[currentIndex];
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      {/* Hero Banner */}
      <section className="relative bg-[#071A35] text-white py-16 lg:py-24 overflow-hidden border-b border-[#D6B36A]/30">
        <div className="absolute inset-0 opacity-30">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A35] via-[#071A35]/90 to-[#071A35]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <Breadcrumbs
            items={[
              { name: "Projects", url: "/projects" },
              { name: project.title, url: `/projects/${project.slug}` },
            ]}
          />

          <span className="inline-block px-3.5 py-1 rounded-full bg-[#D6B36A] text-[#071A35] text-xs font-bold uppercase tracking-wider">
            {project.category}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-4xl">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-200 pt-1">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D6B36A]" />
              <strong>Location:</strong> {project.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-[#D6B36A]" />
              <strong>Area:</strong> {project.areaSqFt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D6B36A]" />
              <strong>Year:</strong> {project.completionDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#D6B36A]" />
              <strong>Project Lead:</strong> {project.architectLead}
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Project Case Study */}
            <div className="lg:col-span-7 space-y-8">
              <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-[420px] object-cover"
                />
                <div className="p-7 space-y-4">
                  <h2 className="font-serif text-2xl font-bold text-[#071A35]">
                    Architectural & Execution Overview
                  </h2>
                  <p className="text-base text-[#172033]/85 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Project Specifications */}
              {project.specifications?.length > 0 && (
                <div className="rounded-2xl bg-white p-7 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#071A35] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#D6B36A]" />
                    Project Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.specifications.map((spec, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#F6F7FA] border border-slate-200/80"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider text-[#B89246] block">
                          {spec.label}
                        </span>
                        <span className="text-sm font-bold text-[#071A35] mt-1 block">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Gallery */}
              {project.galleryImages?.length > 0 && (
                <div className="rounded-2xl bg-white p-7 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#071A35]">
                    Project Image Gallery
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.galleryImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${project.title} - View ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-60 object-cover rounded-xl border border-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Consultation Form */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white p-6 sm:p-7 border-2 border-[#D6B36A]/50 shadow-luxury space-y-5 sticky top-28">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                    BUILD A SIMILAR PROJECT
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#071A35] mt-1">
                    Request Cost Estimate
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Discuss this design directly with <strong>{settings.contactPerson}</strong> (+91 {settings.phone})
                  </p>
                </div>

                <ContactForm
                  defaultPackage={`Similar to ${project.title}`}
                  sourcePage={`/projects/${project.slug}`}
                  compact
                  whatsappNumber={settings.whatsapp}
                  contactPerson={settings.contactPerson}
                />
              </div>
            </div>
          </div>

          {/* Previous / Next Project Navigation */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#D6B36A] transition"
              >
                <ArrowLeft className="w-5 h-5 text-[#D6B36A]" />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Previous Project
                  </span>
                  <span className="font-serif font-bold text-[#071A35]">{prevProject.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="flex items-center justify-end gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#D6B36A] transition text-right"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Next Project
                  </span>
                  <span className="font-serif font-bold text-[#071A35]">{nextProject.title}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-[#D6B36A]" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
