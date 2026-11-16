import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth, canManageUsers } from "@/lib/permissions";
import { hashPassword } from "@/lib/auth";
import { validateSEOPageInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleName = searchParams.get("module");

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
    roles,
    realEstateSection,
    realEstateProperties,
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
    db.getRoles(),
    db.getRealEstateSection(),
    db.getRealEstateProperties(false),
  ]);

  if (moduleName === "public") {
    return NextResponse.json({
      siteSettings,
      homepageSections,
      aboutSection,
      services: services.filter((s) => s.status === "Published"),
      pricingPackages: pricingPackages.filter((p) => p.isActive),
      projects: projects.filter((p) => p.status === "Published"),
      gallery,
      blogs: blogs.filter((b) => b.status === "Published"),
      blogCategories,
      seoPages: seoPages.filter((p) => p.status === "Published"),
      testimonials: testimonials.filter((t) => t.status === "Published"),
      faqs: faqs.filter((f) => f.isPublished),
      socialLinks: socialLinks.filter((l) => l.isActive),
      realEstateSection,
      realEstateProperties,
    });
  }

  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  return NextResponse.json({
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
    realEstateSection,
    realEstateProperties,
    users: users.map(({ password, ...rest }) => rest),
    roles,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.authorized || !auth.user) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { module, action, data, id } = body;

    switch (module) {
      case "siteSettings": {
        const updated = await db.updateSiteSettings(data);
        revalidatePath("/", "layout");
        return NextResponse.json({ success: true, data: updated });
      }

      case "homepageSections": {
        const updated = await db.updateHomepageSections(data);
        revalidatePath("/");
        return NextResponse.json({ success: true, data: updated });
      }

      case "aboutSection": {
        const updated = await db.updateAboutSection(data);
        revalidatePath("/");
        revalidatePath("/about");
        return NextResponse.json({ success: true, data: updated });
      }

      case "services": {
        if (action === "delete" && id) {
          await db.deleteService(id);
          revalidatePath("/");
          revalidatePath("/services");
          return NextResponse.json({ success: true });
        }
        const saved = await db.saveService(data);
        revalidatePath("/");
        revalidatePath("/services");
        revalidatePath(`/services/${saved.slug}`);
        return NextResponse.json({ success: true, data: saved });
      }

      case "pricingPackages": {
        if (action === "delete" && id) {
          await db.deletePricingPackage(id);
          revalidatePath("/");
          revalidatePath("/pricing");
          return NextResponse.json({ success: true });
        }
        const saved = await db.savePricingPackage(data);
        revalidatePath("/");
        revalidatePath("/pricing");
        return NextResponse.json({ success: true, data: saved });
      }

      case "projects": {
        if (action === "delete" && id) {
          await db.deleteProject(id);
          revalidatePath("/");
          revalidatePath("/projects");
          return NextResponse.json({ success: true });
        }
        const saved = await db.saveProject(data);
        revalidatePath("/");
        revalidatePath("/projects");
        revalidatePath(`/projects/${saved.slug}`);
        return NextResponse.json({ success: true, data: saved });
      }

      case "gallery": {
        if (action === "delete" && id) {
          await db.deleteGalleryItem(id);
          revalidatePath("/projects");
          return NextResponse.json({ success: true });
        }
        const saved = await db.saveGalleryItem(data);
        revalidatePath("/projects");
        return NextResponse.json({ success: true, data: saved });
      }

      case "blogs": {
        if (action === "delete" && id) {
          await db.deleteBlog(id);
          revalidatePath("/");
          revalidatePath("/blog");
          return NextResponse.json({ success: true });
        }
        const saved = await db.saveBlog(data);
        revalidatePath("/");
        revalidatePath("/blog");
        revalidatePath(`/blog/${saved.slug}`);
        return NextResponse.json({ success: true, data: saved });
      }

      case "blogCategories": {
        if (action === "delete" && id) {
          await db.deleteBlogCategory(id);
          revalidatePath("/blog");
          return NextResponse.json({ success: true });
        }
        const saved = await db.saveBlogCategory(data);
        revalidatePath("/blog");
        return NextResponse.json({ success: true, data: saved });
      }

      case "seoPages": {
        if (action === "delete" && id) {
          await db.deleteSEOPage(id);
          revalidatePath("/sitemap.xml");
          return NextResponse.json({ success: true });
        }
        const allPages = await db.getSEOPages(false);
        const otherSlugs = allPages.filter((p) => p.id !== data.id).map((p) => p.slug);
        const warnings = validateSEOPageInput(data, otherSlugs);
        const saved = await db.saveSEOPage(data);
        revalidatePath(`/locations/${saved.slug}`);
        revalidatePath(`/pages/${saved.slug}`);
        revalidatePath("/sitemap.xml");
        return NextResponse.json({ success: true, data: saved, warnings });
      }

      case "testimonials": {
        if (action === "delete" && id) {
          await db.deleteTestimonial(id);
          revalidatePath("/");
          return NextResponse.json({ success: true });
        }
        const saved = await db.saveTestimonial(data);
        revalidatePath("/");
        return NextResponse.json({ success: true, data: saved });
      }

      case "faqs": {
        if (action === "delete" && id) {
          await db.deleteFAQ(id);
          revalidatePath("/");
          return NextResponse.json({ success: true });
        }
        const saved = await db.saveFAQ(data);
        revalidatePath("/");
        return NextResponse.json({ success: true, data: saved });
      }

      case "media": {
        if (action === "delete" && id) {
          await db.deleteMedia(id);
          return NextResponse.json({ success: true });
        }
        const saved = await db.saveMedia(data);
        return NextResponse.json({ success: true, data: saved });
      }

      case "socialLinks": {
        const saved = await db.saveSocialLinks(data);
        revalidatePath("/", "layout");
        return NextResponse.json({ success: true, data: saved });
      }

      case "realEstateSection": {
        const updated = await db.updateRealEstateSection(data);
        revalidatePath("/");
        revalidatePath("/real-estate");
        return NextResponse.json({ success: true, data: updated });
      }

      case "realEstateProperties": {
        if (action === "delete" && id) {
          await db.deleteRealEstateProperty(id);
          revalidatePath("/");
          revalidatePath("/real-estate");
          return NextResponse.json({ success: true });
        }
        const saved = await db.saveRealEstateProperty(data);
        revalidatePath("/");
        revalidatePath("/real-estate");
        return NextResponse.json({ success: true, data: saved });
      }

      case "users": {
        if (!canManageUsers(auth.user)) {
          return NextResponse.json({ error: "Super Admin permission required to manage users." }, { status: 403 });
        }
        if (action === "delete" && id) {
          const ok = await db.deleteUser(id);
          if (!ok) {
            return NextResponse.json({ error: "Cannot delete the last remaining admin account." }, { status: 400 });
          }
          return NextResponse.json({ success: true });
        }
        const payload = { ...data };
        if (payload.newPassword && payload.newPassword.trim().length >= 5) {
          payload.password = await hashPassword(payload.newPassword.trim());
        }
        const saved = await db.saveUser(payload);
        const { password, ...safeUser } = saved;
        return NextResponse.json({ success: true, data: safeUser });
      }

      case "profile": {
        const currentUser = await db.getUserByEmail(auth.user.email);
        if (!currentUser) {
          return NextResponse.json({ error: "User account not found." }, { status: 404 });
        }
        const { name, email, currentPassword, newPassword } = data || {};
        if (newPassword && newPassword.trim()) {
          if (newPassword.trim().length < 5) {
            return NextResponse.json({ error: "New password must be at least 5 characters." }, { status: 400 });
          }
          if (currentPassword) {
            const { comparePassword } = await import("@/lib/auth");
            const isValid = await comparePassword(currentPassword, currentUser.password || "");
            if (!isValid) {
              return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
            }
          }
          currentUser.password = await hashPassword(newPassword.trim());
        }
        if (name && name.trim()) currentUser.name = name.trim();
        if (email && email.trim()) currentUser.email = email.trim().toLowerCase();
        currentUser.updatedAt = new Date().toISOString();
        const saved = await db.saveUser(currentUser);
        const { password, ...safeUser } = saved;
        return NextResponse.json({ success: true, data: safeUser, message: "Profile and password updated successfully!" });
      }

      default:
        return NextResponse.json({ error: `Unknown CMS module: ${module}` }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "CMS operation failed" }, { status: 500 });
  }
}
