export interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  roleId: string;
  roleName: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  companyName: string;
  brandIdentity: string;
  categoryText: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  tagline: string;
  supportingTagline: string;
  brandStatement: string;
  logoUrl: string;
  faviconUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimaryText: string;
  heroCtaPrimaryLink: string;
  heroCtaSecondaryText: string;
  heroImage: string;
  heroGallery: string[];
  introBadge: string;
  introTitle: string;
  introDescription: string;
  introHighlights: string[];
  experienceYears: number;
  projectsCompleted: number;
  sqftDelivered: string;
  clientSatisfaction: string;
  footerAbout: string;
  copyrightText: string;
  googleMapsEmbedUrl: string;
  workingHours: string;
  updatedAt: string;
}

export interface HomepageSection {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  contentJson?: string;
  isEnabled: boolean;
  orderIndex: number;
  updatedAt: string;
}

export interface AboutSection {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string;
  content: string;
  highlights: string[];
  imageUrl: string;
  founderName: string;
  founderRole: string;
  founderMessage: string;
  mission: string;
  vision: string;
  valuesList: { title: string; desc: string }[];
  updatedAt: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  startingPrice: string;
  iconName: string;
  featuredImage: string;
  gallery: string[];
  features: string[];
  faqs: ServiceFAQ[];
  seoTitle: string;
  metaDescription: string;
  status: "Published" | "Draft";
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  slug: string;
  packageType: "Construction" | "Interior";
  startingPrice: string;
  priceUnit: string;
  tagline: string;
  description: string;
  features: string[];
  imageUrl: string;
  isPopular: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSpecification {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  category:
    | "Residential Homes"
    | "Luxury Interiors"
    | "Construction in Progress"
    | "Villas & Farmhouses"
    | "Commercial Projects";
  shortDescription: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  completionDate: string;
  areaSqFt: string;
  clientName?: string;
  architectLead: string;
  specifications: ProjectSpecification[];
  isFeatured: boolean;
  status: "Published" | "Draft";
  seoTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText: string;
  location?: string;
  displayOrder: number;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  featuredImage: string;
  imageAlt: string;
  author: string;
  authorRole: string;
  category: string;
  tags: string[];
  readingTime: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogImage: string;
  faqSchema: ServiceFAQ[];
  publishDate: string;
  status: "Published" | "Draft" | "Scheduled";
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

export interface SEOPage {
  id: string;
  pageName: string;
  slug: string;
  routePrefix: "/pages" | "/locations" | "core";
  metaTitle: string;
  metaDescription: string;
  h1Heading: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  pageContent: string;
  featuredImage: string;
  imageAltText: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  faqContent: ServiceFAQ[];
  breadcrumbTitle: string;
  locationCity?: string;
  locationArea?: string;
  status: "Published" | "Draft";
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  location: string;
  projectType: string;
  rating: number;
  content: string;
  avatarUrl?: string;
  status: "Published" | "Draft";
  displayOrder: number;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
}

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Follow-up"
  | "Qualified"
  | "Converted"
  | "Closed";

export interface EnquiryNote {
  id: string;
  enquiryId: string;
  note: string;
  author: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  serviceRequired: string;
  propertyType: string;
  location: string;
  approxAreaSqFt: string;
  budget: string;
  message: string;
  status: LeadStatus;
  followUpDate?: string;
  internalNotes: EnquiryNote[];
  sourcePage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  altText: string;
  category: "Hero" | "Project" | "Service" | "Blog" | "Brand" | "General";
  mimeType: string;
  sizeKb: number;
  displayOrder: number;
  createdAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
}

export type RealEstateListingType =
  | "Buy"
  | "Sell"
  | "Collaboration"
  | "Investment"
  | "Rent";

export type RealEstateCategory =
  | "Builder Floor"
  | "Residential Plot"
  | "Commercial Plot"
  | "Commercial Shop / Office"
  | "PG / Hostel Building"
  | "Luxury Villa / Farmhouse"
  | "Joint Venture / Collaboration";

export type RealEstateStatus =
  | "Available"
  | "Ready to Move"
  | "Under Construction"
  | "Sold Out"
  | "Booking Open";

export interface RealEstateProperty {
  id: string;
  title: string;
  slug: string;
  propertyType: RealEstateListingType;
  category: RealEstateCategory;
  price: string;
  priceUnit?: string;
  location: string;
  address?: string;
  areaSqFt: string;
  bedrooms?: string;
  bathrooms?: string;
  furnishing?: string;
  possessionDate?: string;
  status: RealEstateStatus;
  featuredImage: string;
  galleryImages: string[];
  shortDescription: string;
  description: string;
  features: string[];
  contactPerson?: string;
  contactPhone?: string;
  isFeatured: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface RealEstateServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  highlights: string[];
}

export interface RealEstateSection {
  id: string;
  badgeText: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  stats: { label: string; value: string }[];
  servicesOffered: RealEstateServiceItem[];
  collaborationCtaTitle: string;
  collaborationCtaSubtitle: string;
  isEnabled: boolean;
  updatedAt: string;
}

