import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export interface DynamicMetadataOptions {
  title: string;
  description: string;
  path: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string[];
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  isPublished?: boolean;
}

export function buildPageMetadata(opts: DynamicMetadataOptions): Metadata {
  const fullUrl = opts.canonicalUrl || `${SITE_URL}${opts.path}`;
  const shouldIndex = (opts.isPublished ?? true) && (opts.robotsIndex ?? true);
  const shouldFollow = (opts.isPublished ?? true) && (opts.robotsFollow ?? true);

  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords || [
      "ARCH NEW ERA DESIGN",
      "NRBL TECH",
      "Manoj Kumar Sharma",
      "Architects in Shahdara Delhi",
      "Home Construction Delhi NCR",
      "Interior Designing Delhi",
      "Turnkey Construction",
    ],
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: shouldIndex,
      follow: shouldFollow,
      googleBot: {
        index: shouldIndex,
        follow: shouldFollow,
      },
    },
    openGraph: {
      title: opts.ogTitle || opts.title,
      description: opts.ogDescription || opts.description,
      url: fullUrl,
      siteName: "ARCH NEW ERA DESIGN – NRBL TECH",
      images: opts.ogImage
        ? [
            {
              url: opts.ogImage,
              width: 1200,
              height: 630,
              alt: opts.ogTitle || opts.title,
            },
          ]
        : [],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.ogTitle || opts.title,
      description: opts.ogDescription || opts.description,
      images: opts.ogImage ? [opts.ogImage] : [],
    },
  };
}
