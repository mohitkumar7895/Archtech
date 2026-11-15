import React from "react";
import { Compass } from "lucide-react";

export function EmptyState({
  title = "No items found",
  description = "Check back soon or adjust your filters to explore more architectural content.",
  actionLabel,
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D6B36A]/50 bg-white/90 p-12 text-center max-w-xl mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#071A35] text-[#D6B36A] flex items-center justify-center mx-auto mb-4 shadow-md">
        <Compass className="w-7 h-7" />
      </div>
      <h3 className="font-serif text-xl font-bold text-[#071A35] mb-2">{title}</h3>
      <p className="text-sm text-[#172033]/75 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#071A35] text-[#F2D99B] font-semibold text-sm hover:bg-[#10284A] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
