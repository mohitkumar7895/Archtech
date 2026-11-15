import React from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#071A35] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <span className="text-[#D6B36A] font-bold text-sm tracking-widest uppercase">
          404 – Page Not Found
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold">
          Lost in Architecture?
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          The architectural plan or page you are looking for does not exist or may have been relocated.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D6B36A] text-[#071A35] font-bold text-xs hover:bg-[#c4a159] transition shadow-lg"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" /> Explore Services
          </Link>
        </div>
      </div>
    </div>
  );
}
