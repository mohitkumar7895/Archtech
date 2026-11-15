"use client";

import React, { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, EnquiryFormValues } from "@/lib/validations";
import { toast } from "sonner";
import { Send, CheckCircle2, PhoneCall, MessageCircle } from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";

interface ContactFormProps {
  defaultService?: string;
  defaultPackage?: string;
  sourcePage?: string;
  onSuccess?: () => void;
  compact?: boolean;
  whatsappNumber?: string;
  contactPerson?: string;
}

const SERVICE_OPTIONS = [
  "Architecture & Planning",
  "Home Construction",
  "Residential Construction",
  "Commercial Construction",
  "Interior Designing",
  "Modular Kitchen",
  "Bedroom Interiors",
  "Living Room Interiors",
  "Office Interiors",
  "False Ceiling & Lighting",
  "Turnkey Construction",
  "Villa & Farmhouse Construction",
  "Hostel & PG Planning & Construction",
];

const PROPERTY_TYPES = [
  "Independent Residential Plot / House",
  "Builder Floor / Multi-Storey Residence",
  "Apartment / Flat Interior",
  "Hostel / Paying Guest (PG) Property",
  "Luxury Villa / Farmhouse",
  "Commercial Office / Showroom",
];

const BUDGET_RANGES = [
  "Under ₹15 Lakhs (Interiors / Renovation)",
  "₹15 Lakhs – ₹35 Lakhs",
  "₹35 Lakhs – ₹65 Lakhs",
  "₹65 Lakhs – ₹1.2 Crore",
  "Above ₹1.2 Crore (Luxury Turnkey / Villa)",
];

export function ContactForm({
  defaultService = "Architecture & Planning",
  defaultPackage = "",
  sourcePage = "/",
  onSuccess,
  compact = false,
  whatsappNumber = "7535942407",
  contactPerson = "Nidhi Sharma",
}: ContactFormProps) {
  const formId = useId();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      serviceRequired: defaultService || "Architecture & Planning",
      propertyType: "Independent Residential Plot / House",
      location: "",
      approxAreaSqFt: "",
      budget: defaultPackage ? `Package: ${defaultPackage}` : "₹35 Lakhs – ₹65 Lakhs",
      message: defaultPackage ? `Interested in ${defaultPackage} quotation.` : "",
      sourcePage,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (values: EnquiryFormValues) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, sourcePage }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Could not submit your enquiry. Please check fields.");
        return;
      }
      toast.success(json.message || "Enquiry submitted! Nidhi Sharma will reach out shortly.");
      setSubmitted(true);
      reset();
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1400);
      }
    } catch {
      toast.error("Network error while submitting enquiry. Please try again.");
    }
  };

  if (submitted) {
    const waText = `Hello ${contactPerson} (ARCH NEW ERA DESIGN - NRBL TECH), I just submitted a consultation request for ${watchedValues.serviceRequired}.`;
    return (
      <div
        className="rounded-2xl bg-[#071A35] text-white p-8 text-center border border-[#D6B36A]/40 shadow-xl"
        role="status"
        aria-live="polite"
      >
        <div className="w-16 h-16 rounded-full bg-[#D6B36A]/20 text-[#D6B36A] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-white mb-2">
          Consultation Request Received
        </h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
          Thank you for reaching out to <strong className="text-[#F2D99B]">ARCH NEW ERA DESIGN – NRBL TECH</strong>.{" "}
          Our primary contact person <strong className="text-white">{contactPerson}</strong> will review your project
          details and call you shortly.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={formatWhatsAppUrl(whatsappNumber, waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] text-white font-semibold text-sm hover:opacity-95 transition"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp Now
          </a>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/25 text-white text-sm hover:bg-white/10 transition"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      action="/api/enquiries"
      method="POST"
      noValidate
      aria-labelledby={`${formId}-heading`}
      className="space-y-4"
    >
      <h3 id={`${formId}-heading`} className="sr-only">
        Project Consultation & Cost Estimation Form
      </h3>

      <div className={`grid grid-cols-1 ${compact ? "sm:grid-cols-2" : "md:grid-cols-2"} gap-4`}>
        {/* Customer Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-name`}
            className="text-xs font-semibold uppercase tracking-wider text-[#172033]"
          >
            Your Full Name <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.customerName)}
            aria-describedby={errors.customerName ? `${formId}-name-err` : undefined}
            placeholder="e.g., Rajesh Verma"
            {...register("customerName")}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-[#172033] text-base focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#071A35] transition"
          />
          {errors.customerName && (
            <span id={`${formId}-name-err`} className="text-xs text-red-600 font-medium" role="alert">
              {errors.customerName.message}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-phone`}
            className="text-xs font-semibold uppercase tracking-wider text-[#172033]"
          >
            Phone / WhatsApp Number <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <input
            id={`${formId}-phone`}
            type="text"
            inputMode="numeric"
            autoComplete="tel"
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${formId}-phone-err` : `${formId}-phone-hint`}
            placeholder="10-digit mobile number"
            {...register("phone")}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-[#172033] text-base focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#071A35] transition"
          />
          {errors.phone ? (
            <span id={`${formId}-phone-err`} className="text-xs text-red-600 font-medium" role="alert">
              {errors.phone.message}
            </span>
          ) : (
            <span id={`${formId}-phone-hint`} className="text-[11px] text-slate-500">
              Direct callback from {contactPerson} (+91 {whatsappNumber})
            </span>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? "sm:grid-cols-2" : "md:grid-cols-2"} gap-4`}>
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-email`}
            className="text-xs font-semibold uppercase tracking-wider text-[#172033]"
          >
            Email Address (Optional)
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            autoComplete="email"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-err` : undefined}
            placeholder="you@example.com"
            {...register("email")}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-[#172033] text-base focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#071A35] transition"
          />
          {errors.email && (
            <span id={`${formId}-email-err`} className="text-xs text-red-600 font-medium" role="alert">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Service Required */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-service`}
            className="text-xs font-semibold uppercase tracking-wider text-[#172033]"
          >
            Service Required <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <select
            id={`${formId}-service`}
            required
            {...register("serviceRequired")}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-[#172033] text-base focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#071A35] transition"
          >
            {SERVICE_OPTIONS.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? "sm:grid-cols-2" : "md:grid-cols-3"} gap-4`}>
        {/* Property Type */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-property`}
            className="text-xs font-semibold uppercase tracking-wider text-[#172033]"
          >
            Property Type
          </label>
          <select
            id={`${formId}-property`}
            {...register("propertyType")}
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-[#172033] text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#071A35] transition"
          >
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>
        </div>

        {/* Site Location */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-location`}
            className="text-xs font-semibold uppercase tracking-wider text-[#172033]"
          >
            Plot / Property Location <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <input
            id={`${formId}-location`}
            type="text"
            autoComplete="street-address"
            required
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? `${formId}-location-err` : undefined}
            placeholder="e.g., Shahdara, East Delhi / Noida"
            {...register("location")}
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-[#172033] text-base focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#071A35] transition"
          />
          {errors.location && (
            <span id={`${formId}-location-err`} className="text-xs text-red-600 font-medium" role="alert">
              {errors.location.message}
            </span>
          )}
        </div>

        {/* Approx Area */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-area`}
            className="text-xs font-semibold uppercase tracking-wider text-[#172033]"
          >
            Approx. Area (Sq. Ft.)
          </label>
          <input
            id={`${formId}-area`}
            type="text"
            inputMode="numeric"
            placeholder="e.g., 1800 sq. ft."
            {...register("approxAreaSqFt")}
            className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-[#172033] text-base focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#071A35] transition"
          />
        </div>
      </div>

      {/* Budget */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${formId}-budget`}
          className="text-xs font-semibold uppercase tracking-wider text-[#172033]"
        >
          Estimated Budget / Preferred Package
        </label>
        <select
          id={`${formId}-budget`}
          {...register("budget")}
          className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-[#172033] text-sm focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#071A35] transition"
        >
          {defaultPackage && <option value={`Package: ${defaultPackage}`}>Package: {defaultPackage}</option>}
          <option value="Essential Home (Starting ₹1,099/sq.ft.)">
            Essential Home Construction (Starting ₹1,099/sq.ft.)
          </option>
          <option value="Ready-to-Move (Starting ₹1,399/sq.ft.)">
            Ready-to-Move Construction (Starting ₹1,399/sq.ft.)
          </option>
          <option value="Premium Turnkey (Starting ₹1,899/sq.ft.)">
            Premium Turnkey Construction (Starting ₹1,899/sq.ft.)
          </option>
          <option value="Interior Designing (Starting ₹900/sq.ft.)">
            Interior Designing Package (Starting ₹900/sq.ft.)
          </option>
          {BUDGET_RANGES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Project Message */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${formId}-message`}
          className="text-xs font-semibold uppercase tracking-wider text-[#172033]"
        >
          Project Requirements & Plot Details
        </label>
        <textarea
          id={`${formId}-message`}
          rows={compact ? 3 : 4}
          placeholder="Tell us about your plot size, number of floors, interior scope, or preferred timeline..."
          {...register("message")}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-[#172033] text-base focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#071A35] transition"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 min-h-[50px] px-7 py-3.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-semibold text-sm tracking-wide hover:bg-[#10284A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B36A] disabled:opacity-60 transition shadow-lg"
        >
          <Send className="w-4 h-4 text-[#D6B36A]" />
          {isSubmitting ? "Submitting Request..." : "Request Free Consultation & Quote"}
        </button>

        <a
          href={`tel:+91${whatsappNumber}`}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-xl border border-[#071A35]/20 bg-[#F6F7FA] text-[#071A35] font-semibold text-xs hover:border-[#D6B36A] transition"
        >
          <PhoneCall className="w-4 h-4 text-[#D6B36A]" />
          Speak with {contactPerson}: +91 {whatsappNumber}
        </a>
      </div>
    </form>
  );
}
