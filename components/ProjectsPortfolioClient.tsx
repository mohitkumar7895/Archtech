"use client";

import React, { useState } from "react";
import { Project, GalleryItem } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "./ui/EmptyState";
import { useModal } from "@/hooks/useModal";
import { Expand, MapPin } from "lucide-react";

const CATEGORIES = [
  "All",
  "Residential Homes",
  "Luxury Interiors",
  "Construction in Progress",
  "Villas & Farmhouses",
  "Commercial Projects",
];

export function ProjectsPortfolioClient({
  projects,
  galleryItems,
}: {
  projects: Project[];
  galleryItems: GalleryItem[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { openImagePreview } = useModal();

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const filteredGallery =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((g) => g.category === activeCategory);

  return (
    <div className="space-y-16">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeCategory === cat
                ? "bg-[#071A35] text-[#F2D99B] shadow-lg border border-[#D6B36A]"
                : "bg-white text-[#172033] border border-slate-200 hover:border-[#D6B36A]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Case Studies Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title={`No projects in "${activeCategory}" yet`}
          description="Explore all project categories or add new projects from the Admin Dashboard."
          actionLabel="Show All Projects"
          onAction={() => setActiveCategory("All")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Visual Gallery Grid */}
      {filteredGallery.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
              VISUAL ARCHIVE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#071A35] mt-1">
              Architectural & Interior Execution Gallery
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  openImagePreview({
                    url: item.imageUrl,
                    title: item.title,
                    alt: item.altText,
                  })
                }
                className="group cursor-pointer relative h-64 rounded-2xl overflow-hidden bg-[#071A35] border border-slate-200 shadow-sm hover:border-[#D6B36A]"
              >
                <img
                  src={item.imageUrl}
                  alt={item.altText}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A35]/90 via-transparent to-transparent opacity-90" />
                <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#071A35]/80 text-[#F2D99B] flex items-center justify-center">
                  <Expand className="w-4 h-4" />
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D6B36A] block">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-base font-bold">{item.title}</h3>
                  {item.location && (
                    <p className="text-xs text-slate-300 inline-flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#D6B36A]" /> {item.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
