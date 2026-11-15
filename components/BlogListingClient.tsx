"use client";

import React, { useState, useId } from "react";
import { Search } from "lucide-react";
import { Blog, BlogCategory } from "@/types";
import { BlogCard } from "./BlogCard";
import { EmptyState } from "./ui/EmptyState";

export function BlogListingClient({
  blogs,
  categories,
}: {
  blogs: Blog[];
  categories: BlogCategory[];
}) {
  const searchInputId = useId();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = blogs.filter((b) => {
    const matchesCat = selectedCategory === "All" || b.category === selectedCategory;
    const q = query.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.shortDescription.toLowerCase().includes(q) ||
      b.tags?.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Semantic <search> landmark per modern-web-guidance forms */}
      <search className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form
          action="/blog"
          method="GET"
          onSubmit={(e) => e.preventDefault()}
          className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="flex-1 relative">
            <label htmlFor={searchInputId} className="sr-only">
              Search architecture and construction articles
            </label>
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              id={searchInputId}
              name="q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Search articles on construction cost, Vastu, interiors..."
              className="w-full min-h-[46px] pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold uppercase tracking-wider hover:bg-[#10284A] transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === "All"
                ? "bg-[#071A35] text-[#F2D99B]"
                : "bg-[#F6F7FA] text-[#172033] hover:bg-slate-200/70"
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat.name
                  ? "bg-[#071A35] text-[#F2D99B]"
                  : "bg-[#F6F7FA] text-[#172033] hover:bg-slate-200/70"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </search>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching blog articles found"
          description="Try clearing your search filter or selecting another architectural topic."
          actionLabel="Reset Filters"
          onAction={() => {
            setQuery("");
            setSelectedCategory("All");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
