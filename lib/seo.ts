import { SiteSettings, Service, Blog, SEOPage, ServiceFAQ } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function generateOrganizationSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "GeneralContractor", "ArchitecturalFirm", "LocalBusiness"],
    name: `${settings.companyName} – ${settings.brandIdentity}`,
    alternateName: settings.brandIdentity,
    url: SITE_URL,
    logo: `${SITE_URL}${settings.logoUrl}`,
    image: settings.heroImage,
    description: settings.footerAbout,
    slogan: settings.tagline,
    telephone: `+91-${settings.phone}`,
    email: settings.email,
    founder: {
      "@type": "Person",
      name: settings.contactPerson,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "B-366, Ashok Nagar, Shahdara",
      addressLocality: "Delhi",
      postalCode: "110093",
      addressCountry: "IN",
    },
    priceRange: "₹900 - ₹1,899 / sq. ft.",
    areaServed: ["Shahdara", "East Delhi", "Delhi NCR", "Noida", "Ghaziabad", "Gurugram"],
  };
}

export function generateServiceSchema(service: Service, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    url: `${SITE_URL}/services/${service.slug}`,
    image: service.featuredImage,
    provider: {
      "@type": "LocalBusiness",
      name: `${settings.companyName} (${settings.brandIdentity})`,
      telephone: `+91-${settings.phone}`,
      address: settings.address,
    },
    areaServed: {
      "@type": "City",
      name: "Delhi NCR",
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: service.startingPrice,
        priceCurrency: "INR",
      },
    },
  };
}

export function generateArticleSchema(blog: Blog, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.shortDescription,
    image: [blog.featuredImage],
    datePublished: blog.publishDate,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Person",
      name: blog.author || settings.contactPerson,
    },
    publisher: {
      "@type": "Organization",
      name: `${settings.companyName} (${settings.brandIdentity})`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}${settings.logoUrl}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${blog.slug}`,
    },
  };
}

export function generateFAQSchema(faqs: ServiceFAQ[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateLocalBusinessSchemaForSEOPage(page: SEOPage, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: `${settings.companyName} (${settings.brandIdentity}) - ${page.breadcrumbTitle || page.pageName}`,
    description: page.metaDescription,
    url: page.canonicalUrl || `${SITE_URL}${page.routePrefix}/${page.slug}`,
    telephone: `+91-${settings.phone}`,
    email: settings.email,
    image: page.featuredImage || settings.heroImage,
    address: {
      "@type": "PostalAddress",
      streetAddress: "B-366, Ashok Nagar, Shahdara",
      addressLocality: page.locationCity || "Delhi",
      postalCode: "110093",
      addressCountry: "IN",
    },
  };
}
