import crypto from "crypto";
import { query, queryOne, execute } from "./mysql";
import { readStore, writeStore } from "./jsonStore";
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
  EnquiryNote,
  MediaAsset,
  SocialLink,
  RealEstateSection,
  RealEstateProperty,
} from "@/types";

export function generateId(prefix = "id"): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function safeJsonParse<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === "object") return val as T;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

export const db = {
  // 1. SITE SETTINGS
  async getSiteSettings(): Promise<SiteSettings> {
    const store = readStore();
    try {
      const row = await queryOne<any>("SELECT * FROM site_settings WHERE id = 'default' LIMIT 1");
      if (row) {
        return {
          ...store.siteSettings,
          ...row,
          heroGallery: safeJsonParse<string[]>(row.heroGallery, store.siteSettings.heroGallery),
          introHighlights: safeJsonParse<string[]>(row.introHighlights, store.siteSettings.introHighlights),
          experienceYears: Number(row.experienceYears ?? store.siteSettings.experienceYears),
          projectsCompleted: Number(row.projectsCompleted ?? store.siteSettings.projectsCompleted),
        };
      }
    } catch {}
    return store.siteSettings;
  },

  async updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const store = readStore();
    const updated: SiteSettings = {
      ...store.siteSettings,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    store.siteSettings = updated;
    writeStore(store);

    try {
      await execute(
        `INSERT INTO site_settings (
          id, companyName, brandIdentity, categoryText, contactPerson, phone, whatsapp, email, address,
          tagline, supportingTagline, brandStatement, logoUrl, faviconUrl, heroTitle, heroSubtitle,
          heroCtaPrimaryText, heroCtaPrimaryLink, heroCtaSecondaryText, heroImage, heroGallery,
          introBadge, introTitle, introDescription, introHighlights, experienceYears, projectsCompleted,
          sqftDelivered, clientSatisfaction, footerAbout, copyrightText, googleMapsEmbedUrl, workingHours
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          companyName=VALUES(companyName), brandIdentity=VALUES(brandIdentity), categoryText=VALUES(categoryText),
          contactPerson=VALUES(contactPerson), phone=VALUES(phone), whatsapp=VALUES(whatsapp), email=VALUES(email),
          address=VALUES(address), tagline=VALUES(tagline), supportingTagline=VALUES(supportingTagline),
          brandStatement=VALUES(brandStatement), logoUrl=VALUES(logoUrl), faviconUrl=VALUES(faviconUrl),
          heroTitle=VALUES(heroTitle), heroSubtitle=VALUES(heroSubtitle),
          heroCtaPrimaryText=VALUES(heroCtaPrimaryText), heroCtaPrimaryLink=VALUES(heroCtaPrimaryLink),
          heroCtaSecondaryText=VALUES(heroCtaSecondaryText), heroImage=VALUES(heroImage),
          heroGallery=VALUES(heroGallery), introBadge=VALUES(introBadge), introTitle=VALUES(introTitle),
          introDescription=VALUES(introDescription), introHighlights=VALUES(introHighlights),
          experienceYears=VALUES(experienceYears), projectsCompleted=VALUES(projectsCompleted),
          sqftDelivered=VALUES(sqftDelivered), clientSatisfaction=VALUES(clientSatisfaction),
          footerAbout=VALUES(footerAbout), copyrightText=VALUES(copyrightText),
          googleMapsEmbedUrl=VALUES(googleMapsEmbedUrl), workingHours=VALUES(workingHours)`,
        [
          "default",
          updated.companyName,
          updated.brandIdentity,
          updated.categoryText,
          updated.contactPerson,
          updated.phone,
          updated.whatsapp,
          updated.email,
          updated.address,
          updated.tagline,
          updated.supportingTagline,
          updated.brandStatement,
          updated.logoUrl,
          updated.faviconUrl,
          updated.heroTitle,
          updated.heroSubtitle,
          updated.heroCtaPrimaryText,
          updated.heroCtaPrimaryLink,
          updated.heroCtaSecondaryText,
          updated.heroImage,
          JSON.stringify(updated.heroGallery || []),
          updated.introBadge,
          updated.introTitle,
          updated.introDescription,
          JSON.stringify(updated.introHighlights || []),
          updated.experienceYears,
          updated.projectsCompleted,
          updated.sqftDelivered,
          updated.clientSatisfaction,
          updated.footerAbout,
          updated.copyrightText,
          updated.googleMapsEmbedUrl,
          updated.workingHours,
        ]
      );
    } catch {}
    return updated;
  },

  // 2. HOMEPAGE SECTIONS
  async getHomepageSections(): Promise<HomepageSection[]> {
    const store = readStore();
    try {
      const rows = await query<any>("SELECT * FROM homepage_sections ORDER BY orderIndex ASC");
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          sectionKey: r.sectionKey,
          title: r.title,
          subtitle: r.subtitle || "",
          badgeText: r.badgeText || "",
          contentJson: r.contentJson || undefined,
          isEnabled: Boolean(r.isEnabled),
          orderIndex: Number(r.orderIndex),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    return [...store.homepageSections].sort((a, b) => a.orderIndex - b.orderIndex);
  },

  async updateHomepageSections(sections: HomepageSection[]): Promise<HomepageSection[]> {
    const store = readStore();
    store.homepageSections = sections;
    writeStore(store);
    try {
      for (const sec of sections) {
        await execute(
          `INSERT INTO homepage_sections (id, sectionKey, title, subtitle, badgeText, contentJson, isEnabled, orderIndex)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), badgeText=VALUES(badgeText),
           contentJson=VALUES(contentJson), isEnabled=VALUES(isEnabled), orderIndex=VALUES(orderIndex)`,
          [
            sec.id,
            sec.sectionKey,
            sec.title,
            sec.subtitle,
            sec.badgeText || "",
            sec.contentJson || null,
            sec.isEnabled ? 1 : 0,
            sec.orderIndex,
          ]
        );
      }
    } catch {}
    return sections;
  },

  // 3. ABOUT SECTION
  async getAboutSection(): Promise<AboutSection> {
    const store = readStore();
    try {
      const row = await queryOne<any>("SELECT * FROM about_sections WHERE id = 'default-about' LIMIT 1");
      if (row) {
        return {
          ...store.aboutSection,
          ...row,
          highlights: safeJsonParse<string[]>(row.highlights, store.aboutSection.highlights),
          valuesList: safeJsonParse<{ title: string; desc: string }[]>(row.valuesList, store.aboutSection.valuesList),
        };
      }
    } catch {}
    return store.aboutSection;
  },

  async updateAboutSection(data: Partial<AboutSection>): Promise<AboutSection> {
    const store = readStore();
    const updated: AboutSection = {
      ...store.aboutSection,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    store.aboutSection = updated;
    writeStore(store);
    try {
      await execute(
        `INSERT INTO about_sections (id, sectionKey, title, subtitle, content, highlights, imageUrl, founderName, founderRole, founderMessage, mission, vision, valuesList)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), content=VALUES(content),
         highlights=VALUES(highlights), imageUrl=VALUES(imageUrl), founderName=VALUES(founderName),
         founderRole=VALUES(founderRole), founderMessage=VALUES(founderMessage), mission=VALUES(mission),
         vision=VALUES(vision), valuesList=VALUES(valuesList)`,
        [
          "default-about",
          updated.sectionKey || "main_about",
          updated.title,
          updated.subtitle,
          updated.content,
          JSON.stringify(updated.highlights || []),
          updated.imageUrl,
          updated.founderName,
          updated.founderRole,
          updated.founderMessage,
          updated.mission,
          updated.vision,
          JSON.stringify(updated.valuesList || []),
        ]
      );
    } catch {}
    return updated;
  },

  // 4. SERVICES
  async getServices(onlyPublished = false): Promise<Service[]> {
    const store = readStore();
    try {
      const sql = onlyPublished
        ? "SELECT * FROM services WHERE status = 'Published' ORDER BY orderIndex ASC"
        : "SELECT * FROM services ORDER BY orderIndex ASC";
      const rows = await query<any>(sql);
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          category: r.category,
          shortDescription: r.shortDescription,
          fullDescription: r.fullDescription,
          startingPrice: r.startingPrice,
          iconName: r.iconName || "Compass",
          featuredImage: r.featuredImage,
          gallery: safeJsonParse<string[]>(r.gallery, []),
          features: safeJsonParse<string[]>(r.features, []),
          faqs: safeJsonParse<any[]>(r.faqs, []),
          seoTitle: r.seoTitle || r.name,
          metaDescription: r.metaDescription || r.shortDescription,
          status: r.status === "Draft" ? "Draft" : "Published",
          orderIndex: Number(r.orderIndex ?? 0),
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    const list = [...store.services].sort((a, b) => a.orderIndex - b.orderIndex);
    return onlyPublished ? list.filter((s) => s.status === "Published") : list;
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const all = await this.getServices(false);
    return all.find((s) => s.slug === slug) || null;
  },

  async saveService(serviceData: Partial<Service> & { name: string; slug: string }): Promise<Service> {
    const store = readStore();
    const existingIndex = store.services.findIndex((s) => s.id === serviceData.id || s.slug === serviceData.slug);
    const now = new Date().toISOString();

    const item: Service =
      existingIndex >= 0
        ? {
            ...store.services[existingIndex],
            ...serviceData,
            updatedAt: now,
          }
        : {
            id: serviceData.id || generateId("srv"),
            name: serviceData.name,
            slug: serviceData.slug,
            category: serviceData.category || "Architecture & Planning",
            shortDescription: serviceData.shortDescription || "",
            fullDescription: serviceData.fullDescription || "",
            startingPrice: serviceData.startingPrice || "₹900 / sq. ft.",
            iconName: serviceData.iconName || "Compass",
            featuredImage:
              serviceData.featuredImage ||
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            gallery: serviceData.gallery || [],
            features: serviceData.features || [],
            faqs: serviceData.faqs || [],
            seoTitle: serviceData.seoTitle || `${serviceData.name} | ARCH NEW ERA DESIGN`,
            metaDescription: serviceData.metaDescription || serviceData.shortDescription || "",
            status: serviceData.status || "Published",
            orderIndex: serviceData.orderIndex ?? store.services.length + 1,
            createdAt: now,
            updatedAt: now,
          };

    if (existingIndex >= 0) {
      store.services[existingIndex] = item;
    } else {
      store.services.push(item);
    }
    writeStore(store);

    try {
      await execute(
        `INSERT INTO services (
          id, name, slug, category, shortDescription, fullDescription, startingPrice, iconName,
          featuredImage, gallery, features, faqs, seoTitle, metaDescription, status, orderIndex
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name=VALUES(name), slug=VALUES(slug), category=VALUES(category),
          shortDescription=VALUES(shortDescription), fullDescription=VALUES(fullDescription),
          startingPrice=VALUES(startingPrice), iconName=VALUES(iconName),
          featuredImage=VALUES(featuredImage), gallery=VALUES(gallery),
          features=VALUES(features), faqs=VALUES(faqs), seoTitle=VALUES(seoTitle),
          metaDescription=VALUES(metaDescription), status=VALUES(status), orderIndex=VALUES(orderIndex)`,
        [
          item.id,
          item.name,
          item.slug,
          item.category,
          item.shortDescription,
          item.fullDescription,
          item.startingPrice,
          item.iconName,
          item.featuredImage,
          JSON.stringify(item.gallery || []),
          JSON.stringify(item.features || []),
          JSON.stringify(item.faqs || []),
          item.seoTitle,
          item.metaDescription,
          item.status,
          item.orderIndex,
        ]
      );
      await execute("DELETE FROM service_features WHERE serviceId = ?", [item.id]);
      for (let i = 0; i < (item.features || []).length; i++) {
        await execute(
          "INSERT INTO service_features (id, serviceId, featureText, displayOrder) VALUES (?, ?, ?, ?)",
          [generateId("sf"), item.id, item.features[i], i + 1]
        );
      }
    } catch {}
    return item;
  },

  async deleteService(id: string): Promise<boolean> {
    const store = readStore();
    store.services = store.services.filter((s) => s.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM service_features WHERE serviceId = ?", [id]);
      await execute("DELETE FROM services WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  // 5. PRICING PACKAGES
  async getPricingPackages(onlyActive = false): Promise<PricingPackage[]> {
    const store = readStore();
    try {
      const sql = onlyActive
        ? "SELECT * FROM pricing_packages WHERE isActive = 1 ORDER BY displayOrder ASC"
        : "SELECT * FROM pricing_packages ORDER BY displayOrder ASC";
      const rows = await query<any>(sql);
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          packageType: r.packageType === "Interior" ? "Interior" : "Construction",
          startingPrice: r.startingPrice,
          priceUnit: r.priceUnit || "/ sq. ft.",
          tagline: r.tagline || "",
          description: r.description || "",
          features: safeJsonParse<string[]>(r.features, []),
          imageUrl: r.imageUrl || "",
          isPopular: Boolean(r.isPopular),
          displayOrder: Number(r.displayOrder ?? 1),
          isActive: Boolean(r.isActive),
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    const list = [...store.pricingPackages].sort((a, b) => a.displayOrder - b.displayOrder);
    return onlyActive ? list.filter((p) => p.isActive) : list;
  },

  async savePricingPackage(pkgData: Partial<PricingPackage> & { name: string }): Promise<PricingPackage> {
    const store = readStore();
    const idx = store.pricingPackages.findIndex((p) => p.id === pkgData.id);
    const now = new Date().toISOString();
    const slug =
      pkgData.slug ||
      pkgData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const item: PricingPackage =
      idx >= 0
        ? {
            ...store.pricingPackages[idx],
            ...pkgData,
            slug,
            updatedAt: now,
          }
        : {
            id: pkgData.id || generateId("pkg"),
            name: pkgData.name,
            slug,
            packageType: pkgData.packageType || "Construction",
            startingPrice: pkgData.startingPrice || "₹1,099",
            priceUnit: pkgData.priceUnit || "/ sq. ft.",
            tagline: pkgData.tagline || "",
            description: pkgData.description || "",
            features: pkgData.features || [],
            imageUrl:
              pkgData.imageUrl ||
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
            isPopular: Boolean(pkgData.isPopular),
            displayOrder: pkgData.displayOrder ?? store.pricingPackages.length + 1,
            isActive: pkgData.isActive ?? true,
            createdAt: now,
            updatedAt: now,
          };

    if (idx >= 0) {
      store.pricingPackages[idx] = item;
    } else {
      store.pricingPackages.push(item);
    }
    writeStore(store);

    try {
      await execute(
        `INSERT INTO pricing_packages (
          id, name, slug, packageType, startingPrice, priceUnit, tagline, description,
          features, imageUrl, isPopular, displayOrder, isActive
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name=VALUES(name), slug=VALUES(slug), packageType=VALUES(packageType),
          startingPrice=VALUES(startingPrice), priceUnit=VALUES(priceUnit),
          tagline=VALUES(tagline), description=VALUES(description),
          features=VALUES(features), imageUrl=VALUES(imageUrl),
          isPopular=VALUES(isPopular), displayOrder=VALUES(displayOrder), isActive=VALUES(isActive)`,
        [
          item.id,
          item.name,
          item.slug,
          item.packageType,
          item.startingPrice,
          item.priceUnit,
          item.tagline,
          item.description,
          JSON.stringify(item.features || []),
          item.imageUrl,
          item.isPopular ? 1 : 0,
          item.displayOrder,
          item.isActive ? 1 : 0,
        ]
      );
      await execute("DELETE FROM pricing_features WHERE packageId = ?", [item.id]);
      for (let i = 0; i < (item.features || []).length; i++) {
        await execute(
          "INSERT INTO pricing_features (id, packageId, featureText, displayOrder) VALUES (?, ?, ?, ?)",
          [generateId("pf"), item.id, item.features[i], i + 1]
        );
      }
    } catch {}
    return item;
  },

  async deletePricingPackage(id: string): Promise<boolean> {
    const store = readStore();
    store.pricingPackages = store.pricingPackages.filter((p) => p.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM pricing_features WHERE packageId = ?", [id]);
      await execute("DELETE FROM pricing_packages WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  // 6. PROJECTS & PORTFOLIO
  async getProjects(onlyPublished = false): Promise<Project[]> {
    const store = readStore();
    try {
      const sql = onlyPublished
        ? "SELECT * FROM projects WHERE status = 'Published' ORDER BY createdAt DESC"
        : "SELECT * FROM projects ORDER BY createdAt DESC";
      const rows = await query<any>(sql);
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          location: r.location,
          category: r.category,
          shortDescription: r.shortDescription,
          description: r.description,
          coverImage: r.coverImage,
          galleryImages: safeJsonParse<string[]>(r.galleryImages, [r.coverImage]),
          completionDate: r.completionDate || "2026",
          areaSqFt: r.areaSqFt || "2,500 sq. ft.",
          architectLead: r.architectLead || "Manoj Kumar Sharma",
          specifications: safeJsonParse<any[]>(r.specifications, []),
          isFeatured: Boolean(r.isFeatured),
          status: r.status === "Draft" ? "Draft" : "Published",
          seoTitle: r.seoTitle || r.title,
          metaDescription: r.metaDescription || r.shortDescription,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    const list = [...store.projects];
    return onlyPublished ? list.filter((p) => p.status === "Published") : list;
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const all = await this.getProjects(false);
    return all.find((p) => p.slug === slug) || null;
  },

  async saveProject(projectData: Partial<Project> & { title: string; slug: string }): Promise<Project> {
    const store = readStore();
    const idx = store.projects.findIndex((p) => p.id === projectData.id || p.slug === projectData.slug);
    const now = new Date().toISOString();

    const item: Project =
      idx >= 0
        ? {
            ...store.projects[idx],
            ...projectData,
            updatedAt: now,
          }
        : {
            id: projectData.id || generateId("proj"),
            title: projectData.title,
            slug: projectData.slug,
            location: projectData.location || "Shahdara, Delhi",
            category: projectData.category || "Residential Homes",
            shortDescription: projectData.shortDescription || "",
            description: projectData.description || "",
            coverImage:
              projectData.coverImage ||
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
            galleryImages: projectData.galleryImages || [
              projectData.coverImage ||
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
            ],
            completionDate: projectData.completionDate || "2026",
            areaSqFt: projectData.areaSqFt || "2,800 sq. ft.",
            architectLead: projectData.architectLead || "Manoj Kumar Sharma",
            specifications: projectData.specifications || [],
            isFeatured: Boolean(projectData.isFeatured),
            status: projectData.status || "Published",
            seoTitle: projectData.seoTitle || `${projectData.title} | ARCH NEW ERA DESIGN`,
            metaDescription: projectData.metaDescription || projectData.shortDescription || "",
            createdAt: now,
            updatedAt: now,
          };

    if (idx >= 0) {
      store.projects[idx] = item;
    } else {
      store.projects.unshift(item);
    }
    writeStore(store);

    try {
      await execute(
        `INSERT INTO projects (
          id, title, slug, location, category, shortDescription, description, coverImage,
          galleryImages, completionDate, areaSqFt, architectLead, specifications,
          isFeatured, status, seoTitle, metaDescription
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title=VALUES(title), slug=VALUES(slug), location=VALUES(location), category=VALUES(category),
          shortDescription=VALUES(shortDescription), description=VALUES(description),
          coverImage=VALUES(coverImage), galleryImages=VALUES(galleryImages),
          completionDate=VALUES(completionDate), areaSqFt=VALUES(areaSqFt),
          architectLead=VALUES(architectLead), specifications=VALUES(specifications),
          isFeatured=VALUES(isFeatured), status=VALUES(status),
          seoTitle=VALUES(seoTitle), metaDescription=VALUES(metaDescription)`,
        [
          item.id,
          item.title,
          item.slug,
          item.location,
          item.category,
          item.shortDescription,
          item.description,
          item.coverImage,
          JSON.stringify(item.galleryImages || []),
          item.completionDate,
          item.areaSqFt,
          item.architectLead,
          JSON.stringify(item.specifications || []),
          item.isFeatured ? 1 : 0,
          item.status,
          item.seoTitle,
          item.metaDescription,
        ]
      );
      await execute("DELETE FROM project_images WHERE projectId = ?", [item.id]);
      for (let i = 0; i < (item.galleryImages || []).length; i++) {
        await execute(
          "INSERT INTO project_images (id, projectId, imageUrl, altText, displayOrder) VALUES (?, ?, ?, ?, ?)",
          [generateId("pimg"), item.id, item.galleryImages[i], `${item.title} - View ${i + 1}`, i + 1]
        );
      }
    } catch {}
    return item;
  },

  async deleteProject(id: string): Promise<boolean> {
    const store = readStore();
    store.projects = store.projects.filter((p) => p.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM project_images WHERE projectId = ?", [id]);
      await execute("DELETE FROM projects WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  // 7. GALLERY
  async getGallery(): Promise<GalleryItem[]> {
    const store = readStore();
    try {
      const rows = await query<any>("SELECT * FROM galleries ORDER BY displayOrder ASC");
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          imageUrl: r.imageUrl,
          altText: r.altText || r.title,
          location: r.location || "Delhi NCR",
          displayOrder: Number(r.displayOrder ?? 1),
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    return [...store.gallery].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async saveGalleryItem(data: Partial<GalleryItem> & { title: string; imageUrl: string }): Promise<GalleryItem> {
    const store = readStore();
    const idx = store.gallery.findIndex((g) => g.id === data.id);
    const item: GalleryItem =
      idx >= 0
        ? { ...store.gallery[idx], ...data }
        : {
            id: data.id || generateId("gal"),
            title: data.title,
            category: data.category || "Residential Homes",
            imageUrl: data.imageUrl,
            altText: data.altText || data.title,
            location: data.location || "Delhi NCR",
            displayOrder: data.displayOrder ?? store.gallery.length + 1,
            createdAt: new Date().toISOString(),
          };
    if (idx >= 0) store.gallery[idx] = item;
    else store.gallery.push(item);
    writeStore(store);

    try {
      await execute(
        `INSERT INTO galleries (id, title, category, imageUrl, altText, location, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category),
         imageUrl=VALUES(imageUrl), altText=VALUES(altText), location=VALUES(location), displayOrder=VALUES(displayOrder)`,
        [item.id, item.title, item.category, item.imageUrl, item.altText, item.location || "", item.displayOrder]
      );
    } catch {}
    return item;
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const store = readStore();
    store.gallery = store.gallery.filter((g) => g.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM galleries WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  // 8. BLOGS & CATEGORIES
  async getBlogs(onlyPublished = false): Promise<Blog[]> {
    const store = readStore();
    try {
      const sql = onlyPublished
        ? "SELECT * FROM blogs WHERE status = 'Published' ORDER BY publishDate DESC"
        : "SELECT * FROM blogs ORDER BY publishDate DESC";
      const rows = await query<any>(sql);
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          shortDescription: r.shortDescription,
          content: r.content,
          featuredImage: r.featuredImage,
          imageAlt: r.imageAlt || r.title,
          author: r.author || "Manoj Kumar Sharma",
          authorRole: r.authorRole || "Principal Project Lead – ARCH NEW ERA DESIGN",
          category: r.category || "Architecture & Vastu",
          tags: safeJsonParse<string[]>(r.tags, []),
          readingTime: r.readingTime || "4 min read",
          metaTitle: r.metaTitle || r.title,
          metaDescription: r.metaDescription || r.shortDescription,
          focusKeyword: r.focusKeyword || "",
          canonicalUrl: r.canonicalUrl || "",
          ogImage: r.ogImage || r.featuredImage,
          faqSchema: safeJsonParse<any[]>(r.faqSchema, []),
          publishDate: r.publishDate || "2026-11-15",
          status: r.status || "Published",
          isFeatured: Boolean(r.isFeatured),
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    const list = [...store.blogs];
    return onlyPublished ? list.filter((b) => b.status === "Published") : list;
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const all = await this.getBlogs(false);
    return all.find((b) => b.slug === slug) || null;
  },

  async saveBlog(blogData: Partial<Blog> & { title: string; slug: string }): Promise<Blog> {
    const store = readStore();
    const idx = store.blogs.findIndex((b) => b.id === blogData.id || b.slug === blogData.slug);
    const now = new Date().toISOString();
    const wordCount = (blogData.content || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
    const calcReadTime = `${Math.max(2, Math.ceil(wordCount / 180))} min read`;

    const item: Blog =
      idx >= 0
        ? {
            ...store.blogs[idx],
            ...blogData,
            readingTime: blogData.readingTime || calcReadTime,
            updatedAt: now,
          }
        : {
            id: blogData.id || generateId("blog"),
            title: blogData.title,
            slug: blogData.slug,
            shortDescription: blogData.shortDescription || "",
            content: blogData.content || "",
            featuredImage:
              blogData.featuredImage ||
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            imageAlt: blogData.imageAlt || blogData.title,
            author: blogData.author || "Manoj Kumar Sharma",
            authorRole: blogData.authorRole || "Principal Project Lead – ARCH NEW ERA DESIGN",
            category: blogData.category || "Construction Cost & Planning",
            tags: blogData.tags || [],
            readingTime: blogData.readingTime || calcReadTime,
            metaTitle: blogData.metaTitle || `${blogData.title} | ARCH NEW ERA DESIGN`,
            metaDescription: blogData.metaDescription || blogData.shortDescription || "",
            focusKeyword: blogData.focusKeyword || "",
            canonicalUrl: blogData.canonicalUrl || `http://localhost:3000/blog/${blogData.slug}`,
            ogImage: blogData.ogImage || blogData.featuredImage || "",
            faqSchema: blogData.faqSchema || [],
            publishDate: blogData.publishDate || new Date().toISOString().slice(0, 10),
            status: blogData.status || "Published",
            isFeatured: Boolean(blogData.isFeatured),
            createdAt: now,
            updatedAt: now,
          };

    if (idx >= 0) store.blogs[idx] = item;
    else store.blogs.unshift(item);
    writeStore(store);

    try {
      await execute(
        `INSERT INTO blogs (
          id, title, slug, shortDescription, content, featuredImage, imageAlt, author, authorRole,
          category, tags, readingTime, metaTitle, metaDescription, focusKeyword, canonicalUrl,
          ogImage, faqSchema, publishDate, status, isFeatured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title=VALUES(title), slug=VALUES(slug), shortDescription=VALUES(shortDescription),
          content=VALUES(content), featuredImage=VALUES(featuredImage), imageAlt=VALUES(imageAlt),
          author=VALUES(author), authorRole=VALUES(authorRole), category=VALUES(category),
          tags=VALUES(tags), readingTime=VALUES(readingTime), metaTitle=VALUES(metaTitle),
          metaDescription=VALUES(metaDescription), focusKeyword=VALUES(focusKeyword),
          canonicalUrl=VALUES(canonicalUrl), ogImage=VALUES(ogImage), faqSchema=VALUES(faqSchema),
          publishDate=VALUES(publishDate), status=VALUES(status), isFeatured=VALUES(isFeatured)`,
        [
          item.id,
          item.title,
          item.slug,
          item.shortDescription,
          item.content,
          item.featuredImage,
          item.imageAlt,
          item.author,
          item.authorRole,
          item.category,
          JSON.stringify(item.tags || []),
          item.readingTime,
          item.metaTitle,
          item.metaDescription,
          item.focusKeyword,
          item.canonicalUrl,
          item.ogImage,
          JSON.stringify(item.faqSchema || []),
          item.publishDate,
          item.status,
          item.isFeatured ? 1 : 0,
        ]
      );
    } catch {}
    return item;
  },

  async deleteBlog(id: string): Promise<boolean> {
    const store = readStore();
    store.blogs = store.blogs.filter((b) => b.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM blog_tag_relations WHERE blogId = ?", [id]);
      await execute("DELETE FROM blogs WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  async getBlogCategories(): Promise<BlogCategory[]> {
    const store = readStore();
    try {
      const rows = await query<any>("SELECT * FROM blog_categories ORDER BY name ASC");
      if (rows && rows.length > 0) return rows;
    } catch {}
    return store.blogCategories;
  },

  async saveBlogCategory(cat: Partial<BlogCategory> & { name: string }): Promise<BlogCategory> {
    const store = readStore();
    const slug =
      cat.slug ||
      cat.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const idx = store.blogCategories.findIndex((c) => c.id === cat.id || c.slug === slug);
    const item: BlogCategory =
      idx >= 0
        ? { ...store.blogCategories[idx], ...cat, slug }
        : {
            id: cat.id || generateId("cat"),
            name: cat.name,
            slug,
            description: cat.description || "",
            createdAt: new Date().toISOString(),
          };
    if (idx >= 0) store.blogCategories[idx] = item;
    else store.blogCategories.push(item);
    writeStore(store);
    try {
      await execute(
        `INSERT INTO blog_categories (id, name, slug, description) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug), description=VALUES(description)`,
        [item.id, item.name, item.slug, item.description]
      );
    } catch {}
    return item;
  },

  async deleteBlogCategory(id: string): Promise<boolean> {
    const store = readStore();
    store.blogCategories = store.blogCategories.filter((c) => c.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM blog_categories WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  // 9. DYNAMIC SEO PAGES & LOCATION PAGES
  async getSEOPages(onlyPublished = false): Promise<SEOPage[]> {
    const store = readStore();
    try {
      const sql = onlyPublished
        ? "SELECT * FROM seo_pages WHERE status = 'Published' ORDER BY createdAt DESC"
        : "SELECT * FROM seo_pages ORDER BY createdAt DESC";
      const rows = await query<any>(sql);
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          pageName: r.pageName,
          slug: r.slug,
          routePrefix: r.routePrefix || "/pages",
          metaTitle: r.metaTitle || "",
          metaDescription: r.metaDescription || "",
          h1Heading: r.h1Heading || "",
          focusKeyword: r.focusKeyword || "",
          secondaryKeywords: safeJsonParse<string[]>(r.secondaryKeywords, []),
          pageContent: r.pageContent || "",
          featuredImage: r.featuredImage || "",
          imageAltText: r.imageAltText || "",
          canonicalUrl: r.canonicalUrl || "",
          ogTitle: r.ogTitle || r.metaTitle || "",
          ogDescription: r.ogDescription || r.metaDescription || "",
          ogImage: r.ogImage || r.featuredImage || "",
          robotsIndex: Boolean(r.robotsIndex ?? true),
          robotsFollow: Boolean(r.robotsFollow ?? true),
          faqContent: safeJsonParse<any[]>(r.faqContent, []),
          breadcrumbTitle: r.breadcrumbTitle || r.pageName,
          locationCity: r.locationCity || "",
          locationArea: r.locationArea || "",
          status: r.status === "Draft" ? "Draft" : "Published",
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    const list = [...store.seoPages];
    return onlyPublished ? list.filter((p) => p.status === "Published") : list;
  },

  async getSEOPageBySlug(slug: string): Promise<SEOPage | null> {
    const all = await this.getSEOPages(false);
    return all.find((p) => p.slug === slug) || null;
  },

  async saveSEOPage(pageData: Partial<SEOPage> & { pageName: string; slug: string }): Promise<SEOPage> {
    const store = readStore();
    const idx = store.seoPages.findIndex((p) => p.id === pageData.id || p.slug === pageData.slug);
    const now = new Date().toISOString();

    const item: SEOPage =
      idx >= 0
        ? {
            ...store.seoPages[idx],
            ...pageData,
            updatedAt: now,
          }
        : {
            id: pageData.id || generateId("seo"),
            pageName: pageData.pageName,
            slug: pageData.slug,
            routePrefix: pageData.routePrefix || "/pages",
            metaTitle: pageData.metaTitle || "",
            metaDescription: pageData.metaDescription || "",
            h1Heading: pageData.h1Heading || pageData.pageName,
            focusKeyword: pageData.focusKeyword || "",
            secondaryKeywords: pageData.secondaryKeywords || [],
            pageContent: pageData.pageContent || "",
            featuredImage: pageData.featuredImage || "",
            imageAltText: pageData.imageAltText || "",
            canonicalUrl: pageData.canonicalUrl || "",
            ogTitle: pageData.ogTitle || pageData.metaTitle || "",
            ogDescription: pageData.ogDescription || pageData.metaDescription || "",
            ogImage: pageData.ogImage || pageData.featuredImage || "",
            robotsIndex: pageData.robotsIndex ?? true,
            robotsFollow: pageData.robotsFollow ?? true,
            faqContent: pageData.faqContent || [],
            breadcrumbTitle: pageData.breadcrumbTitle || pageData.pageName,
            locationCity: pageData.locationCity || "",
            locationArea: pageData.locationArea || "",
            status: pageData.status || "Published",
            createdAt: now,
            updatedAt: now,
          };

    if (idx >= 0) store.seoPages[idx] = item;
    else store.seoPages.unshift(item);
    writeStore(store);

    try {
      await execute(
        `INSERT INTO seo_pages (
          id, pageName, slug, routePrefix, metaTitle, metaDescription, h1Heading,
          focusKeyword, secondaryKeywords, pageContent, featuredImage, imageAltText,
          canonicalUrl, ogTitle, ogDescription, ogImage, robotsIndex, robotsFollow,
          faqContent, breadcrumbTitle, locationCity, locationArea, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          pageName=VALUES(pageName), slug=VALUES(slug), routePrefix=VALUES(routePrefix),
          metaTitle=VALUES(metaTitle), metaDescription=VALUES(metaDescription),
          h1Heading=VALUES(h1Heading), focusKeyword=VALUES(focusKeyword),
          secondaryKeywords=VALUES(secondaryKeywords), pageContent=VALUES(pageContent),
          featuredImage=VALUES(featuredImage), imageAltText=VALUES(imageAltText),
          canonicalUrl=VALUES(canonicalUrl), ogTitle=VALUES(ogTitle),
          ogDescription=VALUES(ogDescription), ogImage=VALUES(ogImage),
          robotsIndex=VALUES(robotsIndex), robotsFollow=VALUES(robotsFollow),
          faqContent=VALUES(faqContent), breadcrumbTitle=VALUES(breadcrumbTitle),
          locationCity=VALUES(locationCity), locationArea=VALUES(locationArea), status=VALUES(status)`,
        [
          item.id,
          item.pageName,
          item.slug,
          item.routePrefix,
          item.metaTitle,
          item.metaDescription,
          item.h1Heading,
          item.focusKeyword,
          JSON.stringify(item.secondaryKeywords || []),
          item.pageContent,
          item.featuredImage,
          item.imageAltText,
          item.canonicalUrl,
          item.ogTitle,
          item.ogDescription,
          item.ogImage,
          item.robotsIndex ? 1 : 0,
          item.robotsFollow ? 1 : 0,
          JSON.stringify(item.faqContent || []),
          item.breadcrumbTitle,
          item.locationCity || "",
          item.locationArea || "",
          item.status,
        ]
      );
      if (item.routePrefix === "/locations") {
        await execute(
          `INSERT INTO locations (id, name, slug, city, area, metaTitle, metaDescription, isActive)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), city=VALUES(city), area=VALUES(area),
           metaTitle=VALUES(metaTitle), metaDescription=VALUES(metaDescription), isActive=VALUES(isActive)`,
          [
            item.id,
            item.pageName,
            item.slug,
            item.locationCity || "Delhi NCR",
            item.locationArea || "Shahdara",
            item.metaTitle,
            item.metaDescription,
            item.status === "Published" ? 1 : 0,
          ]
        );
      }
    } catch {}
    return item;
  },

  async deleteSEOPage(id: string): Promise<boolean> {
    const store = readStore();
    store.seoPages = store.seoPages.filter((p) => p.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM locations WHERE id = ?", [id]);
      await execute("DELETE FROM seo_pages WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  // 10. TESTIMONIALS
  async getTestimonials(onlyPublished = false): Promise<Testimonial[]> {
    const store = readStore();
    try {
      const sql = onlyPublished
        ? "SELECT * FROM testimonials WHERE status = 'Published' ORDER BY displayOrder ASC"
        : "SELECT * FROM testimonials ORDER BY displayOrder ASC";
      const rows = await query<any>(sql);
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          clientName: r.clientName,
          clientRole: r.clientRole,
          location: r.location,
          projectType: r.projectType,
          rating: Number(r.rating ?? 5),
          content: r.content,
          avatarUrl: r.avatarUrl || undefined,
          status: r.status === "Draft" ? "Draft" : "Published",
          displayOrder: Number(r.displayOrder ?? 1),
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    const list = [...store.testimonials].sort((a, b) => a.displayOrder - b.displayOrder);
    return onlyPublished ? list.filter((t) => t.status === "Published") : list;
  },

  async saveTestimonial(data: Partial<Testimonial> & { clientName: string; content: string }): Promise<Testimonial> {
    const store = readStore();
    const idx = store.testimonials.findIndex((t) => t.id === data.id);
    const item: Testimonial =
      idx >= 0
        ? { ...store.testimonials[idx], ...data }
        : {
            id: data.id || generateId("test"),
            clientName: data.clientName,
            clientRole: data.clientRole || "Property Owner",
            location: data.location || "Delhi NCR",
            projectType: data.projectType || "Architecture & Construction",
            rating: Number(data.rating ?? 5),
            content: data.content,
            avatarUrl: data.avatarUrl,
            status: data.status || "Published",
            displayOrder: data.displayOrder ?? store.testimonials.length + 1,
            createdAt: new Date().toISOString(),
          };
    if (idx >= 0) store.testimonials[idx] = item;
    else store.testimonials.push(item);
    writeStore(store);

    try {
      await execute(
        `INSERT INTO testimonials (id, clientName, clientRole, location, projectType, rating, content, avatarUrl, status, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE clientName=VALUES(clientName), clientRole=VALUES(clientRole),
         location=VALUES(location), projectType=VALUES(projectType), rating=VALUES(rating),
         content=VALUES(content), avatarUrl=VALUES(avatarUrl), status=VALUES(status), displayOrder=VALUES(displayOrder)`,
        [
          item.id,
          item.clientName,
          item.clientRole,
          item.location,
          item.projectType,
          item.rating,
          item.content,
          item.avatarUrl || null,
          item.status,
          item.displayOrder,
        ]
      );
    } catch {}
    return item;
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const store = readStore();
    store.testimonials = store.testimonials.filter((t) => t.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM testimonials WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  // 11. FAQS
  async getFAQs(onlyPublished = false): Promise<FAQItem[]> {
    const store = readStore();
    try {
      const sql = onlyPublished
        ? "SELECT * FROM faqs WHERE isPublished = 1 ORDER BY displayOrder ASC"
        : "SELECT * FROM faqs ORDER BY displayOrder ASC";
      const rows = await query<any>(sql);
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          question: r.question,
          answer: r.answer,
          category: r.category || "General",
          displayOrder: Number(r.displayOrder ?? 1),
          isPublished: Boolean(r.isPublished),
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    const list = [...store.faqs].sort((a, b) => a.displayOrder - b.displayOrder);
    return onlyPublished ? list.filter((f) => f.isPublished) : list;
  },

  async saveFAQ(data: Partial<FAQItem> & { question: string; answer: string }): Promise<FAQItem> {
    const store = readStore();
    const idx = store.faqs.findIndex((f) => f.id === data.id);
    const item: FAQItem =
      idx >= 0
        ? { ...store.faqs[idx], ...data }
        : {
            id: data.id || generateId("faq"),
            question: data.question,
            answer: data.answer,
            category: data.category || "General",
            displayOrder: data.displayOrder ?? store.faqs.length + 1,
            isPublished: data.isPublished ?? true,
            createdAt: new Date().toISOString(),
          };
    if (idx >= 0) store.faqs[idx] = item;
    else store.faqs.push(item);
    writeStore(store);

    try {
      await execute(
        `INSERT INTO faqs (id, question, answer, category, displayOrder, isPublished)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE question=VALUES(question), answer=VALUES(answer),
         category=VALUES(category), displayOrder=VALUES(displayOrder), isPublished=VALUES(isPublished)`,
        [item.id, item.question, item.answer, item.category, item.displayOrder, item.isPublished ? 1 : 0]
      );
    } catch {}
    return item;
  },

  async deleteFAQ(id: string): Promise<boolean> {
    const store = readStore();
    store.faqs = store.faqs.filter((f) => f.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM faqs WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  // 12. ENQUIRIES / LEAD CRM
  async getEnquiries(): Promise<Enquiry[]> {
    const store = readStore();
    try {
      const rows = await query<any>("SELECT * FROM enquiries ORDER BY createdAt DESC");
      if (rows && rows.length > 0) {
        const notesRows = await query<any>("SELECT * FROM enquiry_notes ORDER BY createdAt DESC").catch(() => []);
        return rows.map((r) => ({
          id: r.id,
          customerName: r.customerName,
          phone: r.phone,
          email: r.email || "",
          serviceRequired: r.serviceRequired || "General Consultation",
          propertyType: r.propertyType || "Residential",
          location: r.location || "",
          approxAreaSqFt: r.approxAreaSqFt || "",
          budget: r.budget || "",
          message: r.message || "",
          status: r.status || "New",
          followUpDate: r.followUpDate || undefined,
          internalNotes: notesRows
            .filter((n: any) => n.enquiryId === r.id)
            .map((n: any) => ({
              id: n.id,
              enquiryId: n.enquiryId,
              note: n.note,
              author: n.author || "Manoj Kumar Sharma",
              createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString(),
            })),
          sourcePage: r.sourcePage || "/",
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    return [...store.enquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createEnquiry(data: Partial<Enquiry> & { customerName: string; phone: string }): Promise<Enquiry> {
    const store = readStore();
    const now = new Date().toISOString();
    const item: Enquiry = {
      id: generateId("enq"),
      customerName: data.customerName,
      phone: data.phone,
      email: data.email || "",
      serviceRequired: data.serviceRequired || "Architecture & Planning",
      propertyType: data.propertyType || "Residential Plot / Home",
      location: data.location || "Delhi NCR",
      approxAreaSqFt: data.approxAreaSqFt || "",
      budget: data.budget || "",
      message: data.message || "",
      status: "New",
      followUpDate: data.followUpDate || "",
      internalNotes: [],
      sourcePage: data.sourcePage || "/",
      createdAt: now,
      updatedAt: now,
    };
    store.enquiries.unshift(item);
    writeStore(store);

    try {
      await execute(
        `INSERT INTO enquiries (
          id, customerName, phone, email, serviceRequired, propertyType,
          location, approxAreaSqFt, budget, message, status, followUpDate, sourcePage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.customerName,
          item.phone,
          item.email,
          item.serviceRequired,
          item.propertyType,
          item.location,
          item.approxAreaSqFt,
          item.budget,
          item.message,
          item.status,
          item.followUpDate || null,
          item.sourcePage || "/",
        ]
      );
    } catch {}
    return item;
  },

  async updateEnquiry(
    id: string,
    updates: { status?: Enquiry["status"]; followUpDate?: string; newNote?: string; noteAuthor?: string }
  ): Promise<Enquiry | null> {
    const store = readStore();
    const idx = store.enquiries.findIndex((e) => e.id === id);
    if (idx < 0) return null;

    const item = store.enquiries[idx];
    if (updates.status) item.status = updates.status;
    if (updates.followUpDate !== undefined) item.followUpDate = updates.followUpDate;
    item.updatedAt = new Date().toISOString();

    let addedNote: EnquiryNote | null = null;
    if (updates.newNote && updates.newNote.trim()) {
      addedNote = {
        id: generateId("note"),
        enquiryId: id,
        note: updates.newNote.trim(),
        author: updates.noteAuthor || "Manoj Kumar Sharma",
        createdAt: new Date().toISOString(),
      };
      item.internalNotes = [addedNote, ...(item.internalNotes || [])];
    }

    store.enquiries[idx] = item;
    writeStore(store);

    try {
      await execute("UPDATE enquiries SET status = ?, followUpDate = ? WHERE id = ?", [
        item.status,
        item.followUpDate || null,
        id,
      ]);
      if (addedNote) {
        await execute("INSERT INTO enquiry_notes (id, enquiryId, note, author) VALUES (?, ?, ?, ?)", [
          addedNote.id,
          id,
          addedNote.note,
          addedNote.author,
        ]);
      }
    } catch {}
    return item;
  },

  async deleteEnquiry(id: string): Promise<boolean> {
    const store = readStore();
    store.enquiries = store.enquiries.filter((e) => e.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM enquiry_notes WHERE enquiryId = ?", [id]);
      await execute("DELETE FROM enquiries WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  // 13. MEDIA LIBRARY
  async getMedia(): Promise<MediaAsset[]> {
    const store = readStore();
    try {
      const rows = await query<any>("SELECT * FROM media ORDER BY displayOrder ASC, createdAt DESC");
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          title: r.title,
          url: r.url,
          altText: r.altText || r.title,
          category: r.category || "General",
          mimeType: r.mimeType || "image/jpeg",
          sizeKb: Number(r.sizeKb ?? 120),
          displayOrder: Number(r.displayOrder ?? 1),
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    return [...store.media].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async saveMedia(data: Partial<MediaAsset> & { title: string; url: string }): Promise<MediaAsset> {
    const store = readStore();
    const idx = store.media.findIndex((m) => m.id === data.id);
    const item: MediaAsset =
      idx >= 0
        ? { ...store.media[idx], ...data }
        : {
            id: data.id || generateId("med"),
            title: data.title,
            url: data.url,
            altText: data.altText || data.title,
            category: data.category || "General",
            mimeType: data.mimeType || "image/jpeg",
            sizeKb: data.sizeKb ?? 150,
            displayOrder: data.displayOrder ?? store.media.length + 1,
            createdAt: new Date().toISOString(),
          };
    if (idx >= 0) store.media[idx] = item;
    else store.media.unshift(item);
    writeStore(store);

    try {
      await execute(
        `INSERT INTO media (id, title, url, altText, category, mimeType, sizeKb, displayOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), url=VALUES(url), altText=VALUES(altText),
         category=VALUES(category), displayOrder=VALUES(displayOrder)`,
        [item.id, item.title, item.url, item.altText, item.category, item.mimeType, item.sizeKb, item.displayOrder]
      );
    } catch {}
    return item;
  },

  async deleteMedia(id: string): Promise<boolean> {
    const store = readStore();
    store.media = store.media.filter((m) => m.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM media WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  // 14. SOCIAL LINKS
  async getSocialLinks(): Promise<SocialLink[]> {
    const store = readStore();
    try {
      const rows = await query<any>("SELECT * FROM social_links ORDER BY displayOrder ASC");
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          platform: r.platform,
          url: r.url,
          icon: r.icon || "Globe",
          isActive: Boolean(r.isActive),
          displayOrder: Number(r.displayOrder ?? 1),
        }));
      }
    } catch {}
    return store.socialLinks;
  },

  async saveSocialLinks(links: SocialLink[]): Promise<SocialLink[]> {
    const store = readStore();
    store.socialLinks = links;
    writeStore(store);
    try {
      for (const link of links) {
        await execute(
          `INSERT INTO social_links (id, platform, url, icon, isActive, displayOrder)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE platform=VALUES(platform), url=VALUES(url),
           icon=VALUES(icon), isActive=VALUES(isActive), displayOrder=VALUES(displayOrder)`,
          [link.id, link.platform, link.url, link.icon, link.isActive ? 1 : 0, link.displayOrder]
        );
      }
    } catch {}
    return links;
  },

  // 15. USERS & ROLES
  async getUsers(): Promise<User[]> {
    const store = readStore();
    try {
      const rows = await query<any>("SELECT * FROM users ORDER BY createdAt ASC");
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          password: r.password,
          roleId: r.roleId || "role-superadmin",
          roleName: r.roleName || "Super Admin",
          avatar: r.avatar || undefined,
          isActive: Boolean(r.isActive ?? true),
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch {}
    return store.users;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async saveUser(userData: Partial<User> & { name: string; email: string }): Promise<User> {
    const store = readStore();
    const idx = store.users.findIndex(
      (u) => u.id === userData.id || u.email.toLowerCase() === userData.email.toLowerCase()
    );
    const now = new Date().toISOString();

    const item: User =
      idx >= 0
        ? {
            ...store.users[idx],
            ...userData,
            password: userData.password || store.users[idx].password,
            updatedAt: now,
          }
        : {
            id: userData.id || generateId("usr"),
            name: userData.name,
            email: userData.email.toLowerCase(),
            password: userData.password || "",
            roleId: userData.roleId || "role-editor",
            roleName: userData.roleName || "Content Manager",
            isActive: userData.isActive ?? true,
            createdAt: now,
            updatedAt: now,
          };

    if (idx >= 0) store.users[idx] = item;
    else store.users.push(item);
    writeStore(store);

    try {
      await execute(
        `INSERT INTO users (id, name, email, password, roleId, roleName, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email),
         password=VALUES(password), roleId=VALUES(roleId), roleName=VALUES(roleName), isActive=VALUES(isActive)`,
        [item.id, item.name, item.email, item.password || "", item.roleId, item.roleName, item.isActive ? 1 : 0]
      );
    } catch {}
    return item;
  },

  async deleteUser(id: string): Promise<boolean> {
    const store = readStore();
    if (store.users.length <= 1) return false;
    store.users = store.users.filter((u) => u.id !== id);
    writeStore(store);
    try {
      await execute("DELETE FROM users WHERE id = ?", [id]);
    } catch {}
    return true;
  },

  async getRoles(): Promise<Role[]> {
    const store = readStore();
    return store.roles;
  },

  // 17. REAL ESTATE SECTION & PROPERTIES
  async getRealEstateSection(): Promise<RealEstateSection> {
    const store = readStore();
    return store.realEstateSection;
  },

  async updateRealEstateSection(data: Partial<RealEstateSection>): Promise<RealEstateSection> {
    const store = readStore();
    const updated: RealEstateSection = {
      ...store.realEstateSection,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    store.realEstateSection = updated;
    writeStore(store);
    return updated;
  },

  async getRealEstateProperties(onlyAvailable = false): Promise<RealEstateProperty[]> {
    const store = readStore();
    const list = [...(store.realEstateProperties || [])];
    list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    if (onlyAvailable) {
      return list.filter((p) => p.status !== "Sold Out");
    }
    return list;
  },

  async getRealEstatePropertyBySlug(slug: string): Promise<RealEstateProperty | null> {
    const store = readStore();
    const found = (store.realEstateProperties || []).find((p) => p.slug === slug);
    return found || null;
  },

  async saveRealEstateProperty(property: Partial<RealEstateProperty>): Promise<RealEstateProperty> {
    const store = readStore();
    if (!store.realEstateProperties) {
      store.realEstateProperties = [];
    }
    const idx = property.id ? store.realEstateProperties.findIndex((p) => p.id === property.id) : -1;
    const now = new Date().toISOString();

    const item: RealEstateProperty =
      idx >= 0
        ? {
            ...store.realEstateProperties[idx],
            ...property,
            updatedAt: now,
          }
        : {
            id: property.id || generateId("prop"),
            title: property.title || "New Property Listing",
            slug: property.slug || (property.title ? property.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : generateId("prop")),
            propertyType: property.propertyType || "Buy",
            category: property.category || "Builder Floor",
            price: property.price || "Contact for Price",
            priceUnit: property.priceUnit || "Negotiable",
            location: property.location || "Shahdara, Delhi",
            address: property.address || "",
            areaSqFt: property.areaSqFt || "1,200 sq. ft.",
            bedrooms: property.bedrooms || "3 BHK",
            bathrooms: property.bathrooms || "2 Baths",
            furnishing: property.furnishing || "Semi-Furnished",
            possessionDate: property.possessionDate || "Ready to Move",
            status: property.status || "Available",
            featuredImage:
              property.featuredImage ||
              "/uploads/service-5-storey-elevation-manoj-kumar-sharma.jpg",
            galleryImages: property.galleryImages || [property.featuredImage || "/uploads/service-5-storey-elevation-manoj-kumar-sharma.jpg"],
            shortDescription: property.shortDescription || "",
            description: property.description || "",
            features: property.features || [],
            contactPerson: property.contactPerson || "Manoj Kumar Sharma",
            contactPhone: property.contactPhone || "7535942407",
            isFeatured: property.isFeatured ?? true,
            orderIndex: property.orderIndex ?? (store.realEstateProperties.length + 1),
            createdAt: now,
            updatedAt: now,
          };

    if (idx >= 0) {
      store.realEstateProperties[idx] = item;
    } else {
      store.realEstateProperties.push(item);
    }
    writeStore(store);
    return item;
  },

  async deleteRealEstateProperty(id: string): Promise<boolean> {
    const store = readStore();
    if (!store.realEstateProperties) return false;
    store.realEstateProperties = store.realEstateProperties.filter((p) => p.id !== id);
    writeStore(store);
    return true;
  },
};
