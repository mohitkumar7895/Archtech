import { z } from "zod";

export const enquirySchema = z.object({
  customerName: z.string().min(2, "Please enter your full name (at least 2 characters)"),
  phone: z
    .string()
    .min(10, "Please enter a valid 10-digit phone number")
    .regex(/^[0-9+\-\s()]{10,15}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  serviceRequired: z.string().min(2, "Please select a service"),
  propertyType: z.string().optional().default("Residential Home / Plot"),
  location: z.string().min(2, "Please enter your site or city location"),
  approxAreaSqFt: z.string().optional().default(""),
  budget: z.string().optional().default(""),
  message: z.string().optional().default(""),
  sourcePage: z.string().optional().default("/"),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid admin email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface SEOValidationWarning {
  field: string;
  severity: "warning" | "error";
  message: string;
}

export function validateSEOPageInput(
  page: {
    metaTitle?: string;
    metaDescription?: string;
    h1Heading?: string;
    featuredImage?: string;
    imageAltText?: string;
    slug?: string;
    canonicalUrl?: string;
  },
  existingSlugs: string[] = []
): SEOValidationWarning[] {
  const warnings: SEOValidationWarning[] = [];

  if (!page.metaTitle || page.metaTitle.trim().length === 0) {
    warnings.push({
      field: "metaTitle",
      severity: "error",
      message: "Missing Meta Title: Search engines require a descriptive title tag (recommended 50–60 characters).",
    });
  } else if (page.metaTitle.trim().length > 65) {
    warnings.push({
      field: "metaTitle",
      severity: "warning",
      message: `Meta Title is ${page.metaTitle.trim().length} characters (recommended under 60–65 characters to avoid truncation).`,
    });
  }

  if (!page.metaDescription || page.metaDescription.trim().length === 0) {
    warnings.push({
      field: "metaDescription",
      severity: "error",
      message: "Missing Meta Description: Provide a compelling summary (recommended 120–160 characters).",
    });
  }

  if (!page.h1Heading || page.h1Heading.trim().length === 0) {
    warnings.push({
      field: "h1Heading",
      severity: "error",
      message: "Missing H1 Heading: Every SEO page needs a primary H1 heading aligned with its focus keyword.",
    });
  }

  if (!page.featuredImage || page.featuredImage.trim().length === 0) {
    warnings.push({
      field: "featuredImage",
      severity: "warning",
      message: "Missing Featured Image: Social shares (Open Graph) and rich snippets perform better with an image.",
    });
  }

  if (!page.imageAltText || page.imageAltText.trim().length === 0) {
    warnings.push({
      field: "imageAltText",
      severity: "warning",
      message: "Missing Image Alt Text: Alt text is essential for accessibility and image search optimization.",
    });
  }

  if (page.slug && existingSlugs.includes(page.slug.trim())) {
    warnings.push({
      field: "slug",
      severity: "error",
      message: `Duplicate Slug ("${page.slug}"): Another page already uses this URL slug.`,
    });
  }

  if (!page.canonicalUrl || page.canonicalUrl.trim().length === 0) {
    warnings.push({
      field: "canonicalUrl",
      severity: "warning",
      message: "Missing Canonical URL: Specify a canonical URL to prevent duplicate content issues.",
    });
  }

  return warnings;
}
