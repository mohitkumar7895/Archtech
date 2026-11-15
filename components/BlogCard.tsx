import React from "react";
import Link from "next/link";
import { Calendar, Clock, User, ArrowUpRight } from "lucide-react";
import { Blog } from "@/types";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="group rounded-2xl bg-white border border-slate-200/90 hover:border-[#D6B36A] overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col">
      <Link href={`/blog/${blog.slug}`} className="relative h-52 w-full overflow-hidden bg-[#071A35] block">
        <img
          src={blog.featuredImage}
          alt={blog.imageAlt || blog.title}
          loading="lazy"
          width={600}
          height={380}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-[#071A35]/90 border border-[#D6B36A]/50 text-[#F2D99B] text-[11px] font-bold">
            {blog.category}
          </span>
        </div>
      </Link>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#D6B36A]" />
              {blog.publishDate}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D6B36A]" />
              {blog.readingTime}
            </span>
          </div>

          <Link href={`/blog/${blog.slug}`} className="block">
            <h3 className="font-serif text-xl font-bold text-[#071A35] group-hover:text-[#B89246] transition-colors line-clamp-2">
              {blog.title}
            </h3>
          </Link>

          <p className="text-sm text-[#172033]/80 line-clamp-3 leading-relaxed">
            {blog.shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
            <User className="w-3.5 h-3.5 text-[#D6B36A]" />
            {blog.author}
          </span>

          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[#071A35] hover:text-[#B89246]"
          >
            <span>Read Article</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
