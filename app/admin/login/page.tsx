"use client";

import React, { useState, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const formId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEmailReadOnly, setIsEmailReadOnly] = useState(true);
  const [isPasswordReadOnly, setIsPasswordReadOnly] = useState(true);

  // Strictly enforce empty initial inputs to prevent aggressive browser autofill
  useEffect(() => {
    setEmail("");
    setPassword("");
    const timer = setTimeout(() => {
      setEmail("");
      setPassword("");
    }, 150);
    return () => clearTimeout(timer);
  }, []);

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
      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("arch_tech_admin_token", data.token);
      }
      toast.success(`Welcome back, ${data.user?.name || "Manoj Kumar Sharma"}!`);
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
        </div>

        <form
          onSubmit={handleLogin}
          autoComplete="off"
          aria-labelledby={`${formId}-title`}
          className="rounded-2xl bg-white text-[#172033] p-7 sm:p-8 shadow-2xl border-2 border-[#D6B36A]/50 space-y-5"
        >
          {/* Decoy traps to absorb browser password managers / Chrome autofill heuristics */}
          <div className="sr-only opacity-0 pointer-events-none absolute -left-[9999px]" aria-hidden="true">
            <input type="text" name="fake_username_trap" tabIndex={-1} autoComplete="off" />
            <input type="password" name="fake_password_trap" tabIndex={-1} autoComplete="off" />
          </div>

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
                name="admin_login_account"
                type="email"
                required
                readOnly={isEmailReadOnly}
                onFocus={() => setIsEmailReadOnly(false)}
                onClick={() => setIsEmailReadOnly(false)}
                placeholder="Enter admin email address"
                autoComplete="new-password"
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
                name="admin_login_secret"
                type={showPassword ? "text" : "password"}
                required
                readOnly={isPasswordReadOnly}
                onFocus={() => setIsPasswordReadOnly(false)}
                onClick={() => setIsPasswordReadOnly(false)}
                placeholder="Enter admin password"
                autoComplete="new-password"
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
