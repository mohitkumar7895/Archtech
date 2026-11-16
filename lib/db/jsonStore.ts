import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  User,
  Role,
  SiteSettings,
  HomepageSection,
  AboutSection,
  Service,
  PricingPackage,
  Project,
  GalleryItem,
  Blog,
  BlogCategory,
  SEOPage,
  Testimonial,
  FAQItem,
  Enquiry,
  MediaAsset,
  SocialLink,
  RealEstateSection,
  RealEstateProperty,
} from "@/types";
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_HOMEPAGE_SECTIONS,
  INITIAL_ABOUT_SECTION,
  INITIAL_SERVICES,
  INITIAL_PRICING_PACKAGES,
  INITIAL_PROJECTS,
  INITIAL_GALLERY_ITEMS,
  INITIAL_BLOGS,
  INITIAL_BLOG_CATEGORIES,
  INITIAL_SEO_PAGES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_MEDIA_ASSETS,
  INITIAL_SOCIAL_LINKS,
  INITIAL_REAL_ESTATE_SECTION,
  INITIAL_REAL_ESTATE_PROPERTIES,
} from "@/lib/constants";

export interface DatabaseStore {
  roles: Role[];
  users: User[];
  siteSettings: SiteSettings;
  homepageSections: HomepageSection[];
  aboutSection: AboutSection;
  services: Service[];
  pricingPackages: PricingPackage[];
  projects: Project[];
  gallery: GalleryItem[];
  blogs: Blog[];
  blogCategories: BlogCategory[];
  seoPages: SEOPage[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  enquiries: Enquiry[];
  media: MediaAsset[];
  socialLinks: SocialLink[];
  realEstateSection: RealEstateSection;
  realEstateProperties: RealEstateProperty[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "arch_tech_store.json");

let memoryCache: DatabaseStore | null = null;
let lastMtime = 0;

function createInitialStore(): DatabaseStore {
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || "manoj712009@gmail.com";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_INITIAL_NAME || "Manoj Kumar Sharma";
  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  return {
    roles: [
      {
        id: "role-superadmin",
        name: "Super Admin",
        permissions: ["all"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "role-editor",
        name: "Content Manager",
        permissions: ["cms", "blog", "seo", "projects", "enquiries"],
        createdAt: new Date().toISOString(),
      },
    ],
    users: [
      {
        id: "usr-admin-1",
        name: adminName,
        email: adminEmail,
        password: passwordHash,
        roleId: "role-superadmin",
        roleName: "Super Admin",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    siteSettings: INITIAL_SITE_SETTINGS,
    homepageSections: INITIAL_HOMEPAGE_SECTIONS,
    aboutSection: INITIAL_ABOUT_SECTION,
    services: INITIAL_SERVICES,
    pricingPackages: INITIAL_PRICING_PACKAGES,
    projects: INITIAL_PROJECTS,
    gallery: INITIAL_GALLERY_ITEMS,
    blogs: INITIAL_BLOGS,
    blogCategories: INITIAL_BLOG_CATEGORIES,
    seoPages: INITIAL_SEO_PAGES,
    testimonials: INITIAL_TESTIMONIALS,
    faqs: INITIAL_FAQS,
    enquiries: [
      {
        id: "enq-sample-1",
        customerName: "Sample Consultation Lead (Editable)",
        phone: "9810000000",
        email: "sample.lead@example.com",
        serviceRequired: "Turnkey Construction",
        propertyType: "Residential Plot (Stilt + 3 Floors)",
        location: "Shahdara, East Delhi",
        approxAreaSqFt: "2400",
        budget: "₹40L - ₹50L",
        message: "Looking for 2D/3D architectural planning and turnkey construction quotation for a 100 sq. yd. plot.",
        status: "New",
        followUpDate: "2026-11-20",
        internalNotes: [
          {
            id: "note-1",
            enquiryId: "enq-sample-1",
            note: "Initial sample enquiry record. Admin can update status, add follow-up notes, or contact via WhatsApp.",
            author: "Manoj Kumar Sharma",
            createdAt: new Date().toISOString(),
          },
        ],
        sourcePage: "/contact",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    media: INITIAL_MEDIA_ASSETS,
    socialLinks: INITIAL_SOCIAL_LINKS,
    realEstateSection: INITIAL_REAL_ESTATE_SECTION,
    realEstateProperties: INITIAL_REAL_ESTATE_PROPERTIES,
  };
}

export function readStore(): DatabaseStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_PATH)) {
      const initial = createInitialStore();
      fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
      memoryCache = initial;
      lastMtime = Date.now();
      return initial;
    }

    const stat = fs.statSync(STORE_PATH);
    if (memoryCache && stat.mtimeMs <= lastMtime) {
      return memoryCache;
    }

    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<DatabaseStore>;
    const defaults = createInitialStore();
    const result: DatabaseStore = {
      roles: parsed.roles || defaults.roles,
      users: parsed.users || defaults.users,
      siteSettings: { ...defaults.siteSettings, ...(parsed.siteSettings || {}) },
      homepageSections: parsed.homepageSections || defaults.homepageSections,
      aboutSection: { ...defaults.aboutSection, ...(parsed.aboutSection || {}) },
      services: parsed.services || defaults.services,
      pricingPackages: parsed.pricingPackages || defaults.pricingPackages,
      projects: parsed.projects || defaults.projects,
      gallery: parsed.gallery || defaults.gallery,
      blogs: parsed.blogs || defaults.blogs,
      blogCategories: parsed.blogCategories || defaults.blogCategories,
      seoPages: parsed.seoPages || defaults.seoPages,
      testimonials: parsed.testimonials || defaults.testimonials,
      faqs: parsed.faqs || defaults.faqs,
      enquiries: parsed.enquiries || defaults.enquiries,
      media: parsed.media || defaults.media,
      socialLinks: parsed.socialLinks || defaults.socialLinks,
      realEstateSection: { ...defaults.realEstateSection, ...(parsed.realEstateSection || {}) },
      realEstateProperties: parsed.realEstateProperties || defaults.realEstateProperties,
    };
    memoryCache = result;
    lastMtime = stat.mtimeMs;
    return result;
  } catch (err) {
    console.warn("Using in-memory initial store fallback:", err);
    return memoryCache || createInitialStore();
  }
}

export function writeStore(store: DatabaseStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
    memoryCache = store;
    lastMtime = Date.now();
  } catch (err) {
    console.warn("Failed to write store:", err);
  }
}
