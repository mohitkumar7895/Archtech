const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

if (fs.existsSync(".env")) {
  fs.readFileSync(".env", "utf8")
    .split("\n")
    .forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = (match[2] || "").trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        process.env[match[1]] = val;
      }
    });
}

async function seedDatabase(connection, dbName, store) {
  await connection.changeUser({ database: dbName });
  console.log(`Seeding MySQL database '${dbName}'...`);

  // 1. Roles
  for (const r of store.roles) {
    await connection.execute(
      `INSERT INTO roles (id, name, permissions) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), permissions=VALUES(permissions)`,
      [r.id, r.name, JSON.stringify(r.permissions)]
    );
  }

  // 2. Users
  for (const u of store.users) {
    await connection.execute(
      `INSERT INTO users (id, name, email, password, roleId, roleName, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), roleName=VALUES(roleName)`,
      [u.id, u.name, u.email, u.password, u.roleId, u.roleName, u.isActive ? 1 : 0]
    );
  }

  // 3. Site Settings
  const s = store.siteSettings;
  await connection.execute(
    `INSERT INTO site_settings (
      id, companyName, brandIdentity, categoryText, contactPerson, phone, whatsapp, email, address,
      tagline, supportingTagline, brandStatement, logoUrl, faviconUrl, heroTitle, heroSubtitle,
      heroCtaPrimaryText, heroCtaPrimaryLink, heroCtaSecondaryText, heroImage, heroGallery,
      introBadge, introTitle, introDescription, introHighlights, experienceYears, projectsCompleted,
      sqftDelivered, clientSatisfaction, footerAbout, copyrightText, googleMapsEmbedUrl, workingHours
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      companyName=VALUES(companyName), contactPerson=VALUES(contactPerson),
      phone=VALUES(phone), whatsapp=VALUES(whatsapp), email=VALUES(email), address=VALUES(address)`,
    [
      "default",
      s.companyName,
      s.brandIdentity,
      s.categoryText,
      s.contactPerson,
      s.phone,
      s.whatsapp,
      s.email,
      s.address,
      s.tagline,
      s.supportingTagline,
      s.brandStatement,
      s.logoUrl,
      s.faviconUrl,
      s.heroTitle,
      s.heroSubtitle,
      s.heroCtaPrimaryText,
      s.heroCtaPrimaryLink,
      s.heroCtaSecondaryText,
      s.heroImage,
      JSON.stringify(s.heroGallery || []),
      s.introBadge,
      s.introTitle,
      s.introDescription,
      JSON.stringify(s.introHighlights || []),
      s.experienceYears,
      s.projectsCompleted,
      s.sqftDelivered,
      s.clientSatisfaction,
      s.footerAbout,
      s.copyrightText,
      s.googleMapsEmbedUrl,
      s.workingHours,
    ]
  );

  // 4. Homepage Sections
  for (const sec of store.homepageSections) {
    await connection.execute(
      `INSERT INTO homepage_sections (id, sectionKey, title, subtitle, badgeText, contentJson, isEnabled, orderIndex)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), badgeText=VALUES(badgeText)`,
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

  // 5. About Section
  const ab = store.aboutSection;
  await connection.execute(
    `INSERT INTO about_sections (id, sectionKey, title, subtitle, content, highlights, imageUrl, founderName, founderRole, founderMessage, mission, vision, valuesList)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title=VALUES(title), founderName=VALUES(founderName)`,
    [
      ab.id,
      ab.sectionKey,
      ab.title,
      ab.subtitle,
      ab.content,
      JSON.stringify(ab.highlights || []),
      ab.imageUrl,
      ab.founderName,
      ab.founderRole,
      ab.founderMessage,
      ab.mission,
      ab.vision,
      JSON.stringify(ab.valuesList || []),
    ]
  );

  // 6. Services & Service Features
  for (const srv of store.services) {
    await connection.execute(
      `INSERT INTO services (
        id, name, slug, category, shortDescription, fullDescription, startingPrice, iconName,
        featuredImage, gallery, features, faqs, seoTitle, metaDescription, status, orderIndex
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name=VALUES(name), startingPrice=VALUES(startingPrice), status=VALUES(status)`,
      [
        srv.id,
        srv.name,
        srv.slug,
        srv.category,
        srv.shortDescription,
        srv.fullDescription,
        srv.startingPrice,
        srv.iconName,
        srv.featuredImage,
        JSON.stringify(srv.gallery || []),
        JSON.stringify(srv.features || []),
        JSON.stringify(srv.faqs || []),
        srv.seoTitle,
        srv.metaDescription,
        srv.status,
        srv.orderIndex,
      ]
    );
    await connection.execute("DELETE FROM service_features WHERE serviceId = ?", [srv.id]);
    for (let i = 0; i < (srv.features || []).length; i++) {
      await connection.execute(
        "INSERT INTO service_features (id, serviceId, featureText, displayOrder) VALUES (?, ?, ?, ?)",
        [`${srv.id}-f-${i + 1}`, srv.id, srv.features[i], i + 1]
      );
    }
  }

  // 7. Pricing Packages & Features
  for (const pkg of store.pricingPackages) {
    await connection.execute(
      `INSERT INTO pricing_packages (
        id, name, slug, packageType, startingPrice, priceUnit, tagline, description,
        features, imageUrl, isPopular, displayOrder, isActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name=VALUES(name), startingPrice=VALUES(startingPrice)`,
      [
        pkg.id,
        pkg.name,
        pkg.slug,
        pkg.packageType,
        pkg.startingPrice,
        pkg.priceUnit,
        pkg.tagline,
        pkg.description,
        JSON.stringify(pkg.features || []),
        pkg.imageUrl,
        pkg.isPopular ? 1 : 0,
        pkg.displayOrder,
        pkg.isActive ? 1 : 0,
      ]
    );
    await connection.execute("DELETE FROM pricing_features WHERE packageId = ?", [pkg.id]);
    for (let i = 0; i < (pkg.features || []).length; i++) {
      await connection.execute(
        "INSERT INTO pricing_features (id, packageId, featureText, displayOrder) VALUES (?, ?, ?, ?)",
        [`${pkg.id}-pf-${i + 1}`, pkg.id, pkg.features[i], i + 1]
      );
    }
  }

  // 8. Projects & Project Images
  for (const p of store.projects) {
    await connection.execute(
      `INSERT INTO projects (
        id, title, slug, location, category, shortDescription, description, coverImage,
        galleryImages, completionDate, areaSqFt, architectLead, specifications,
        isFeatured, status, seoTitle, metaDescription
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), status=VALUES(status)`,
      [
        p.id,
        p.title,
        p.slug,
        p.location,
        p.category,
        p.shortDescription,
        p.description,
        p.coverImage,
        JSON.stringify(p.galleryImages || []),
        p.completionDate,
        p.areaSqFt,
        p.architectLead,
        JSON.stringify(p.specifications || []),
        p.isFeatured ? 1 : 0,
        p.status,
        p.seoTitle,
        p.metaDescription,
      ]
    );
    await connection.execute("DELETE FROM project_images WHERE projectId = ?", [p.id]);
    for (let i = 0; i < (p.galleryImages || []).length; i++) {
      await connection.execute(
        "INSERT INTO project_images (id, projectId, imageUrl, altText, displayOrder) VALUES (?, ?, ?, ?, ?)",
        [`${p.id}-img-${i + 1}`, p.id, p.galleryImages[i], `${p.title} - View ${i + 1}`, i + 1]
      );
    }
  }

  // 9. Gallery
  for (const g of store.gallery) {
    await connection.execute(
      `INSERT INTO galleries (id, title, category, imageUrl, altText, location, displayOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), imageUrl=VALUES(imageUrl)`,
      [g.id, g.title, g.category, g.imageUrl, g.altText, g.location || "", g.displayOrder]
    );
  }

  // 10. Blog Categories & Blogs
  for (const c of store.blogCategories) {
    await connection.execute(
      `INSERT INTO blog_categories (id, name, slug, description) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)`,
      [c.id, c.name, c.slug, c.description]
    );
  }

  for (const b of store.blogs) {
    await connection.execute(
      `INSERT INTO blogs (
        id, title, slug, shortDescription, content, featuredImage, imageAlt, author, authorRole,
        category, tags, readingTime, metaTitle, metaDescription, focusKeyword, canonicalUrl,
        ogImage, faqSchema, publishDate, status, isFeatured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status)`,
      [
        b.id,
        b.title,
        b.slug,
        b.shortDescription,
        b.content,
        b.featuredImage,
        b.imageAlt,
        b.author,
        b.authorRole,
        b.category,
        JSON.stringify(b.tags || []),
        b.readingTime,
        b.metaTitle,
        b.metaDescription,
        b.focusKeyword,
        b.canonicalUrl,
        b.ogImage,
        JSON.stringify(b.faqSchema || []),
        b.publishDate,
        b.status,
        b.isFeatured ? 1 : 0,
      ]
    );
  }

  // 11. SEO Pages & Locations
  for (const sp of store.seoPages) {
    await connection.execute(
      `INSERT INTO seo_pages (
        id, pageName, slug, routePrefix, metaTitle, metaDescription, h1Heading,
        focusKeyword, secondaryKeywords, pageContent, featuredImage, imageAltText,
        canonicalUrl, ogTitle, ogDescription, ogImage, robotsIndex, robotsFollow,
        faqContent, breadcrumbTitle, locationCity, locationArea, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE pageName=VALUES(pageName), metaTitle=VALUES(metaTitle), status=VALUES(status)`,
      [
        sp.id,
        sp.pageName,
        sp.slug,
        sp.routePrefix,
        sp.metaTitle,
        sp.metaDescription,
        sp.h1Heading,
        sp.focusKeyword,
        JSON.stringify(sp.secondaryKeywords || []),
        sp.pageContent,
        sp.featuredImage,
        sp.imageAltText,
        sp.canonicalUrl,
        sp.ogTitle,
        sp.ogDescription,
        sp.ogImage,
        sp.robotsIndex ? 1 : 0,
        sp.robotsFollow ? 1 : 0,
        JSON.stringify(sp.faqContent || []),
        sp.breadcrumbTitle,
        sp.locationCity || "",
        sp.locationArea || "",
        sp.status,
      ]
    );
    if (sp.routePrefix === "/locations") {
      await connection.execute(
        `INSERT INTO locations (id, name, slug, city, area, metaTitle, metaDescription, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), city=VALUES(city)`,
        [
          sp.id,
          sp.pageName,
          sp.slug,
          sp.locationCity || "Delhi NCR",
          sp.locationArea || "Shahdara",
          sp.metaTitle,
          sp.metaDescription,
          sp.status === "Published" ? 1 : 0,
        ]
      );
    }
  }

  // 12. Testimonials
  for (const t of store.testimonials) {
    await connection.execute(
      `INSERT INTO testimonials (id, clientName, clientRole, location, projectType, rating, content, avatarUrl, status, displayOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE clientName=VALUES(clientName), content=VALUES(content)`,
      [
        t.id,
        t.clientName,
        t.clientRole,
        t.location,
        t.projectType,
        t.rating,
        t.content,
        t.avatarUrl || null,
        t.status,
        t.displayOrder,
      ]
    );
  }

  // 13. FAQs
  for (const f of store.faqs) {
    await connection.execute(
      `INSERT INTO faqs (id, question, answer, category, displayOrder, isPublished)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE question=VALUES(question), answer=VALUES(answer)`,
      [f.id, f.question, f.answer, f.category, f.displayOrder, f.isPublished ? 1 : 0]
    );
  }

  // 14. Enquiries & Notes
  for (const e of store.enquiries) {
    await connection.execute(
      `INSERT INTO enquiries (
        id, customerName, phone, email, serviceRequired, propertyType,
        location, approxAreaSqFt, budget, message, status, followUpDate, sourcePage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE status=VALUES(status)`,
      [
        e.id,
        e.customerName,
        e.phone,
        e.email,
        e.serviceRequired,
        e.propertyType,
        e.location,
        e.approxAreaSqFt,
        e.budget,
        e.message,
        e.status,
        e.followUpDate || null,
        e.sourcePage || "/",
      ]
    );
    for (const n of e.internalNotes || []) {
      await connection.execute(
        `INSERT INTO enquiry_notes (id, enquiryId, note, author) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE note=VALUES(note)`,
        [n.id, e.id, n.note, n.author]
      );
    }
  }

  // 15. Media
  for (const m of store.media) {
    await connection.execute(
      `INSERT INTO media (id, title, url, altText, category, mimeType, sizeKb, displayOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), url=VALUES(url)`,
      [m.id, m.title, m.url, m.altText, m.category, m.mimeType, m.sizeKb, m.displayOrder]
    );
  }

  // 16. Social Links
  for (const sl of store.socialLinks) {
    await connection.execute(
      `INSERT INTO social_links (id, platform, url, icon, isActive, displayOrder)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE url=VALUES(url), isActive=VALUES(isActive)`,
      [sl.id, sl.platform, sl.url, sl.icon, sl.isActive ? 1 : 0, sl.displayOrder]
    );
  }
}

async function runSeed() {
  const storePath = path.join(process.cwd(), "data", "arch_tech_store.json");
  if (!fs.existsSync(storePath)) {
    console.error("Store JSON not found at", storePath);
    process.exit(1);
  }
  const store = JSON.parse(fs.readFileSync(storePath, "utf8"));

  const host = process.env.MYSQL_HOST || "localhost";
  const port = parseInt(process.env.MYSQL_PORT || "3306", 10);
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const primaryDb = process.env.MYSQL_DATABASE || "arch_tech";

  const connection = await mysql.createConnection({ host, port, user, password });
  await seedDatabase(connection, primaryDb, store);
  if (primaryDb !== "arch tech") {
    await seedDatabase(connection, "arch tech", store);
  }

  console.log("MySQL databases ('arch_tech' and 'arch tech') seeded with all initial records!");
  await connection.end();
}

runSeed().catch((err) => {
  console.error("Seed Error:", err.message);
  process.exit(1);
});
