import { db } from "@/lib/db";

export const cmsService = {
  async getPublicBootstrapData() {
    const [
      settings,
      homepageSections,
      aboutSection,
      services,
      pricingPackages,
      projects,
      testimonials,
      faqs,
      blogs,
      socialLinks,
      seoPages,
    ] = await Promise.all([
      db.getSiteSettings(),
      db.getHomepageSections(),
      db.getAboutSection(),
      db.getServices(true),
      db.getPricingPackages(true),
      db.getProjects(true),
      db.getTestimonials(true),
      db.getFAQs(true),
      db.getBlogs(true),
      db.getSocialLinks(),
      db.getSEOPages(true),
    ]);

    return {
      settings,
      homepageSections,
      aboutSection,
      services,
      pricingPackages,
      projects,
      testimonials,
      faqs,
      blogs,
      socialLinks,
      seoPages,
    };
  },

  async getAdminDashboardStats() {
    const [enquiries, projects, services, blogs, seoPages] = await Promise.all([
      db.getEnquiries(),
      db.getProjects(false),
      db.getServices(false),
      db.getBlogs(false),
      db.getSEOPages(false),
    ]);

    return {
      totalEnquiries: enquiries.length,
      newLeads: enquiries.filter((e) => e.status === "New").length,
      totalProjects: projects.length,
      totalServices: services.length,
      publishedBlogs: blogs.filter((b) => b.status === "Published").length,
      draftBlogs: blogs.filter((b) => b.status !== "Published").length,
      totalSEOPages: seoPages.length,
      recentEnquiries: enquiries.slice(0, 8),
    };
  },
};
