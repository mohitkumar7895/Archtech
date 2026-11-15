import React from "react";

export function LoadingSpinner({
  label = "Loading architectural data...",
  size = "md",
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-12 h-12" : "w-8 h-8";
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3" role="status" aria-live="polite">
      <div
        className={`${dim} rounded-full border-2 border-[#071A35]/20 border-t-[#D6B36A] animate-spin`}
        aria-hidden="true"
      />
      {label && <p className="text-sm font-medium text-[#172033]/70">{label}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm animate-pulse space-y-4">
      <div className="h-48 w-full rounded-xl bg-slate-200" />
      <div className="h-4 w-1/3 rounded bg-slate-200" />
      <div className="h-6 w-3/4 rounded bg-slate-200" />
      <div className="h-4 w-full rounded bg-slate-200" />
      <div className="h-10 w-36 rounded-lg bg-slate-200" />
    </div>
  );
}
