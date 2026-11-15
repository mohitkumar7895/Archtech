const mysql = require("mysql2/promise");
const fs = require("fs");

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

async function createAllTables(connection, dbName) {
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await connection.changeUser({ database: dbName });
  console.log(`Creating 24 relational tables inside MySQL database '${dbName}'...`);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      permissions TEXT,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      email VARCHAR(191) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      roleId VARCHAR(64) DEFAULT 'role-superadmin',
      roleName VARCHAR(100) DEFAULT 'Super Admin',
      avatar TEXT,
      isActive BOOLEAN DEFAULT TRUE,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
      companyName VARCHAR(191) DEFAULT 'ARCH NEW ERA DESIGN',
      brandIdentity VARCHAR(100) DEFAULT 'NRBL TECH',
      categoryText VARCHAR(255),
      contactPerson VARCHAR(191) DEFAULT 'Manoj Kumar Sharma',
      phone VARCHAR(50) DEFAULT '7535942407',
      whatsapp VARCHAR(50) DEFAULT '7535942407',
      email VARCHAR(191) DEFAULT 'manoj712009@gmail.com',
      address TEXT,
      tagline VARCHAR(255),
      supportingTagline VARCHAR(255),
      brandStatement VARCHAR(255),
      logoUrl TEXT,
      faviconUrl TEXT,
      heroTitle VARCHAR(255),
      heroSubtitle TEXT,
      heroCtaPrimaryText VARCHAR(100),
      heroCtaPrimaryLink VARCHAR(255),
      heroCtaSecondaryText VARCHAR(100),
      heroImage TEXT,
      heroGallery LONGTEXT,
      introBadge VARCHAR(191),
      introTitle VARCHAR(255),
      introDescription LONGTEXT,
      introHighlights LONGTEXT,
      experienceYears INT DEFAULT 12,
      projectsCompleted INT DEFAULT 185,
      sqftDelivered VARCHAR(100) DEFAULT '4.5L+ Sq. Ft.',
      clientSatisfaction VARCHAR(50) DEFAULT '99%',
      footerAbout TEXT,
      copyrightText VARCHAR(255),
      googleMapsEmbedUrl TEXT,
      workingHours VARCHAR(191),
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS homepage_sections (
      id VARCHAR(64) PRIMARY KEY,
      sectionKey VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT,
      badgeText VARCHAR(191),
      contentJson LONGTEXT,
      isEnabled BOOLEAN DEFAULT TRUE,
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_home_sec_order (orderIndex)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS about_sections (
      id VARCHAR(64) PRIMARY KEY,
      sectionKey VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT,
      content LONGTEXT,
      highlights LONGTEXT,
      imageUrl TEXT,
      founderName VARCHAR(191) DEFAULT 'Manoj Kumar Sharma',
      founderRole VARCHAR(191),
      founderMessage TEXT,
      mission TEXT,
      vision TEXT,
      valuesList LONGTEXT,
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS services (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      category VARCHAR(100),
      shortDescription TEXT,
      fullDescription LONGTEXT,
      startingPrice VARCHAR(100),
      iconName VARCHAR(100) DEFAULT 'Compass',
      featuredImage TEXT,
      gallery LONGTEXT,
      features LONGTEXT,
      faqs LONGTEXT,
      seoTitle VARCHAR(255),
      metaDescription TEXT,
      status VARCHAR(50) DEFAULT 'Published',
      orderIndex INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_services_slug (slug),
      INDEX idx_services_status (status, orderIndex)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS service_features (
      id VARCHAR(64) PRIMARY KEY,
      serviceId VARCHAR(64) NOT NULL,
      featureText VARCHAR(255) NOT NULL,
      displayOrder INT DEFAULT 0,
      INDEX idx_sf_service (serviceId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS pricing_packages (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      packageType VARCHAR(50) DEFAULT 'Construction',
      startingPrice VARCHAR(100) NOT NULL,
      priceUnit VARCHAR(50) DEFAULT '/ sq. ft.',
      tagline VARCHAR(255),
      description TEXT,
      features LONGTEXT,
      imageUrl TEXT,
      isPopular BOOLEAN DEFAULT FALSE,
      displayOrder INT DEFAULT 0,
      isActive BOOLEAN DEFAULT TRUE,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_pricing_order (isActive, displayOrder)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS pricing_features (
      id VARCHAR(64) PRIMARY KEY,
      packageId VARCHAR(64) NOT NULL,
      featureText VARCHAR(255) NOT NULL,
      displayOrder INT DEFAULT 0,
      INDEX idx_pf_package (packageId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      location VARCHAR(191),
      category VARCHAR(100),
      shortDescription TEXT,
      description LONGTEXT,
      coverImage TEXT,
      galleryImages LONGTEXT,
      completionDate VARCHAR(50),
      areaSqFt VARCHAR(100),
      architectLead VARCHAR(191) DEFAULT 'Manoj Kumar Sharma',
      specifications LONGTEXT,
      isFeatured BOOLEAN DEFAULT FALSE,
      status VARCHAR(50) DEFAULT 'Published',
      seoTitle VARCHAR(255),
      metaDescription TEXT,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_projects_slug (slug),
      INDEX idx_projects_cat (category, status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS project_images (
      id VARCHAR(64) PRIMARY KEY,
      projectId VARCHAR(64) NOT NULL,
      imageUrl TEXT NOT NULL,
      altText VARCHAR(255),
      displayOrder INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_pi_project (projectId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS galleries (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(191) NOT NULL,
      category VARCHAR(100),
      imageUrl TEXT NOT NULL,
      altText VARCHAR(255),
      location VARCHAR(191),
      displayOrder INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS blog_categories (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      description TEXT,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      shortDescription TEXT,
      content LONGTEXT,
      featuredImage TEXT,
      imageAlt VARCHAR(255),
      author VARCHAR(191) DEFAULT 'Manoj Kumar Sharma',
      authorRole VARCHAR(191),
      category VARCHAR(100),
      tags LONGTEXT,
      readingTime VARCHAR(50),
      metaTitle VARCHAR(255),
      metaDescription TEXT,
      focusKeyword VARCHAR(191),
      canonicalUrl VARCHAR(255),
      ogImage TEXT,
      faqSchema LONGTEXT,
      publishDate VARCHAR(50),
      status VARCHAR(50) DEFAULT 'Published',
      isFeatured BOOLEAN DEFAULT FALSE,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_blogs_slug (slug),
      INDEX idx_blogs_status (status, publishDate)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS blog_tags (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(100) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS blog_tag_relations (
      blogId VARCHAR(64) NOT NULL,
      tagId VARCHAR(64) NOT NULL,
      PRIMARY KEY (blogId, tagId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS seo_pages (
      id VARCHAR(64) PRIMARY KEY,
      pageName VARCHAR(255) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      routePrefix VARCHAR(50) DEFAULT '/pages',
      metaTitle VARCHAR(255),
      metaDescription TEXT,
      h1Heading VARCHAR(255),
      focusKeyword VARCHAR(191),
      secondaryKeywords LONGTEXT,
      pageContent LONGTEXT,
      featuredImage TEXT,
      imageAltText VARCHAR(255),
      canonicalUrl VARCHAR(255),
      ogTitle VARCHAR(255),
      ogDescription TEXT,
      ogImage TEXT,
      robotsIndex BOOLEAN DEFAULT TRUE,
      robotsFollow BOOLEAN DEFAULT TRUE,
      faqContent LONGTEXT,
      breadcrumbTitle VARCHAR(191),
      locationCity VARCHAR(100),
      locationArea VARCHAR(191),
      status VARCHAR(50) DEFAULT 'Published',
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_seo_slug (slug),
      INDEX idx_seo_status (status, routePrefix)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS locations (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL UNIQUE,
      city VARCHAR(100),
      area VARCHAR(191),
      metaTitle VARCHAR(255),
      metaDescription TEXT,
      isActive BOOLEAN DEFAULT TRUE,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id VARCHAR(64) PRIMARY KEY,
      clientName VARCHAR(191) NOT NULL,
      clientRole VARCHAR(191),
      location VARCHAR(191),
      projectType VARCHAR(191),
      rating INT DEFAULT 5,
      content TEXT NOT NULL,
      avatarUrl TEXT,
      status VARCHAR(50) DEFAULT 'Published',
      displayOrder INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS faqs (
      id VARCHAR(64) PRIMARY KEY,
      question TEXT NOT NULL,
      answer LONGTEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      displayOrder INT DEFAULT 0,
      isPublished BOOLEAN DEFAULT TRUE,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id VARCHAR(64) PRIMARY KEY,
      customerName VARCHAR(191) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(191),
      serviceRequired VARCHAR(191),
      propertyType VARCHAR(191),
      location VARCHAR(191),
      approxAreaSqFt VARCHAR(100),
      budget VARCHAR(100),
      message TEXT,
      status VARCHAR(50) DEFAULT 'New',
      followUpDate VARCHAR(50),
      sourcePage VARCHAR(191),
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_enq_status (status, createdAt)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS enquiry_notes (
      id VARCHAR(64) PRIMARY KEY,
      enquiryId VARCHAR(64) NOT NULL,
      note TEXT NOT NULL,
      author VARCHAR(191) DEFAULT 'Manoj Kumar Sharma',
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_enq_notes_enq (enquiryId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS media (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(191) NOT NULL,
      url TEXT NOT NULL,
      altText VARCHAR(255),
      category VARCHAR(100) DEFAULT 'General',
      mimeType VARCHAR(100) DEFAULT 'image/jpeg',
      sizeKb INT DEFAULT 120,
      displayOrder INT DEFAULT 0,
      createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS social_links (
      id VARCHAR(64) PRIMARY KEY,
      platform VARCHAR(100) NOT NULL,
      url TEXT NOT NULL,
      icon VARCHAR(100),
      isActive BOOLEAN DEFAULT TRUE,
      displayOrder INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function init() {
  const host = process.env.MYSQL_HOST || "localhost";
  const port = parseInt(process.env.MYSQL_PORT || "3306", 10);
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const primaryDb = process.env.MYSQL_DATABASE || "arch_tech";

  console.log(`Connecting to MySQL at ${host}:${port}...`);
  const connection = await mysql.createConnection({ host, port, user, password });

  await createAllTables(connection, primaryDb);
  // Also create 'arch tech' (with space) so both 'arch_tech' and 'arch tech' exist in MySQL
  if (primaryDb !== "arch tech") {
    await createAllTables(connection, "arch tech");
  }

  console.log("MySQL databases ('arch_tech' and 'arch tech') initialized successfully!");
  await connection.end();
}

init().catch((err) => {
  console.error("MySQL Initialization Error:", err.message);
  process.exit(1);
});
