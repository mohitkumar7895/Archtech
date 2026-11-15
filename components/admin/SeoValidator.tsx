"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { validateSEOPageInput } from "@/lib/validations";

interface SeoValidatorProps {
  page: {
    metaTitle?: string;
    metaDescription?: string;
    h1Heading?: string;
    featuredImage?: string;
    imageAltText?: string;
    slug?: string;
    canonicalUrl?: string;
  };
  existingSlugs?: string[];
}

export function SeoValidator({ page, existingSlugs = [] }: SeoValidatorProps) {
  const warnings = validateSEOPageInput(page, existingSlugs);
  const score = Math.max(0, 100 - warnings.length * 15);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {warnings.length === 0 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-[#071A35] dark:text-white">
            Live On-Page SEO Audit & Validation
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            score >= 85
              ? "bg-emerald-100 text-emerald-800"
              : score >= 55
              ? "bg-amber-100 text-amber-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          SEO Readiness: {score}%
        </span>
      </div>

      {warnings.length === 0 ? (
        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
          All required SEO fields (Meta Title, Meta Description, H1 Heading, Featured Image, Image Alt Text, Unique Slug, and Canonical URL) are properly configured!
        </p>
      ) : (
        <ul className="space-y-1.5">
          {warnings.map((w, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-2 text-xs p-2 rounded-lg ${
                w.severity === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {w.severity === "error" ? (
                <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              )}
              <span>{w.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
