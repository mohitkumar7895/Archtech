"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Expand, ArrowUpRight, Ruler } from "lucide-react";
import { Project } from "@/types";
import { useModal } from "@/hooks/useModal";

export function ProjectCard({ project }: { project: Project }) {
  const { openProjectGallery } = useModal();

  return (
    <article className="group rounded-2xl bg-white border border-slate-200/90 hover:border-[#D6B36A] overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col">
      <div className="relative h-64 w-full overflow-hidden bg-[#071A35]">
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          width={700}
          height={480}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A35] via-[#071A35]/20 to-transparent opacity-90" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-3 py-1 rounded-full bg-[#071A35]/90 border border-[#D6B36A]/50 text-[#F2D99B] text-xs font-bold">
            {project.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => openProjectGallery(project)}
          aria-label={`Open gallery lightbox for ${project.title}`}
          className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-[#071A35]/80 text-[#F2D99B] hover:bg-[#D6B36A] hover:text-[#071A35] flex items-center justify-center transition-all duration-100 cursor-pointer touch-manipulation active:scale-90"
        >
          <Expand className="w-4 h-4" />
        </button>

        <div className="absolute bottom-3 left-4 right-4 text-white flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-[#D6B36A]" />
            {project.location}
          </span>
          <span className="inline-flex items-center gap-1 text-[#F2D99B] font-semibold">
            <Ruler className="w-3.5 h-3.5 text-[#D6B36A]" />
            {project.areaSqFt}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link href={`/projects/${project.slug}`}>
            <h3 className="font-serif text-xl font-bold text-[#071A35] group-hover:text-[#B89246] transition-colors mb-2">
              {project.title}
            </h3>
          </Link>
          <p className="text-sm text-[#172033]/80 line-clamp-2 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#071A35] hover:text-[#B89246]"
          >
            <span>View Project Case Study</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => openProjectGallery(project)}
            className="text-xs font-semibold text-[#B89246] hover:underline"
          >
            Gallery ({project.galleryImages?.length || 1})
          </button>
        </div>
      </div>
    </article>
  );
}
