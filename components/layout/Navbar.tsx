"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PhoneCall,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { SiteSettings, Service } from "@/types";
import { useModal } from "@/hooks/useModal";

interface NavbarProps {
  settings: SiteSettings;
  services: Service[];
}

export function Navbar({ settings, services }: NavbarProps) {
  const pathname = usePathname();
  const { openConsultationModal } = useModal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services", hasDropdown: true },
    { label: "Projects", href: "/projects" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#071A35] text-white shadow-xl border-b border-[#D6B36A]/25">
      {/* Top Executive Information Bar */}
      <div className="bg-[#051226] border-b border-white/10 text-xs py-1.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-slate-300 min-w-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 font-medium text-[#F2D99B] truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" aria-hidden="true" />
              {settings.brandStatement}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" aria-hidden="true" />
              {settings.address}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto shrink-0">
            <span className="hidden sm:inline-block text-slate-300">
              Primary Contact: <strong className="text-[#F2D99B]">{settings.contactPerson}</strong>
            </span>
            <a
              href={`tel:+91${settings.phone}`}
              className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#F2D99B] transition text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D6B36A]" aria-hidden="true" />
              +91 {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="hidden lg:inline-flex items-center gap-1.5 text-slate-300 hover:text-[#F2D99B] transition text-xs"
            >
              <Mail className="w-3.5 h-3.5 text-[#D6B36A]" aria-hidden="true" />
              {settings.email}
            </a>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/10 text-[#F2D99B] hover:bg-[#D6B36A] hover:text-[#071A35] font-semibold transition text-[11px]"
            >
              <ShieldCheck className="w-3 h-3" aria-hidden="true" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label={settings.companyName}>
          <img
            src={settings.logoUrl || "/logo.svg"}
            alt={`${settings.companyName} – ${settings.brandIdentity}`}
            width={220}
            height={54}
            className="h-10 sm:h-14 w-auto object-contain max-w-[150px] sm:max-w-none"
          />
        </Link>

        {/* Primary Desktop Navigation */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.hasDropdown) {
                return (
                  <li
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls="desktop-services-submenu"
                      onClick={() => setServicesOpen((prev) => !prev)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                        active
                          ? "text-[#F2D99B] bg-white/10 border-b-2 border-[#D6B36A]"
                          : "text-slate-200 hover:text-[#F2D99B] hover:bg-white/5"
                      }`}
                    >
                      <span>Services</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180 text-[#D6B36A]" : ""}`}
                        aria-hidden="true"
                      />
                    </button>

                    {/* Mega Dropdown Menu */}
                    <div
                      id="desktop-services-submenu"
                      hidden={!servicesOpen}
                      className="absolute left-0 top-full pt-2 w-[560px] z-50"
                    >
                      <div className="rounded-2xl bg-[#071A35] border border-[#D6B36A]/40 shadow-2xl p-5 grid grid-cols-2 gap-2.5">
                        <div className="col-span-2 pb-2.5 mb-1 border-b border-white/10 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#D6B36A]">
                            Architecture, Construction & Interiors
                          </span>
                          <Link
                            href="/services"
                            onClick={() => setServicesOpen(false)}
                            className="text-xs font-semibold text-[#F2D99B] hover:underline inline-flex items-center gap-1"
                          >
                            View All 12 Services <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        {services.slice(0, 12).map((srv) => (
                          <Link
                            key={srv.id}
                            href={`/services/${srv.slug}`}
                            onClick={() => setServicesOpen(false)}
                            className="group flex items-start justify-between p-2.5 rounded-xl hover:bg-[#10284A] border border-transparent hover:border-[#D6B36A]/30 transition"
                          >
                            <div>
                              <p className="text-xs font-bold text-white group-hover:text-[#F2D99B]">
                                {srv.name}
                              </p>
                              <p className="text-[11px] text-[#D6B36A] font-medium mt-0.5">
                                Starting {srv.startingPrice}
                              </p>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D6B36A] shrink-0 mt-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                      active
                        ? "text-[#F2D99B] bg-white/10 border-b-2 border-[#D6B36A]"
                        : "text-slate-200 hover:text-[#F2D99B] hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openConsultationModal()}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] font-bold text-xs sm:text-sm tracking-wide shadow-gold hover:brightness-105 transition-all duration-100 cursor-pointer touch-manipulation active:scale-95"
          >
            <span>{settings.heroCtaSecondaryText || "Get Free Consultation"}</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-site-menu"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#10284A] border border-[#D6B36A]/40 text-[#F2D99B] cursor-pointer touch-manipulation transition-all duration-100 active:scale-90 active:bg-[#D6B36A] active:text-[#071A35]"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-site-menu"
          className="lg:hidden bg-[#071A35] border-t border-[#D6B36A]/30 px-4 pt-4 pb-6 space-y-3 max-h-[82dvh] overflow-y-auto"
        >
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                      active
                        ? "bg-[#10284A] text-[#F2D99B] border-l-4 border-[#D6B36A]"
                        : "text-slate-200 hover:bg-[#10284A]/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pt-3 border-t border-white/10">
            <p className="px-2 text-[11px] font-bold uppercase tracking-widest text-[#D6B36A] mb-2">
              Quick Service Links
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {services.slice(0, 8).map((srv) => (
                <Link
                  key={srv.id}
                  href={`/services/${srv.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg bg-[#10284A]/70 text-xs text-slate-200 hover:text-[#F2D99B] truncate"
                >
                  {srv.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openConsultationModal();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] font-bold text-sm text-center"
            >
              Get Free Consultation with {settings.contactPerson}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
