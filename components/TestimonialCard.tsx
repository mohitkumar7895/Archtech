import React from "react";
import { Star, Quote, MapPin } from "lucide-react";
import { Testimonial } from "@/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm hover:border-[#D6B36A] transition flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1" aria-label={`Rated ${testimonial.rating} out of 5 stars`}>
            {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#D6B36A] text-[#D6B36A]" aria-hidden="true" />
            ))}
          </div>
          <Quote className="w-7 h-7 text-[#D6B36A]/30" aria-hidden="true" />
        </div>

        <p className="text-sm text-[#172033]/85 leading-relaxed italic">
          &ldquo;{testimonial.content}&rdquo;
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <h4 className="font-serif font-bold text-[#071A35] text-base">
            {testimonial.clientName}
          </h4>
          <p className="text-xs text-slate-500">{testimonial.clientRole}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B89246] bg-[#FBF6EA] px-2.5 py-1 rounded-full">
          <MapPin className="w-3 h-3" />
          {testimonial.location}
        </span>
      </div>
    </div>
  );
}
