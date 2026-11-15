import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, Share2, Tag } from "lucide-react";
import { db } from "@/lib/db";
import { cmsService } from "@/services/cmsService";
import { PublicShell } from "@/components/layout/PublicShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BlogCard } from "@/components/BlogCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ContactForm } from "@/components/forms/ContactForm";
import { generateArticleSchema, generateFAQSchema } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/metadata";
import { formatWhatsAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await db.getBlogBySlug(params.slug);
  if (!blog) {
    return buildPageMetadata({
      title: "Article Not Found",
      description: "Requested blog article could not be found.",
      path: `/blog/${params.slug}`,
      robotsIndex: false,
    });
  }
  return buildPageMetadata({
    title: blog.metaTitle || `${blog.title} | ARCH NEW ERA DESIGN`,
    description: blog.metaDescription || blog.shortDescription,
    path: `/blog/${blog.slug}`,
    canonicalUrl: blog.canonicalUrl,
    ogImage: blog.ogImage || blog.featuredImage,
    keywords: [blog.focusKeyword, ...(blog.tags || [])].filter(Boolean),
    isPublished: blog.status === "Published",
  });
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await db.getBlogBySlug(params.slug);
  if (!blog || blog.status !== "Published") {
    notFound();
  }

  const { settings, services, blogs, socialLinks, seoPages } =
    await cmsService.getPublicBootstrapData();

  const relatedBlogs = blogs
    .filter((b) => b.slug !== blog.slug && (b.category === blog.category || true))
    .slice(0, 3);

  const articleSchema = generateArticleSchema(blog, settings);
  const faqSchema = generateFAQSchema(blog.faqSchema || []);
  const shareUrl = `http://localhost:3000/blog/${blog.slug}`;

  return (
    <PublicShell
      settings={settings}
      services={services}
      socialLinks={socialLinks}
      seoPages={seoPages}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Article Header */}
      <section className="bg-gradient-to-r from-[#071A35] to-[#10284A] text-white py-16 border-b border-[#D6B36A]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <Breadcrumbs
            items={[
              { name: "Blog", url: "/blog" },
              { name: blog.title, url: `/blog/${blog.slug}` },
            ]}
          />

          <span className="inline-block px-3.5 py-1 rounded-full bg-[#D6B36A] text-[#071A35] text-xs font-bold uppercase tracking-wider">
            {blog.category}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-300 pt-1">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#D6B36A]" />
              <strong>{blog.author}</strong> ({blog.authorRole})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D6B36A]" />
              {blog.publishDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D6B36A]" />
              {blog.readingTime}
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F6F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Article Body */}
            <div className="lg:col-span-8 space-y-8">
              <article className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <img
                  src={blog.featuredImage}
                  alt={blog.imageAlt || blog.title}
                  className="w-full h-[380px] object-cover"
                />

                <div className="p-7 sm:p-10 space-y-6">
                  <div
                    className="prose-arch text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  {/* Tags & Social Share */}
                  <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag className="w-4 h-4 text-[#D6B36A]" />
                      {(blog.tags || []).map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-[#F6F7FA] border border-slate-200 text-xs font-semibold text-[#071A35]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 inline-flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5" /> Share:
                      </span>
                      <a
                        href={formatWhatsAppUrl("", `${blog.title} - ${shareUrl}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </article>

              {/* Author Box */}
              <div className="rounded-2xl bg-[#071A35] text-white p-7 border border-[#D6B36A]/40 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#D6B36A] text-[#071A35] flex items-center justify-center font-serif font-bold text-2xl shrink-0">
                  NS
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D6B36A]">
                    ABOUT THE AUTHOR
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">{blog.author}</h3>
                  <p className="text-xs text-[#F2D99B]">{blog.authorRole}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Leading architectural planning, civil construction, and turnkey interior projects at{" "}
                    <strong>{settings.companyName} ({settings.brandIdentity})</strong>, {settings.address}
                  </p>
                </div>
              </div>

              {/* Blog FAQs */}
              {blog.faqSchema?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#071A35]">
                    Article FAQs
                  </h3>
                  <FAQAccordion faqs={blog.faqSchema} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl bg-white p-6 border-2 border-[#D6B36A]/50 shadow-luxury space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B89246]">
                  FREE PROJECT CONSULTATION
                </span>
                <h3 className="font-serif text-xl font-bold text-[#071A35]">
                  Plan Your Project with {settings.contactPerson}
                </h3>
                <ContactForm
                  sourcePage={`/blog/${blog.slug}`}
                  compact
                  whatsappNumber={settings.whatsapp}
                  contactPerson={settings.contactPerson}
                />
              </div>

              {/* Recent Articles */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#071A35]">
                  Related & Recent Articles
                </h3>
                <div className="space-y-3">
                  {relatedBlogs.map((rb) => (
                    <Link
                      key={rb.id}
                      href={`/blog/${rb.slug}`}
                      className="block p-3 rounded-xl bg-[#F6F7FA] hover:bg-[#FBF6EA] border border-slate-200/70 transition"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89246]">
                        {rb.category}
                      </span>
                      <p className="font-serif font-bold text-sm text-[#071A35] mt-0.5 line-clamp-2">
                        {rb.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {relatedBlogs.length > 0 && (
            <div className="pt-14 mt-10 border-t border-slate-200 space-y-8">
              <h2 className="font-serif text-3xl font-bold text-[#071A35]">
                More Architectural Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {relatedBlogs.map((rb) => (
                  <BlogCard key={rb.id} blog={rb} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
