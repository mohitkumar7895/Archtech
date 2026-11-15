import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [
    siteSettings,
    homepageSections,
    aboutSection,
    services,
    pricingPackages,
    projects,
    gallery,
    blogs,
    blogCategories,
    seoPages,
    testimonials,
    faqs,
    enquiries,
    media,
    socialLinks,
    users,
  ] = await Promise.all([
    db.getSiteSettings(),
    db.getHomepageSections(),
    db.getAboutSection(),
    db.getServices(false),
    db.getPricingPackages(false),
    db.getProjects(false),
    db.getGallery(),
    db.getBlogs(false),
    db.getBlogCategories(),
    db.getSEOPages(false),
    db.getTestimonials(false),
    db.getFAQs(false),
    db.getEnquiries(),
    db.getMedia(),
    db.getSocialLinks(),
    db.getUsers(),
  ]);

  return (
    <AdminDashboardClient
      currentUser={user}
      initialData={{
        siteSettings,
        homepageSections,
        aboutSection,
        services,
        pricingPackages,
        projects,
        gallery,
        blogs,
        blogCategories,
        seoPages,
        testimonials,
        faqs,
        enquiries,
        media,
        socialLinks,
        users: users.map(({ password, ...rest }) => rest),
      }}
    />
  );
}
