"use client";

import React, { useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const formId = useId();
  const [email, setEmail] = useState("manoj712009@gmail.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Invalid credentials");
        toast.error(data.error || "Login failed");
        setLoading(false);
        return;
      }
      toast.success(`Welcome back, ${data.user?.name || "Nidhi Sharma"}!`);
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setErrorMsg("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071A35] via-[#10284A] to-[#071A35] flex flex-col justify-center items-center px-4 py-12 text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <img
              src="/logo.svg"
              alt="ARCH NEW ERA DESIGN – NRBL TECH"
              width={230}
              height={56}
              className="h-14 w-auto mx-auto object-contain"
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-xs font-bold uppercase tracking-widest text-[#F2D99B]">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            ENTERPRISE CMS & CRM PORTAL
          </div>
          <h1 id={`${formId}-title`} className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Admin Dashboard Sign In
          </h1>
          <p className="text-xs text-slate-300">
            Manage website content, pricing packages, projects, SEO pages, and client leads in MySQL (`arch_tech`).
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          method="POST"
          action="/api/auth/login"
          aria-labelledby={`${formId}-title`}
          className="rounded-2xl bg-white text-[#172033] p-7 sm:p-8 shadow-2xl border-2 border-[#D6B36A]/50 space-y-5"
        >
          {errorMsg && (
            <div
              role="alert"
              aria-live="polite"
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700"
            >
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${formId}-email`}
              className="text-xs font-bold uppercase tracking-wider text-[#071A35]"
            >
              Admin Email Address <span aria-hidden="true" className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Mail
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                required
                autoComplete="username"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full min-h-[48px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${formId}-password`}
                className="text-xs font-bold uppercase tracking-wider text-[#071A35]"
              >
                Password <span aria-hidden="true" className="text-red-600">*</span>
              </label>
              {/* Accessible password unmask toggle per modern-web-guidance forms */}
              <button
                type="button"
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#071A35] hover:text-[#B89246]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            <div className="relative">
              <Lock
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id={`${formId}-password`}
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full min-h-[48px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[50px] py-3.5 px-6 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-sm tracking-wide hover:bg-[#10284A] disabled:opacity-60 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <ShieldCheck className="w-4 h-4 text-[#D6B36A]" />
            <span>{loading ? "Authenticating..." : "Sign In to Admin CMS"}</span>
          </button>

          <div className="p-3.5 rounded-xl bg-[#F6F7FA] border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-[#071A35]">Seeded Initial Admin Account:</p>
            <p>
              Email: <code className="font-mono text-[#071A35]">manoj712009@gmail.com</code>
            </p>
            <p>
              Password: <code className="font-mono text-[#071A35]">Admin@123</code>
            </p>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F2D99B] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
