"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#071A35] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <span className="text-[#D6B36A] font-bold text-sm tracking-widest uppercase">
          500 – Unexpected Error
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">
          Something went wrong
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          We encountered an issue loading this architectural section. Please try again.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D6B36A] text-[#071A35] font-bold text-xs hover:bg-[#c4a159] transition shadow-lg"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition border border-white/20"
          >
            <Home className="w-4 h-4" /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
