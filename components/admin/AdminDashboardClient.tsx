"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Home,
  Info,
  Compass,
  Layers,
  Briefcase,
  Image as ImageIcon,
  FileText,
  FolderKanban,
  Globe,
  MapPin,
  MessageSquareQuote,
  HelpCircle,
  Users,
  PhoneCall,
  UserCheck,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Sun,
  Moon,
  Bell,
  Save,
  Upload,
  CheckCircle2,
  MessageCircle,
  Search,
  ChevronRight,
  Copy,
  X,
  Star,
  Images,
  Loader2,
  Menu,
  Building2,
  Handshake,
  Bed,
  Bath,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";
import {
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
  User,
  LeadStatus,
  RealEstateSection,
  RealEstateProperty,
  RealEstateCategory,
  RealEstateStatus,
  RealEstateListingType,
} from "@/types";
import { RichTextEditor } from "./RichTextEditor";
import { SeoValidator } from "./SeoValidator";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { slugify, formatWhatsAppUrl } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

type AdminTab =
  | "dashboard"
  | "settings"
  | "homepage"
  | "about"
  | "services"
  | "pricing"
  | "projects"
  | "real-estate"
  | "gallery"
  | "blogs"
  | "blog_categories"
  | "seo"
  | "locations"
  | "testimonials"
  | "faqs"
  | "enquiries"
  | "media"
  | "contact"
  | "users"
  | "profile";

interface AdminBootstrapProps {
  currentUser: {
    userId: string;
    name: string;
    email: string;
    roleId: string;
    roleName: string;
  };
  initialData: {
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
    realEstateSection?: RealEstateSection;
    realEstateProperties?: RealEstateProperty[];
    users: Omit<User, "password">[];
  };
}

export function AdminDashboardClient({ currentUser, initialData }: AdminBootstrapProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isTabPending, startTabTransition] = React.useTransition();
  const [saving, setSaving] = useState(false);

  const handleTabChange = (tab: AdminTab) => {
    startTabTransition(() => {
      setActiveTab(tab);
    });
    setMobileSidebarOpen(false);
  };

  // State mirrors of all MySQL tables
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialData.siteSettings);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>(
    initialData.homepageSections
  );
  const [aboutSection, setAboutSection] = useState<AboutSection>(initialData.aboutSection);
  const [services, setServices] = useState<Service[]>(initialData.services);
  const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>(
    initialData.pricingPackages
  );
  const [projects, setProjects] = useState<Project[]>(initialData.projects);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialData.gallery);
  const [blogs, setBlogs] = useState<Blog[]>(initialData.blogs);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>(
    initialData.blogCategories
  );
  const [seoPages, setSeoPages] = useState<SEOPage[]>(initialData.seoPages);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData.testimonials);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialData.faqs);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialData.enquiries);
  const [media, setMedia] = useState<MediaAsset[]>(initialData.media);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialData.socialLinks);
  const [users, setUsers] = useState<Omit<User, "password">[]>(initialData.users);
  const [realEstateSection, setRealEstateSection] = useState<RealEstateSection>(
    initialData.realEstateSection || {
      id: "default-real-estate",
      badgeText: "REAL ESTATE & PROPERTY SOLUTIONS",
      title: "Buy, Sell, Collaborate & Invest in Verified Properties Across Delhi NCR",
      subtitle:
        "Under the guidance of Manoj Kumar Sharma (ARCH NEW ERA DESIGN – NRBL TECH) — 100% Freehold Registry Plots, Luxury Builder Floors, Joint Venture Collaborations & High-Yield Commercial Assets.",
      description: "",
      highlights: [],
      stats: [],
      servicesOffered: [],
      collaborationCtaTitle: "Have a Plot or Old House? Let's Build Together with Zero Investment from You!",
      collaborationCtaSubtitle: "Partner with Manoj Kumar Sharma for a 50:50 Builder Collaboration.",
      isEnabled: true,
      updatedAt: new Date().toISOString(),
    }
  );
  const [realEstateProperties, setRealEstateProperties] = useState<RealEstateProperty[]>(
    initialData.realEstateProperties || []
  );

  // Active editor states
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingPackage, setEditingPackage] = useState<Partial<PricingPackage> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingProperty, setEditingProperty] = useState<Partial<RealEstateProperty> | null>(null);
  const [realEstateSubTab, setRealEstateSubTab] = useState<"listings" | "settings">("listings");
  const [propertyCategoryFilter, setPropertyCategoryFilter] = useState("All");
  const [propertyFeatureInput, setPropertyFeatureInput] = useState("");
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<BlogCategory> | null>(null);
  const [editingSEOPage, setEditingSEOPage] = useState<Partial<SEOPage> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<Partial<FAQItem> | null>(null);
  const [editingUser, setEditingUser] = useState<
    (Partial<User> & { newPassword?: string }) | null
  >(null);

  // Lead CRM filters
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("All");
  const [leadServiceFilter, setLeadServiceFilter] = useState<string>("All");
  const [selectedLead, setSelectedLead] = useState<Enquiry | null>(null);
  const [noteInput, setNoteInput] = useState("");

  // Media Upload state
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newMediaTitle, setNewMediaTitle] = useState("");
  const [newMediaAlt, setNewMediaAlt] = useState("");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaCategory, setNewMediaCategory] = useState<MediaAsset["category"]>("General");

  // Universal media management state
  const [uploadingServiceFeatured, setUploadingServiceFeatured] = useState(false);
  const [uploadingServiceGallery, setUploadingServiceGallery] = useState(false);
  const [serviceGalleryUrlInput, setServiceGalleryUrlInput] = useState("");
  const [mediaPickerTarget, setMediaPickerTarget] = useState<
    | "serviceFeatured"
    | "serviceGallery"
    | "projectCover"
    | "projectGallery"
    | "heroImage"
    | "logoUrl"
    | "galleryItem"
    | "blogFeatured"
    | "aboutImage"
    | "propertyFeatured"
    | "propertyGallery"
    | null
  >(null);
  const [mediaPickerSearch, setMediaPickerSearch] = useState("");
  const [mediaPickerCategory, setMediaPickerCategory] = useState<string>("All");

  // Profile edit & password change state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Generic direct image uploader
  const uploadImageFile = async (file: File, title = ""): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name.replace(/\.[^/.]+$/, ""));
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "File upload failed");
        return null;
      }
      if (json.asset) {
        setMedia((prev) => [json.asset, ...prev]);
      }
      toast.success("Image uploaded successfully!");
      return json.url;
    } catch {
      toast.error("Upload network error");
      return null;
    }
  };

  // Responsive mobile sidebar state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    module: string;
    id: string;
    name: string;
  } | null>(null);

  const sidebarItems: { id: AdminTab; label: string; icon: React.ComponentType<any>; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "settings", label: "Website Settings", icon: Settings },
    { id: "homepage", label: "Homepage Management", icon: Home },
    { id: "about", label: "About Management", icon: Info },
    { id: "services", label: "Services", icon: Compass, badge: services.length },
    { id: "pricing", label: "Pricing & Packages", icon: Layers, badge: pricingPackages.length },
    { id: "projects", label: "Projects", icon: Briefcase, badge: projects.length },
    { id: "real-estate", label: "Real Estate & Plots", icon: Building2, badge: realEstateProperties.length },
    { id: "gallery", label: "Gallery", icon: ImageIcon, badge: gallery.length },
    { id: "blogs", label: "Blog Management", icon: FileText, badge: blogs.length },
    { id: "blog_categories", label: "Blog Categories", icon: FolderKanban },
    { id: "seo", label: "SEO Management", icon: Globe, badge: seoPages.length },
    {
      id: "locations",
      label: "Location Pages",
      icon: MapPin,
      badge: seoPages.filter((p) => p.routePrefix === "/locations").length,
    },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "faqs", label: "FAQ Management", icon: HelpCircle },
    {
      id: "enquiries",
      label: "Enquiries / Leads",
      icon: PhoneCall,
      badge: enquiries.filter((e) => e.status === "New").length,
    },
    { id: "media", label: "Media Library", icon: Upload, badge: media.length },
    { id: "contact", label: "Contact Settings", icon: UserCheck },
    { id: "users", label: "Admin Users", icon: Users },
    { id: "profile", label: "Profile", icon: UserCheck },
  ];

  // Generic CMS POST helper
  const postCMS = async (module: string, payload: any, action = "save", id?: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ module, action, data: payload, id }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Admin session expired. Please log in again.");
          router.push("/admin/login");
        } else {
          toast.error(json.error || "Operation failed");
        }
        setSaving(false);
        return null;
      }
      setSaving(false);
      router.refresh();
      return json;
    } catch {
      toast.error("Network communication error. Please check your connection.");
      setSaving(false);
      return null;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { module, id, name } = deleteTarget;

    if (module === "enquiries") {
      setSaving(true);
      const res = await fetch(`/api/enquiries?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setSaving(false);
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
        toast.success(`Deleted enquiry "${name}"`);
      }
      setDeleteTarget(null);
      return;
    }

    const res = await postCMS(module, null, "delete", id);
    if (res?.success) {
      if (module === "services") setServices((p) => p.filter((x) => x.id !== id));
      if (module === "pricingPackages") setPricingPackages((p) => p.filter((x) => x.id !== id));
      if (module === "projects") setProjects((p) => p.filter((x) => x.id !== id));
      if (module === "realEstateProperties") setRealEstateProperties((p) => p.filter((x) => x.id !== id));
      if (module === "gallery") setGallery((p) => p.filter((x) => x.id !== id));
      if (module === "blogs") setBlogs((p) => p.filter((x) => x.id !== id));
      if (module === "blogCategories") setBlogCategories((p) => p.filter((x) => x.id !== id));
      if (module === "seoPages") setSeoPages((p) => p.filter((x) => x.id !== id));
      if (module === "testimonials") setTestimonials((p) => p.filter((x) => x.id !== id));
      if (module === "faqs") setFaqs((p) => p.filter((x) => x.id !== id));
      if (module === "media") setMedia((p) => p.filter((x) => x.id !== id));
      if (module === "users") setUsers((p) => p.filter((x) => x.id !== id));
      toast.success(`Deleted "${name}" from MySQL database.`);
    }
    setDeleteTarget(null);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out of Admin CMS");
    router.push("/admin/login");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", newMediaTitle || file.name);
      formData.append("altText", newMediaAlt || newMediaTitle || file.name);
      formData.append("category", newMediaCategory);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Upload failed");
      } else {
        setMedia((prev) => [json.asset, ...prev]);
        setNewMediaTitle("");
        setNewMediaAlt("");
        toast.success("Image uploaded & added to Media Library!");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingFile(false);
    }
  };

  // Service media handlers
  const handleServiceFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingServiceFeatured(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", `${editingService?.name || "Service"} Featured Image`);
      formData.append("altText", `${editingService?.name || "Service"} architectural render`);
      formData.append("category", "Service");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Featured image upload failed");
      } else {
        setEditingService((prev) => (prev ? { ...prev, featuredImage: json.url } : null));
        if (json.asset) {
          setMedia((prev) => [json.asset, ...prev]);
        }
        toast.success("Featured image uploaded and set!");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingServiceFeatured(false);
      e.target.value = "";
    }
  };

  const handleServiceGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingServiceGallery(true);
    let successCount = 0;
    const newUrls: string[] = [];
    const newAssets: MediaAsset[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", `${editingService?.name || "Service"} Gallery Photo`);
        formData.append("altText", `${editingService?.name || "Service"} project reference`);
        formData.append("category", "Service");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (res.ok && json.url) {
          newUrls.push(json.url);
          if (json.asset) newAssets.push(json.asset);
          successCount++;
        }
      }

      if (newUrls.length > 0) {
        setEditingService((prev) => {
          if (!prev) return null;
          const currentGallery = prev.gallery || [];
          return {
            ...prev,
            gallery: [...currentGallery, ...newUrls],
          };
        });
        if (newAssets.length > 0) {
          setMedia((prev) => [...newAssets, ...prev]);
        }
        toast.success(`${successCount} photo(s) added to service gallery!`);
      } else {
        toast.error("Failed to upload photos");
      }
    } catch {
      toast.error("Error during gallery upload");
    } finally {
      setUploadingServiceGallery(false);
      e.target.value = "";
    }
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setEditingService((prev) => {
      if (!prev) return null;
      const currentGallery = prev.gallery || [];
      return {
        ...prev,
        gallery: currentGallery.filter((_, i) => i !== idxToRemove),
      };
    });
    toast.info("Photo removed from gallery");
  };

  const handleSetFeaturedFromGallery = (url: string) => {
    setEditingService((prev) => (prev ? { ...prev, featuredImage: url } : null));
    toast.success("Set as featured cover image!");
  };

  const handleAddGalleryUrl = () => {
    const url = serviceGalleryUrlInput.trim();
    if (!url) return;
    setEditingService((prev) => {
      if (!prev) return null;
      const currentGallery = prev.gallery || [];
      if (currentGallery.includes(url)) {
        toast.info("Image already in service gallery");
        return prev;
      }
      return {
        ...prev,
        gallery: [...currentGallery, url],
      };
    });
    setServiceGalleryUrlInput("");
    toast.success("Image URL added to gallery!");
  };

  const handleSelectFromMediaPicker = (asset: MediaAsset) => {
    if (mediaPickerTarget === "serviceFeatured") {
      setEditingService((prev) => (prev ? { ...prev, featuredImage: asset.url } : null));
      toast.success("Featured image updated from Media Library!");
    } else if (mediaPickerTarget === "serviceGallery") {
      setEditingService((prev) => {
        if (!prev) return null;
        const currentGallery = prev.gallery || [];
        if (currentGallery.includes(asset.url)) {
          toast.info("Image already in gallery");
          return prev;
        }
        return {
          ...prev,
          gallery: [...currentGallery, asset.url],
        };
      });
      toast.success("Added photo to service gallery!");
    } else if (mediaPickerTarget === "projectCover") {
      setEditingProject((prev) => (prev ? { ...prev, coverImage: asset.url } : null));
      toast.success("Project cover photo updated!");
    } else if (mediaPickerTarget === "projectGallery") {
      setEditingProject((prev) => {
        if (!prev) return null;
        const currentGallery = prev.galleryImages || [];
        if (currentGallery.includes(asset.url)) {
          toast.info("Image already in project gallery");
          return prev;
        }
        return {
          ...prev,
          galleryImages: [...currentGallery, asset.url],
        };
      });
      toast.success("Added photo to project gallery!");
    } else if (mediaPickerTarget === "heroImage") {
      setSiteSettings((prev) => ({ ...prev, heroImage: asset.url }));
      toast.success("Homepage hero image updated!");
    } else if (mediaPickerTarget === "logoUrl") {
      setSiteSettings((prev) => ({ ...prev, logoUrl: asset.url }));
      toast.success("Website logo updated!");
    } else if (mediaPickerTarget === "galleryItem") {
      setEditingGallery((prev) => (prev ? { ...prev, imageUrl: asset.url } : null));
      toast.success("Gallery photo updated!");
    } else if (mediaPickerTarget === "blogFeatured") {
      setEditingBlog((prev) => (prev ? { ...prev, featuredImage: asset.url } : null));
      toast.success("Blog featured image updated!");
    } else if (mediaPickerTarget === "aboutImage") {
      setAboutSection((prev) => ({ ...prev, imageUrl: asset.url }));
      toast.success("About page image updated!");
    } else if (mediaPickerTarget === "propertyFeatured") {
      setEditingProperty((prev) => (prev ? { ...prev, featuredImage: asset.url } : null));
      toast.success("Property featured image updated!");
    } else if (mediaPickerTarget === "propertyGallery") {
      setEditingProperty((prev) => {
        if (!prev) return null;
        const currentGallery = prev.galleryImages || [];
        if (currentGallery.includes(asset.url)) {
          toast.info("Image already in property gallery");
          return prev;
        }
        return {
          ...prev,
          galleryImages: [...currentGallery, asset.url],
        };
      });
      toast.success("Added photo to property gallery!");
    }
    setMediaPickerTarget(null);
  };

  const filteredPickerMedia = media.filter((m) => {
    const matchCat = mediaPickerCategory === "All" || m.category === mediaPickerCategory;
    const matchSearch =
      !mediaPickerSearch ||
      m.title.toLowerCase().includes(mediaPickerSearch.toLowerCase()) ||
      m.altText.toLowerCase().includes(mediaPickerSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filtered Enquiries for CRM
  const filteredEnquiries = enquiries.filter((e) => {
    const matchStatus = leadStatusFilter === "All" || e.status === leadStatusFilter;
    const matchService = leadServiceFilter === "All" || e.serviceRequired === leadServiceFilter;
    const q = leadSearch.trim().toLowerCase();
    const matchQuery =
      !q ||
      e.customerName.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.serviceRequired.toLowerCase().includes(q);
    return matchStatus && matchService && matchQuery;
  });

  const handleUpdateLead = async (
    enquiryId: string,
    updates: { status?: LeadStatus; followUpDate?: string; newNote?: string }
  ) => {
    setSaving(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: enquiryId, ...updates }),
      });
      const json = await res.json();
      if (res.ok && json.enquiry) {
        setEnquiries((prev) => prev.map((item) => (item.id === enquiryId ? json.enquiry : item)));
        if (selectedLead?.id === enquiryId) {
          setSelectedLead(json.enquiry);
        }
        toast.success("Lead record updated in MySQL!");
        setNoteInput("");
      } else {
        toast.error(json.error || "Failed to update lead");
      }
    } catch {
      toast.error("Error updating lead");
    } finally {
      setSaving(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex ${
        isDark ? "dark bg-slate-950 text-slate-100" : "bg-[#F6F7FA] text-[#172033]"
      }`}
    >
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Left Premium Sidebar (Responsive: sliding drawer on mobile, sticky on desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#071A35] text-white flex flex-col border-r border-[#D6B36A]/30 shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="block" onClick={() => setMobileSidebarOpen(false)}>
            <img src="/logo.svg" alt="ARCH NEW ERA DESIGN" className="h-10 sm:h-11 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-[10px] font-bold text-[#F2D99B]">
              CMS v2.0
            </span>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close navigation"
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav
          aria-label="Admin Modules"
          className="flex-1 overflow-y-auto p-3 space-y-1"
        >
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-100 cursor-pointer touch-manipulation active:scale-[0.98] ${
                  active
                    ? "bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] font-bold shadow-md"
                    : "text-slate-300 hover:bg-[#10284A] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      active ? "bg-[#071A35] text-[#F2D99B]" : "bg-[#10284A] text-[#D6B36A]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2 bg-[#051226]">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate">
              <p className="font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-[#D6B36A] truncate">{currentUser.roleName}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Header Bar */}
        <header
          className={`sticky top-0 z-20 h-16 px-4 sm:px-6 border-b flex items-center justify-between gap-3 ${
            isDark
              ? "bg-slate-900/95 border-slate-800 text-white"
              : "bg-white/95 border-slate-200 text-[#071A35]"
          } backdrop-blur-md`}
        >
          {/* Breadcrumbs + Mobile Hamburger */}
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold truncate">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open CMS Navigation Menu"
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#071A35] dark:text-[#F2D99B] border border-slate-300 dark:border-slate-700 hover:border-[#D6B36A] shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-slate-400 hidden sm:inline">Admin CMS</span>
            <ChevronRight className="w-4 h-4 text-[#D6B36A] hidden sm:inline" />
            <span className="font-serif font-bold text-sm sm:text-base capitalize truncate">
              {sidebarItems.find((i) => i.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A] transition"
            >
              <span className="hidden sm:inline">View Live Website</span>
              <span className="sm:hidden">Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setActiveTab("enquiries")}
              aria-label="View new lead notifications"
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#D6B36A] transition"
            >
              <Bell className="w-4 h-4" />
              {enquiries.filter((e) => e.status === "New").length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {enquiries.filter((e) => e.status === "New").length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Light/Dark theme"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#D6B36A] transition"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#F2D99B]" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Active Module Workspace */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {/* 1. DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="rounded-2xl bg-gradient-to-r from-[#071A35] to-[#10284A] text-white p-7 border border-[#D6B36A]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D6B36A]">
                    ENTERPRISE CMS & CRM (ACTIVE)
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                    Welcome back, {currentUser.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {siteSettings.companyName} – {siteSettings.brandIdentity} | Primary Contact: {siteSettings.contactPerson} (+91 {siteSettings.phone})
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("enquiries")}
                    className="px-4 py-2.5 rounded-xl bg-[#D6B36A] text-[#071A35] font-bold text-xs hover:bg-[#F2D99B] transition"
                  >
                    Manage Leads ({enquiries.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("seo")}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition"
                  >
                    Create SEO Page
                  </button>
                </div>
              </div>

              {/* 7 KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                {[
                  { label: "Total Enquiries", val: enquiries.length, tab: "enquiries" as AdminTab },
                  {
                    label: "New Leads",
                    val: enquiries.filter((e) => e.status === "New").length,
                    tab: "enquiries" as AdminTab,
                  },
                  { label: "Total Projects", val: projects.length, tab: "projects" as AdminTab },
                  { label: "Total Services", val: services.length, tab: "services" as AdminTab },
                  {
                    label: "Published Blogs",
                    val: blogs.filter((b) => b.status === "Published").length,
                    tab: "blogs" as AdminTab,
                  },
                  {
                    label: "Draft Blogs",
                    val: blogs.filter((b) => b.status !== "Published").length,
                    tab: "blogs" as AdminTab,
                  },
                  { label: "SEO Pages", val: seoPages.length, tab: "seo" as AdminTab },
                ].map((stat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTab(stat.tab)}
                    className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 hover:border-[#D6B36A] text-left shadow-sm transition"
                  >
                    <p className="font-serif text-2xl sm:text-3xl font-bold text-[#071A35] dark:text-[#F2D99B]">
                      {stat.val}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                      {stat.label}
                    </p>
                  </button>
                ))}
              </div>

              {/* Recent Enquiries Table */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2
                    id="recent-leads-table-heading"
                    className="font-serif text-xl font-bold text-[#071A35] dark:text-white"
                  >
                    Recent Consultation Enquiries
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab("enquiries")}
                    className="text-xs font-bold text-[#B89246] hover:underline"
                  >
                    Open Full CRM →
                  </button>
                </div>

                <div
                  tabIndex={0}
                  role="region"
                  aria-labelledby="recent-leads-table-heading"
                  className="table-wrapper rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  <table className="responsive-data-table text-left text-xs sm:text-sm">
                    <thead className="bg-[#071A35] text-white text-xs uppercase">
                      <tr>
                        <th className="py-3 px-4">Client Name</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Service Required</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {enquiries.slice(0, 6).map((enq) => (
                        <tr key={enq.id}>
                          <th className="py-3.5 px-4 font-bold text-[#071A35] dark:text-white bg-white dark:bg-slate-900">
                            {enq.customerName}
                          </th>
                          <td className="py-3.5 px-4">{enq.phone}</td>
                          <td className="py-3.5 px-4">{enq.serviceRequired}</td>
                          <td className="py-3.5 px-4">{enq.location}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FBF6EA] text-[#B89246]">
                              {enq.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. WEBSITE SETTINGS */}
          {activeTab === "settings" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await postCMS("siteSettings", siteSettings);
                if (res?.success) {
                  toast.success("Website branding & hero settings saved to MySQL!");
                }
              }}
              className="rounded-2xl bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                    Global Website & Brand Settings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update company branding, hero text, hero image, and statistics counters.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs hover:bg-[#10284A] transition"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Website Settings"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={siteSettings.companyName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">
                    Brand / Technical Identity
                  </label>
                  <input
                    type="text"
                    value={siteSettings.brandIdentity}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, brandIdentity: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Primary Tagline</label>
                  <input
                    type="text"
                    value={siteSettings.tagline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Supporting Tagline</label>
                  <input
                    type="text"
                    value={siteSettings.supportingTagline}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, supportingTagline: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">
                    Additional Brand Statement
                  </label>
                  <input
                    type="text"
                    value={siteSettings.brandStatement}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, brandStatement: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase block text-[#071A35] dark:text-white">
                      Website Logo
                    </label>
                    <div className="flex items-center gap-1.5">
                      <label className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#071A35] text-[#F2D99B] text-[11px] font-bold hover:bg-[#10284A] cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await uploadImageFile(file, "Website Official Logo");
                            if (url) setSiteSettings((s) => ({ ...s, logoUrl: url }));
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget("logoUrl")}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[#D6B36A] text-[#B89246] hover:bg-[#D6B36A]/10 text-[11px] font-bold"
                      >
                        <Images className="w-3 h-3" />
                        <span>Library</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {siteSettings.logoUrl && (
                      <div className="w-14 h-10 p-1 rounded bg-[#071A35] flex items-center justify-center shrink-0 border border-slate-300">
                        <img src={siteSettings.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Logo URL or upload from PC"
                      value={siteSettings.logoUrl}
                      onChange={(e) => setSiteSettings({ ...siteSettings, logoUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Hero Heading</label>
                  <input
                    type="text"
                    value={siteSettings.heroTitle}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase block text-[#071A35] dark:text-white">
                      Hero Background Image
                    </label>
                    <div className="flex items-center gap-1.5">
                      <label className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#071A35] text-[#F2D99B] text-[11px] font-bold hover:bg-[#10284A] cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload Hero Image from PC</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await uploadImageFile(file, "Homepage Hero Background");
                            if (url) setSiteSettings((s) => ({ ...s, heroImage: url }));
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget("heroImage")}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[#D6B36A] text-[#B89246] hover:bg-[#D6B36A]/10 text-[11px] font-bold"
                      >
                        <Images className="w-3 h-3" />
                        <span>Pick from Media Library</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {siteSettings.heroImage && (
                      <img
                        src={siteSettings.heroImage}
                        alt="Hero preview"
                        className="w-20 h-12 rounded-lg object-cover border border-slate-300 shrink-0"
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Hero image URL or upload from PC"
                      value={siteSettings.heroImage}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroImage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">
                  Company Introduction Paragraph (Homepage)
                </label>
                <textarea
                  rows={3}
                  value={siteSettings.introDescription}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, introDescription: e.target.value })
                  }
                  className="w-full p-3.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">Footer About Text</label>
                <textarea
                  rows={2}
                  value={siteSettings.footerAbout}
                  onChange={(e) => setSiteSettings({ ...siteSettings, footerAbout: e.target.value })}
                  className="w-full p-3.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                />
              </div>
            </form>
          )}

          {/* 3. HOMEPAGE SECTIONS MANAGEMENT */}
          {activeTab === "homepage" && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                    Homepage Sections & Visibility Manager
                  </h2>
                  <p className="text-xs text-slate-500">
                    Toggle visibility or edit headings and subtitles for every homepage section.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={async () => {
                    const res = await postCMS("homepageSections", homepageSections);
                    if (res?.success) toast.success("Homepage sections updated in MySQL!");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs"
                >
                  <Save className="w-4 h-4" /> Save All Sections
                </button>
              </div>

              <div className="space-y-4">
                {homepageSections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F6F7FA] dark:bg-slate-800/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#B89246]">
                        {idx + 1}. Section Key: {sec.sectionKey}
                      </span>
                      <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sec.isEnabled}
                          onChange={(e) => {
                            const next = [...homepageSections];
                            next[idx] = { ...sec, isEnabled: e.target.checked };
                            setHomepageSections(next);
                          }}
                        />
                        <span>{sec.isEnabled ? "Visible on Homepage" : "Hidden"}</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={sec.badgeText || ""}
                        onChange={(e) => {
                          const next = [...homepageSections];
                          next[idx] = { ...sec, badgeText: e.target.value };
                          setHomepageSections(next);
                        }}
                        placeholder="Badge Text"
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-900 text-xs"
                      />
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => {
                          const next = [...homepageSections];
                          next[idx] = { ...sec, title: e.target.value };
                          setHomepageSections(next);
                        }}
                        placeholder="Section Heading"
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-900 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={sec.subtitle}
                        onChange={(e) => {
                          const next = [...homepageSections];
                          next[idx] = { ...sec, subtitle: e.target.value };
                          setHomepageSections(next);
                        }}
                        placeholder="Section Subtitle"
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-900 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ABOUT MANAGEMENT */}
          {activeTab === "about" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await postCMS("aboutSection", aboutSection);
                if (res?.success) toast.success("About page content updated in MySQL!");
              }}
              className="rounded-2xl bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                  About Page & Leadership Content
                </h2>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs"
                >
                  <Save className="w-4 h-4" /> Save About Page
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Page Title</label>
                  <input
                    type="text"
                    value={aboutSection.title}
                    onChange={(e) => setAboutSection({ ...aboutSection, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={aboutSection.subtitle}
                    onChange={(e) => setAboutSection({ ...aboutSection, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">
                    Primary Contact / Lead Name
                  </label>
                  <input
                    type="text"
                    value={aboutSection.founderName}
                    onChange={(e) =>
                      setAboutSection({ ...aboutSection, founderName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase block text-[#071A35] dark:text-white">
                      Featured About Image
                    </label>
                    <div className="flex items-center gap-1.5">
                      <label className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#071A35] text-[#F2D99B] text-[11px] font-bold hover:bg-[#10284A] cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload from PC</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await uploadImageFile(file, "About Page Image");
                            if (url) setAboutSection((a) => ({ ...a, imageUrl: url }));
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget("aboutImage")}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[#D6B36A] text-[#B89246] hover:bg-[#D6B36A]/10 text-[11px] font-bold"
                      >
                        <Images className="w-3 h-3" />
                        <span>Pick from Library</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {aboutSection.imageUrl && (
                      <img
                        src={aboutSection.imageUrl}
                        alt="About preview"
                        className="w-16 h-11 rounded-lg object-cover border border-slate-300 shrink-0"
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Image URL or upload from PC"
                      value={aboutSection.imageUrl}
                      onChange={(e) => setAboutSection({ ...aboutSection, imageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">Main Company Story</label>
                <textarea
                  rows={5}
                  value={aboutSection.content}
                  onChange={(e) => setAboutSection({ ...aboutSection, content: e.target.value })}
                  className="w-full p-3.5 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Mission Statement</label>
                  <textarea
                    rows={3}
                    value={aboutSection.mission}
                    onChange={(e) => setAboutSection({ ...aboutSection, mission: e.target.value })}
                    className="w-full p-3.5 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Vision Statement</label>
                  <textarea
                    rows={3}
                    value={aboutSection.vision}
                    onChange={(e) => setAboutSection({ ...aboutSection, vision: e.target.value })}
                    className="w-full p-3.5 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>
            </form>
          )}

          {/* 5. SERVICES MODULE */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                    Services Management ({services.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add, edit, delete, or publish dynamic service detail pages (`/services/[slug]`).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingService({
                      name: "",
                      slug: "",
                      category: "Architecture & Planning",
                      startingPrice: "₹900 / sq. ft.",
                      shortDescription: "",
                      fullDescription: "",
                      featuredImage: "/uploads/service-building-day-elevation.jpg",
                      gallery: [],
                      features: [
                        "Architect Supervision & 2D/3D Layouts",
                        "Premium Branded Materials",
                      ],
                      status: "Published",
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Add New Service
                </button>
              </div>

              {editingService && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingService.name) return;
                    const payload = {
                      ...editingService,
                      gallery: editingService.gallery || [],
                      slug: editingService.slug || slugify(editingService.name),
                    };
                    const res = await postCMS("services", payload);
                    if (res?.success && res.data) {
                      setServices((prev) => {
                        const idx = prev.findIndex((s) => s.id === res.data.id);
                        if (idx >= 0) {
                          const copy = [...prev];
                          copy[idx] = res.data;
                          return copy;
                        }
                        return [...prev, res.data];
                      });
                      setEditingService(null);
                      toast.success("Service saved to MySQL!");
                    }
                  }}
                  className="rounded-2xl bg-white dark:bg-slate-900 p-6 border-2 border-[#D6B36A] space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-serif text-xl font-bold text-[#071A35] dark:text-white">
                      {editingService.id ? `Edit Service: ${editingService.name}` : "Create New Service"}
                    </h3>
                    <span className="text-xs text-slate-500">
                      Images & gallery will sync to public pages instantly
                    </span>
                  </div>

                  {/* Basic Service Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Service Name *</label>
                      <input
                        type="text"
                        required
                        value={editingService.name || ""}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            name: e.target.value,
                            slug: editingService.id ? editingService.slug : slugify(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={editingService.slug || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, slug: slugify(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Starting Price</label>
                      <input
                        type="text"
                        value={editingService.startingPrice || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, startingPrice: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Category</label>
                      <input
                        type="text"
                        value={editingService.category || ""}
                        onChange={(e) =>
                          setEditingService({ ...editingService, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Publish Status</label>
                      <select
                        value={editingService.status || "Published"}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            status: e.target.value as "Published" | "Draft",
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      >
                        <option value="Published">Published (Visible on site)</option>
                        <option value="Draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* 1. FEATURED COVER IMAGE SECTION */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#B89246]" />
                        <label className="text-xs font-bold uppercase tracking-wider text-[#071A35] dark:text-white">
                          Featured Cover Image
                        </label>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Primary thumbnail for service cards and banner
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      {/* Image Preview */}
                      <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-[#071A35] shrink-0">
                        {editingService.featuredImage ? (
                          <img
                            src={editingService.featuredImage}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                            <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex-1 w-full space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Direct File Upload */}
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold cursor-pointer hover:bg-[#10284A] transition shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingServiceFeatured ? "Uploading..." : "Upload from Computer"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingServiceFeatured}
                              onChange={handleServiceFeaturedUpload}
                              className="hidden"
                            />
                          </label>

                          {/* Pick from Media Library */}
                          <button
                            type="button"
                            onClick={() => setMediaPickerTarget("serviceFeatured")}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-[#D6B36A] transition"
                          >
                            <FolderKanban className="w-3.5 h-3.5 text-[#B89246]" />
                            <span>Pick from Media Library</span>
                          </button>
                        </div>

                        {/* URL text fallback */}
                        <div>
                          <input
                            type="text"
                            placeholder="Or paste direct image URL (e.g. /uploads/... or https://...)"
                            value={editingService.featuredImage || ""}
                            onChange={(e) =>
                              setEditingService({ ...editingService, featuredImage: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-900 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. SERVICE GALLERY IMAGES SECTION */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Images className="w-4 h-4 text-[#B89246]" />
                        <label className="text-xs font-bold uppercase tracking-wider text-[#071A35] dark:text-white">
                          Service Photo Gallery ({editingService.gallery?.length || 0} Photos)
                        </label>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Renders in the Visual Reference Gallery on service detail pages
                      </span>
                    </div>

                    {/* Gallery Action Toolbar */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      {/* Batch upload */}
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold cursor-pointer hover:bg-[#10284A] transition shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingServiceGallery ? "Uploading Photos..." : "Upload Photos (Multiple)"}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={uploadingServiceGallery}
                          onChange={handleServiceGalleryUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Add from Media Library */}
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget("serviceGallery")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-[#D6B36A] transition"
                      >
                        <FolderKanban className="w-3.5 h-3.5 text-[#B89246]" />
                        <span>Add from Media Library</span>
                      </button>

                      {/* Add URL field */}
                      <div className="flex items-center gap-1.5 flex-1 min-w-[240px]">
                        <input
                          type="text"
                          placeholder="Paste image URL..."
                          value={serviceGalleryUrlInput}
                          onChange={(e) => setServiceGalleryUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddGalleryUrl();
                            }
                          }}
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-900 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddGalleryUrl}
                          className="px-3 py-2 rounded-lg bg-[#D6B36A] text-[#071A35] font-bold text-xs hover:bg-[#c4a159] transition shrink-0"
                        >
                          + Add URL
                        </button>
                      </div>
                    </div>

                    {/* Gallery Thumbnails Grid */}
                    {editingService.gallery && editingService.gallery.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
                        {editingService.gallery.map((imgUrl, gIdx) => (
                          <div
                            key={gIdx}
                            className="group relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-[#071A35] aspect-video"
                          >
                            <img
                              src={imgUrl}
                              alt={`Gallery ${gIdx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                              <button
                                type="button"
                                title="Set as Featured Cover Image"
                                onClick={() => handleSetFeaturedFromGallery(imgUrl)}
                                className="p-1.5 rounded-md bg-[#D6B36A] text-[#071A35] hover:scale-110 transition shadow"
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                              </button>
                              <button
                                type="button"
                                title="Remove from Gallery"
                                onClick={() => handleRemoveGalleryImage(gIdx)}
                                className="p-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 hover:scale-110 transition shadow"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white group-hover:hidden">
                              #{gIdx + 1}
                            </span>
                            {editingService.featuredImage === imgUrl && (
                              <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-[#D6B36A] text-[9px] font-bold text-[#071A35]">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 text-center space-y-1 bg-white/60 dark:bg-slate-900/40">
                        <Images className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          No photos in gallery yet.
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Click &quot;Upload Photos (Multiple)&quot; above to select images from your computer or pick from the media library.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={editingService.shortDescription || ""}
                      onChange={(e) =>
                        setEditingService({ ...editingService, shortDescription: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Full Description</label>
                    <textarea
                      rows={4}
                      value={editingService.fullDescription || ""}
                      onChange={(e) =>
                        setEditingService({ ...editingService, fullDescription: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">
                      Features (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(editingService.features || []).join("\n")}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          features: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || uploadingServiceFeatured || uploadingServiceGallery}
                      className="px-6 py-2.5 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A] transition shadow"
                    >
                      {saving ? "Saving..." : "Save Service & Photos"}
                    </button>
                  </div>
                </form>
              )}

              {/* SERVICES LIST GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-44 w-full bg-[#071A35] overflow-hidden">
                        <img
                          src={srv.featuredImage || "/uploads/service-building-day-elevation.jpg"}
                          alt={srv.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-[#F2D99B] border border-[#D6B36A]/30">
                            {srv.category}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              srv.status === "Published"
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-700 text-slate-200"
                            }`}
                          >
                            {srv.status}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 right-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-sm text-[10px] font-medium text-white border border-white/10">
                            <Images className="w-3 h-3 text-[#D6B36A]" />
                            {srv.gallery?.length || 0} photos
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="font-serif text-lg font-bold text-[#071A35] dark:text-white line-clamp-1">
                          {srv.name}
                        </h3>
                        <p className="text-xs font-bold text-[#B89246]">
                          Starting: {srv.startingPrice}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2">{srv.shortDescription}</p>

                        {/* Mini Gallery Strip */}
                        {srv.gallery && srv.gallery.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              Gallery Preview ({srv.gallery.length})
                            </p>
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              {srv.gallery.slice(0, 4).map((gImg, gIdx) => (
                                <img
                                  key={gIdx}
                                  src={gImg}
                                  alt={`preview ${gIdx}`}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                                />
                              ))}
                              {srv.gallery.length > 4 && (
                                <span className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                  +{srv.gallery.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                        <Link
                          href={`/services/${srv.slug}`}
                          target="_blank"
                          className="text-xs font-semibold text-[#B89246] hover:underline"
                        >
                          View Live Page
                        </Link>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingService(srv)}
                            aria-label={`Edit ${srv.name}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A]"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit & Photos</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({ module: "services", id: srv.id, name: srv.name })
                            }
                            aria-label={`Delete ${srv.name}`}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. PRICING & PACKAGES MODULE */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                    Construction & Interior Packages ({pricingPackages.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage package names, indicative starting prices, features, and active status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingPackage({
                      name: "",
                      packageType: "Construction",
                      startingPrice: "₹1,099",
                      priceUnit: "/ sq. ft.",
                      tagline: "",
                      description: "",
                      features: ["Strong Structure", "Quality Materials"],
                      isPopular: false,
                      isActive: true,
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Package
                </button>
              </div>

              {editingPackage && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingPackage.name) return;
                    const res = await postCMS("pricingPackages", editingPackage);
                    if (res?.success && res.data) {
                      setPricingPackages((prev) => {
                        const idx = prev.findIndex((p) => p.id === res.data.id);
                        if (idx >= 0) {
                          const copy = [...prev];
                          copy[idx] = res.data;
                          return copy;
                        }
                        return [...prev, res.data];
                      });
                      setEditingPackage(null);
                      toast.success("Pricing package updated in MySQL!");
                    }
                  }}
                  className="rounded-2xl bg-white dark:bg-slate-900 p-6 border-2 border-[#D6B36A] space-y-4"
                >
                  <h3 className="font-serif text-xl font-bold">
                    {editingPackage.id ? `Edit Package: ${editingPackage.name}` : "New Package"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Package Name *</label>
                      <input
                        type="text"
                        required
                        value={editingPackage.name || ""}
                        onChange={(e) =>
                          setEditingPackage({ ...editingPackage, name: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Starting Price *</label>
                      <input
                        type="text"
                        required
                        value={editingPackage.startingPrice || ""}
                        onChange={(e) =>
                          setEditingPackage({ ...editingPackage, startingPrice: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Type</label>
                      <select
                        value={editingPackage.packageType || "Construction"}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            packageType: e.target.value as "Construction" | "Interior",
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      >
                        <option value="Construction">Construction</option>
                        <option value="Interior">Interior</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Display Order</label>
                      <input
                        type="number"
                        value={editingPackage.displayOrder ?? 1}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            displayOrder: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingPackage.description || ""}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, description: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">
                      Package Features (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={(editingPackage.features || []).join("\n")}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          features: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(editingPackage.isPopular)}
                          onChange={(e) =>
                            setEditingPackage({ ...editingPackage, isPopular: e.target.checked })
                          }
                        />
                        Highlight as Popular
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(editingPackage.isActive ?? true)}
                          onChange={(e) =>
                            setEditingPackage({ ...editingPackage, isActive: e.target.checked })
                          }
                        />
                        Active on Website
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingPackage(null)}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                      >
                        Save Package
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pricingPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#B89246]">
                        {pkg.packageType} Package
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingPackage(pkg)}
                          aria-label={`Edit ${pkg.name}`}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              module: "pricingPackages",
                              id: pkg.id,
                              name: pkg.name,
                            })
                          }
                          aria-label={`Delete ${pkg.name}`}
                          className="p-2 rounded-lg bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#071A35] dark:text-white">
                      {pkg.name} — <span className="text-[#B89246]">{pkg.startingPrice}{pkg.priceUnit}</span>
                    </h3>
                    <p className="text-xs text-slate-500">{pkg.description}</p>
                    <ul className="space-y-1 text-xs">
                      {pkg.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B36A]" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PROJECTS MODULE */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                    Project Portfolio Management ({projects.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage Residential Homes, Luxury Interiors, Construction in Progress, Villas & Farmhouses, and Commercial Projects.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingProject({
                      title: "",
                      slug: "",
                      location: "Shahdara, Delhi",
                      category: "Residential Homes",
                      areaSqFt: "3,200 sq. ft.",
                      completionDate: "2026",
                      architectLead: "Manoj Kumar Sharma",
                      shortDescription: "",
                      description: "",
                      coverImage:
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
                      galleryImages: [],
                      status: "Published",
                      isFeatured: true,
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Add New Project
                </button>
              </div>

              {editingProject && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingProject.title) return;
                    const payload = {
                      ...editingProject,
                      slug: editingProject.slug || slugify(editingProject.title),
                    };
                    const res = await postCMS("projects", payload);
                    if (res?.success && res.data) {
                      setProjects((prev) => {
                        const idx = prev.findIndex((p) => p.id === res.data.id);
                        if (idx >= 0) {
                          const copy = [...prev];
                          copy[idx] = res.data;
                          return copy;
                        }
                        return [res.data, ...prev];
                      });
                      setEditingProject(null);
                      toast.success("Project saved to MySQL!");
                    }
                  }}
                  className="rounded-2xl bg-white dark:bg-slate-900 p-6 border-2 border-[#D6B36A] space-y-4"
                >
                  <h3 className="font-serif text-xl font-bold">
                    {editingProject.id ? `Edit Project: ${editingProject.title}` : "Add Project"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ""}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            title: e.target.value,
                            slug: editingProject.id ? editingProject.slug : slugify(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Category</label>
                      <select
                        value={editingProject.category || "Residential Homes"}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            category: e.target.value as Project["category"],
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      >
                        <option value="Residential Homes">Residential Homes</option>
                        <option value="Luxury Interiors">Luxury Interiors</option>
                        <option value="Construction in Progress">Construction in Progress</option>
                        <option value="Villas & Farmhouses">Villas & Farmhouses</option>
                        <option value="Commercial Projects">Commercial Projects</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Location</label>
                      <input
                        type="text"
                        value={editingProject.location || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, location: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  {/* Project Cover & Gallery Management */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase text-[#071A35] dark:text-white">
                          Project Cover Photo *
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A] cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Cover from PC</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const url = await uploadImageFile(file, `${editingProject.title || "Project"} Cover`);
                                if (url) {
                                  setEditingProject((p) => (p ? { ...p, coverImage: url } : null));
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setMediaPickerTarget("projectCover")}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#D6B36A] text-[#B89246] hover:bg-[#D6B36A]/10 text-xs font-bold"
                          >
                            <Images className="w-3.5 h-3.5" />
                            <span>Pick from Media Library</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {editingProject.coverImage && (
                          <img
                            src={editingProject.coverImage}
                            alt="Cover preview"
                            className="w-16 h-12 rounded-lg object-cover border border-slate-300 shrink-0"
                          />
                        )}
                        <input
                          type="text"
                          required
                          placeholder="Cover image URL or upload above"
                          value={editingProject.coverImage || ""}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, coverImage: e.target.value })
                          }
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                        />
                      </div>
                    </div>

                    {/* Project Multi-Image Gallery */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div>
                          <label className="text-xs font-bold uppercase text-[#071A35] dark:text-white block">
                            Project Photo Gallery ({editingProject.galleryImages?.length || 0} photos)
                          </label>
                          <span className="text-[11px] text-slate-500">
                            Upload site photos, plans, and completion renders for the project lightbox.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A] cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photos from PC</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const files = e.target.files;
                                if (!files || files.length === 0) return;
                                const urls: string[] = [];
                                for (let i = 0; i < files.length; i++) {
                                  const url = await uploadImageFile(files[i], `${editingProject.title || "Project"} Photo ${i + 1}`);
                                  if (url) urls.push(url);
                                }
                                if (urls.length > 0) {
                                  setEditingProject((p) => {
                                    if (!p) return null;
                                    const existing = p.galleryImages || [];
                                    return { ...p, galleryImages: [...existing, ...urls] };
                                  });
                                  toast.success(`Uploaded ${urls.length} photos to project gallery!`);
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setMediaPickerTarget("projectGallery")}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#D6B36A] text-[#B89246] hover:bg-[#D6B36A]/10 text-xs font-bold"
                          >
                            <Images className="w-3.5 h-3.5" />
                            <span>Pick from Media Library</span>
                          </button>
                        </div>
                      </div>

                      {editingProject.galleryImages && editingProject.galleryImages.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                          {editingProject.galleryImages.map((imgUrl, gIdx) => (
                            <div key={gIdx} className="relative group rounded-lg overflow-hidden border border-slate-300 h-20 bg-slate-100">
                              <img src={imgUrl} alt={`Photo ${gIdx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProject((p) => {
                                    if (!p) return null;
                                    const next = (p.galleryImages || []).filter((_, i) => i !== gIdx);
                                    return { ...p, galleryImages: next };
                                  });
                                  toast.info("Removed photo from gallery");
                                }}
                                className="absolute top-1 right-1 p-1 rounded-md bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition shadow"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No gallery photos added yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Area (Sq. Ft.)</label>
                      <input
                        type="text"
                        value={editingProject.areaSqFt || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, areaSqFt: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Completion Year</label>
                      <input
                        type="text"
                        value={editingProject.completionDate || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, completionDate: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={editingProject.shortDescription || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, shortDescription: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Full Case Study Description</label>
                    <textarea
                      rows={4}
                      value={editingProject.description || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, description: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                    >
                      Save Project
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <img src={p.coverImage} alt={p.title} className="w-full h-44 object-cover" />
                      <div className="p-5 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89246]">
                          {p.category} • {p.location}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-[#071A35] dark:text-white">
                          {p.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{p.shortDescription}</p>
                      </div>
                    </div>
                    <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="text-xs font-bold text-[#B89246] hover:underline"
                      >
                        View Live
                      </Link>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingProject(p)}
                          aria-label={`Edit ${p.title}`}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({ module: "projects", id: p.id, name: p.title })
                          }
                          aria-label={`Delete ${p.title}`}
                          className="p-2 rounded-lg bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7.5 REAL ESTATE & PROPERTY MANAGEMENT MODULE */}
          {activeTab === "real-estate" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-[#D6B36A]" />
                    Real Estate & Property Management ({realEstateProperties.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage Builder Floors, Freehold Plots, 50:50 Builder Collaborations, Commercial/PG assets, and Section settings.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center gap-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setRealEstateSubTab("listings")}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        realEstateSubTab === "listings"
                          ? "bg-white dark:bg-slate-900 text-[#071A35] dark:text-[#F2D99B] shadow-sm"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Properties ({realEstateProperties.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRealEstateSubTab("settings")}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        realEstateSubTab === "settings"
                          ? "bg-white dark:bg-slate-900 text-[#071A35] dark:text-[#F2D99B] shadow-sm"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Section Settings
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRealEstateSubTab("listings");
                      setEditingProperty({
                        title: "",
                        slug: "",
                        propertyType: "Buy",
                        category: "Builder Floor",
                        price: "₹75 Lakhs",
                        priceUnit: "All-Inclusive",
                        location: "Shahdara, East Delhi",
                        address: "Ashok Nagar / Shahdara, Delhi – 110093",
                        areaSqFt: "1,450 sq. ft.",
                        bedrooms: "3 BHK",
                        bathrooms: "3 Baths",
                        furnishing: "Semi-Furnished",
                        possessionDate: "Ready to Move",
                        status: "Available",
                        featuredImage: "/uploads/service-5-storey-elevation-manoj-kumar-sharma.jpg",
                        galleryImages: [
                          "/uploads/service-5-storey-elevation-manoj-kumar-sharma.jpg",
                          "/uploads/service-5-storey-night-lighting-elevation.jpg",
                        ],
                        shortDescription: "",
                        description: "",
                        features: [
                          "High-Speed Automatic Passenger Lift",
                          "Covered Stilt Car Parking",
                          "Freehold Registry with Mutation",
                          "80% Bank Loan Approved",
                        ],
                        contactPerson: "Manoj Kumar Sharma",
                        contactPhone: "7535942407",
                        isFeatured: true,
                        orderIndex: realEstateProperties.length + 1,
                      });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs hover:bg-[#10284A] transition shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add New Property
                  </button>
                </div>
              </div>

              {/* PROPERTY EDITOR FORM */}
              {editingProperty && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingProperty.title) return;
                    const payload = {
                      ...editingProperty,
                      slug: editingProperty.slug || slugify(editingProperty.title),
                    };
                    const res = await postCMS("realEstateProperties", payload);
                    if (res?.success && res.data) {
                      setRealEstateProperties((prev) => {
                        const idx = prev.findIndex((p) => p.id === res.data.id);
                        if (idx >= 0) {
                          const copy = [...prev];
                          copy[idx] = res.data;
                          return copy;
                        }
                        return [res.data, ...prev];
                      });
                      setEditingProperty(null);
                      toast.success("Property listing saved successfully!");
                    }
                  }}
                  className="rounded-2xl bg-white dark:bg-slate-900 p-6 sm:p-7 border-2 border-[#D6B36A] shadow-xl space-y-6 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="font-serif text-xl font-bold text-[#071A35] dark:text-white">
                      {editingProperty.id ? `Edit Property: ${editingProperty.title}` : "Add New Property Listing"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProperty(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Row 1: Title, Slug, Listing Type */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Property Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ultra-Luxury 3 BHK Builder Floor with Lift & Parking"
                        value={editingProperty.title || ""}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            title: e.target.value,
                            slug: editingProperty.id ? editingProperty.slug : slugify(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">URL Slug</label>
                      <input
                        type="text"
                        value={editingProperty.slug || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, slug: slugify(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Listing Type</label>
                      <select
                        value={editingProperty.propertyType || "Buy"}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            propertyType: e.target.value as RealEstateListingType,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      >
                        <option value="Buy">Buy (सेल / बिक्री)</option>
                        <option value="Sell">Sell (खरीद)</option>
                        <option value="Collaboration">Collaboration (50:50 कोलैबोरेशन)</option>
                        <option value="Investment">Investment (निवेश / पीजी)</option>
                        <option value="Rent">Rent (किराया)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Category, Status, Featured */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Property Category</label>
                      <select
                        value={editingProperty.category || "Builder Floor"}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            category: e.target.value as RealEstateCategory,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      >
                        <option value="Builder Floor">Builder Floor (बिल्डर फ्लोर)</option>
                        <option value="Residential Plot">Residential Plot (आवासीय प्लॉट)</option>
                        <option value="Commercial Plot">Commercial Plot (कमर्शियल प्लॉट)</option>
                        <option value="Commercial Shop / Office">Commercial Shop / Office (दुकान / ऑफिस)</option>
                        <option value="PG / Hostel Building">PG / Hostel Building (पीजी / हॉस्टल)</option>
                        <option value="Joint Venture / Collaboration">Joint Venture / Collaboration (कोलैबोरेशन)</option>
                        <option value="Luxury Villa / Farmhouse">Luxury Villa / Farmhouse (विला / फार्महाउस)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Availability Status</label>
                      <select
                        value={editingProperty.status || "Available"}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            status: e.target.value as RealEstateStatus,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      >
                        <option value="Available">Available (उपलब्ध)</option>
                        <option value="Ready to Move">Ready to Move (तुरंत रहने योग्य)</option>
                        <option value="Under Construction">Under Construction (निर्माणाधीन)</option>
                        <option value="Booking Open">Booking Open (बुकिंग शुरू)</option>
                        <option value="Sold Out">Sold Out (बिक चुका)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="prop-featured"
                        checked={Boolean(editingProperty.isFeatured)}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, isFeatured: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#D6B36A] focus:ring-[#D6B36A]"
                      />
                      <label htmlFor="prop-featured" className="text-xs font-bold cursor-pointer">
                        Mark as Featured on Homepage
                      </label>
                    </div>
                  </div>

                  {/* Row 3: Price & Price Unit, Location, Area */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Price *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹75 Lakhs onwards"
                        value={editingProperty.price || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, price: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Price Unit / Remark</label>
                      <input
                        type="text"
                        placeholder="e.g. All-Inclusive / per Gaj"
                        value={editingProperty.priceUnit || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, priceUnit: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Location *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shahdara, East Delhi"
                        value={editingProperty.location || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, location: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Area / Dimensions</label>
                      <input
                        type="text"
                        placeholder="e.g. 1,450 sq. ft. or 100 Gaj"
                        value={editingProperty.areaSqFt || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, areaSqFt: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 4: Bedrooms, Bathrooms, Furnishing, Possession */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Bedrooms</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 BHK / 4 BHK / N/A"
                        value={editingProperty.bedrooms || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, bedrooms: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Bathrooms</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 Baths / N/A"
                        value={editingProperty.bathrooms || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, bathrooms: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Furnishing</label>
                      <input
                        type="text"
                        placeholder="e.g. Semi-Furnished / Fully Furnished"
                        value={editingProperty.furnishing || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, furnishing: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Possession Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Ready to Move / Immediate"
                        value={editingProperty.possessionDate || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, possessionDate: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 5: Featured Image with Universal Media Picker & Uploader */}
                  <div className="space-y-2 p-4 rounded-xl bg-[#F6F7FA] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <label className="text-xs font-bold uppercase block text-[#071A35] dark:text-white">
                      Property Cover / Featured Image *
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="w-24 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border">
                        {editingProperty.featuredImage ? (
                          <img
                            src={editingProperty.featuredImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Enter image URL or pick from library"
                        value={editingProperty.featuredImage || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, featuredImage: e.target.value })
                        }
                        className="flex-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget("propertyFeatured")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold shrink-0 hover:bg-[#10284A] transition"
                      >
                        <Images className="w-3.5 h-3.5" /> Pick from Library
                      </button>
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shrink-0 hover:bg-emerald-700 transition cursor-pointer">
                        <Upload className="w-3.5 h-3.5" /> Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await uploadImageFile(file, editingProperty.title || "property");
                            if (url) {
                              setEditingProperty((prev) => (prev ? { ...prev, featuredImage: url } : null));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Row 6: Features Tags */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase block">
                      Property Amenities & Highlights (Tags)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(editingProperty.features || []).map((feat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071A35] text-white text-xs font-medium"
                        >
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProperty({
                                ...editingProperty,
                                features: (editingProperty.features || []).filter((_, i) => i !== idx),
                              })
                            }
                            className="text-red-400 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add feature (e.g. Lift & Parking, Freehold Registry, 80% Loan Approved)"
                        value={propertyFeatureInput}
                        onChange={(e) => setPropertyFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (propertyFeatureInput.trim()) {
                              setEditingProperty({
                                ...editingProperty,
                                features: [...(editingProperty.features || []), propertyFeatureInput.trim()],
                              });
                              setPropertyFeatureInput("");
                            }
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (propertyFeatureInput.trim()) {
                            setEditingProperty({
                              ...editingProperty,
                              features: [...(editingProperty.features || []), propertyFeatureInput.trim()],
                            });
                            setPropertyFeatureInput("");
                          }
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>

                  {/* Row 7: Descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Short Summary (Card View)</label>
                      <textarea
                        rows={3}
                        placeholder="Brief 2-line summary shown on property cards..."
                        value={editingProperty.shortDescription || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, shortDescription: e.target.value })
                        }
                        className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Detailed Description</label>
                      <textarea
                        rows={3}
                        placeholder="Detailed legal, architectural & construction specifications..."
                        value={editingProperty.description || ""}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, description: e.target.value })
                        }
                        className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 8: Contact Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Contact Person</label>
                      <input
                        type="text"
                        value={editingProperty.contactPerson || "Manoj Kumar Sharma"}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, contactPerson: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Contact Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={editingProperty.contactPhone || "7535942407"}
                        onChange={(e) =>
                          setEditingProperty({ ...editingProperty, contactPhone: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingProperty(null)}
                      className="px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] text-xs font-bold hover:brightness-105 transition shadow-gold"
                    >
                      Save Property Listing
                    </button>
                  </div>
                </form>
              )}

              {/* SUB-TAB 1: PROPERTY LISTINGS GRID */}
              {realEstateSubTab === "listings" && !editingProperty && (
                <div className="space-y-6">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {["All", "Builder Floor", "Residential Plot", "PG / Hostel Building", "Joint Venture / Collaboration", "Commercial Shop / Office"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPropertyCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          propertyCategoryFilter === cat
                            ? "bg-[#071A35] text-[#F2D99B]"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Properties Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {realEstateProperties
                      .filter((p) => propertyCategoryFilter === "All" || p.category === propertyCategoryFilter)
                      .map((prop) => (
                        <div
                          key={prop.id}
                          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#D6B36A] transition"
                        >
                          <div>
                            <div className="relative h-48 w-full bg-slate-900">
                              <img
                                src={prop.featuredImage || "/uploads/service-5-storey-elevation-manoj-kumar-sharma.jpg"}
                                alt={prop.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                                <span className="px-2 py-0.5 rounded bg-[#071A35]/90 text-white text-[10px] font-bold">
                                  {prop.category}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                                  {prop.status}
                                </span>
                              </div>
                              <span className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg bg-[#071A35]/95 text-[#F2D99B] font-serif font-bold text-sm border border-[#D6B36A]/50">
                                {prop.price}
                              </span>
                            </div>

                            <div className="p-4 space-y-2">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <MapPin className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" />
                                <span className="truncate">{prop.location}</span>
                              </div>
                              <h3 className="font-serif text-base font-bold text-[#071A35] dark:text-white line-clamp-2">
                                {prop.title}
                              </h3>
                              <p className="text-xs text-slate-500 line-clamp-2">
                                {prop.shortDescription}
                              </p>
                              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span>Area: {prop.areaSqFt}</span>
                                <span>{prop.bedrooms || "N/A"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-xs font-semibold text-[#B89246]">
                              {prop.isFeatured ? "★ Featured" : "Standard"}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={formatWhatsAppUrl(
                                  prop.contactPhone || "7535942407",
                                  `Inquiry regarding ${prop.title} (${prop.location})`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-[#25D366] text-white"
                                title="Test WhatsApp Link"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                              <button
                                type="button"
                                onClick={() => setEditingProperty(prop)}
                                className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-[#D6B36A] hover:text-[#071A35] transition"
                                title="Edit Property"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    module: "realEstateProperties",
                                    id: prop.id,
                                    name: prop.title,
                                  })
                                }
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                title="Delete Property"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: REAL ESTATE SECTION SETTINGS */}
              {realEstateSubTab === "settings" && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await postCMS("realEstateSection", realEstateSection);
                    if (res?.success && res.data) {
                      setRealEstateSection(res.data);
                      toast.success("Real Estate section settings updated successfully!");
                    }
                  }}
                  className="rounded-2xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#071A35] dark:text-white">
                        Real Estate Homepage Section Controls
                      </h3>
                      <p className="text-xs text-slate-500">
                        Customize the text, badge, stats, and 50:50 Builder Collaboration spotlight.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="re-enabled"
                        checked={Boolean(realEstateSection.isEnabled)}
                        onChange={(e) =>
                          setRealEstateSection({ ...realEstateSection, isEnabled: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#D6B36A] focus:ring-[#D6B36A]"
                      />
                      <label htmlFor="re-enabled" className="text-xs font-bold cursor-pointer">
                        Enable Section on Homepage
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={realEstateSection.badgeText || ""}
                        onChange={(e) =>
                          setRealEstateSection({ ...realEstateSection, badgeText: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Main Heading / Title</label>
                      <input
                        type="text"
                        value={realEstateSection.title || ""}
                        onChange={(e) =>
                          setRealEstateSection({ ...realEstateSection, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Section Subtitle</label>
                    <textarea
                      rows={2}
                      value={realEstateSection.subtitle || ""}
                      onChange={(e) =>
                        setRealEstateSection({ ...realEstateSection, subtitle: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div className="p-5 rounded-xl bg-[#071A35] text-white space-y-4">
                    <h4 className="font-serif text-lg font-bold text-[#F2D99B]">
                      50:50 Builder Collaboration Banner Texts
                    </h4>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1 text-slate-300">
                        Collaboration Title
                      </label>
                      <input
                        type="text"
                        value={realEstateSection.collaborationCtaTitle || ""}
                        onChange={(e) =>
                          setRealEstateSection({
                            ...realEstateSection,
                            collaborationCtaTitle: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/20 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1 text-slate-300">
                        Collaboration Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={realEstateSection.collaborationCtaSubtitle || ""}
                        onChange={(e) =>
                          setRealEstateSection({
                            ...realEstateSection,
                            collaborationCtaSubtitle: e.target.value,
                          })
                        }
                        className="w-full p-3 rounded-lg bg-slate-900 border border-white/20 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] text-xs font-bold hover:brightness-105 transition shadow-gold"
                    >
                      <Save className="w-4 h-4" /> Save Section Settings
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 8. GALLERY MODULE */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                  Visual Portfolio Gallery ({gallery.length})
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setEditingGallery({
                      title: "",
                      category: "Residential Homes",
                      imageUrl: "",
                      altText: "",
                      location: "Delhi NCR",
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Gallery Photo
                </button>
              </div>

              {editingGallery && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingGallery.title || !editingGallery.imageUrl) {
                      toast.error("Please provide both title and image.");
                      return;
                    }
                    const res = await postCMS("gallery", editingGallery);
                    if (res?.success && res.data) {
                      setGallery((prev) => [...prev.filter((g) => g.id !== res.data.id), res.data]);
                      setEditingGallery(null);
                      toast.success("Gallery photo saved!");
                    }
                  }}
                  className="rounded-2xl bg-white dark:bg-slate-900 p-6 border-2 border-[#D6B36A] space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Photo Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Modern Residential Elevation"
                        value={editingGallery.title || ""}
                        onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Category *</label>
                      <select
                        value={editingGallery.category || "Residential Homes"}
                        onChange={(e) =>
                          setEditingGallery({ ...editingGallery, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      >
                        <option value="Residential Homes">Residential Homes</option>
                        <option value="Luxury Interiors">Luxury Interiors</option>
                        <option value="Construction in Progress">Construction in Progress</option>
                        <option value="Villas & Farmhouses">Villas & Farmhouses</option>
                        <option value="Commercial Projects">Commercial Projects</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase text-[#071A35] dark:text-white">
                        Photo Image *
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A] cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload from PC</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = await uploadImageFile(file, editingGallery.title || "Gallery Photo");
                              if (url) {
                                setEditingGallery((p) => (p ? { ...p, imageUrl: url } : null));
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setMediaPickerTarget("galleryItem")}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#D6B36A] text-[#B89246] hover:bg-[#D6B36A]/10 text-xs font-bold"
                        >
                          <Images className="w-3.5 h-3.5" />
                          <span>Pick from Media Library</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {editingGallery.imageUrl && (
                        <img
                          src={editingGallery.imageUrl}
                          alt="Preview"
                          className="w-16 h-12 rounded-lg object-cover border border-slate-300 shrink-0"
                        />
                      )}
                      <input
                        type="text"
                        required
                        placeholder="Image URL or upload from PC"
                        value={editingGallery.imageUrl || ""}
                        onChange={(e) =>
                          setEditingGallery({ ...editingGallery, imageUrl: e.target.value })
                        }
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingGallery(null)}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A]"
                    >
                      Save Gallery Photo
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {gallery.map((g) => (
                  <div
                    key={g.id}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 overflow-hidden shadow-sm"
                  >
                    <img src={g.imageUrl} alt={g.altText} className="w-full h-48 object-cover" />
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#B89246]">
                          {g.category}
                        </span>
                        <h4 className="font-serif font-bold text-sm">{g.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({ module: "gallery", id: g.id, name: g.title })
                        }
                        aria-label={`Delete ${g.title}`}
                        className="p-2 rounded-lg bg-red-50 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. BLOG MANAGEMENT */}
          {activeTab === "blogs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                    Dynamic Blog CMS ({blogs.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Rich text blog editor with SEO metadata, canonical URL, and automatic `/blog/[slug]` routing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingBlog({
                      title: "",
                      slug: "",
                      shortDescription: "",
                      content: "<h2>Article Heading</h2>\n<p>Write your architectural insights here...</p>",
                      featuredImage:
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                      author: "Manoj Kumar Sharma",
                      authorRole: "Principal Project Lead – ARCH NEW ERA DESIGN",
                      category: blogCategories[0]?.name || "Construction Cost & Planning",
                      tags: ["Architecture", "Delhi NCR"],
                      status: "Published",
                      publishDate: new Date().toISOString().slice(0, 10),
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Write New Blog Post
                </button>
              </div>

              {editingBlog && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingBlog.title) return;
                    const slug = editingBlog.slug || slugify(editingBlog.title);
                    const res = await postCMS("blogs", { ...editingBlog, slug });
                    if (res?.success && res.data) {
                      setBlogs((prev) => {
                        const idx = prev.findIndex((b) => b.id === res.data.id);
                        if (idx >= 0) {
                          const copy = [...prev];
                          copy[idx] = res.data;
                          return copy;
                        }
                        return [res.data, ...prev];
                      });
                      setEditingBlog(null);
                      toast.success("Blog article saved to MySQL!");
                    }
                  }}
                  className="rounded-2xl bg-white dark:bg-slate-900 p-6 border-2 border-[#D6B36A] space-y-4"
                >
                  <h3 className="font-serif text-xl font-bold">
                    {editingBlog.id ? `Edit Article: ${editingBlog.title}` : "Create New Blog Article"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Blog Title *</label>
                      <input
                        type="text"
                        required
                        value={editingBlog.title || ""}
                        onChange={(e) =>
                          setEditingBlog({
                            ...editingBlog,
                            title: e.target.value,
                            slug: editingBlog.id ? editingBlog.slug : slugify(e.target.value),
                            metaTitle:
                              editingBlog.metaTitle || `${e.target.value} | ARCH NEW ERA DESIGN`,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={editingBlog.slug || ""}
                        onChange={(e) =>
                          setEditingBlog({ ...editingBlog, slug: slugify(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Category</label>
                      <select
                        value={editingBlog.category || ""}
                        onChange={(e) =>
                          setEditingBlog({ ...editingBlog, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      >
                        {blogCategories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Author</label>
                      <input
                        type="text"
                        value={editingBlog.author || "Manoj Kumar Sharma"}
                        onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold uppercase text-[#071A35] dark:text-white">
                          Featured Image
                        </label>
                        <div className="flex items-center gap-1.5">
                          <label className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#071A35] text-[#F2D99B] text-[11px] font-bold hover:bg-[#10284A] cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>PC Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const url = await uploadImageFile(file, `${editingBlog.title || "Blog"} Cover`);
                                if (url) {
                                  setEditingBlog((b) => (b ? { ...b, featuredImage: url } : null));
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setMediaPickerTarget("blogFeatured")}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[#D6B36A] text-[#B89246] hover:bg-[#D6B36A]/10 text-[11px] font-bold"
                          >
                            <Images className="w-3 h-3" />
                            <span>Library</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingBlog.featuredImage && (
                          <img
                            src={editingBlog.featuredImage}
                            alt="Cover"
                            className="w-12 h-9 rounded object-cover border border-slate-300 shrink-0"
                          />
                        )}
                        <input
                          type="text"
                          placeholder="Image URL or upload"
                          value={editingBlog.featuredImage || ""}
                          onChange={(e) =>
                            setEditingBlog({ ...editingBlog, featuredImage: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Publish Date</label>
                      <input
                        type="date"
                        value={editingBlog.publishDate || ""}
                        onChange={(e) =>
                          setEditingBlog({ ...editingBlog, publishDate: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Status</label>
                      <select
                        value={editingBlog.status || "Published"}
                        onChange={(e) =>
                          setEditingBlog({
                            ...editingBlog,
                            status: e.target.value as Blog["status"],
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Short Excerpt</label>
                    <textarea
                      rows={2}
                      value={editingBlog.shortDescription || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          shortDescription: e.target.value,
                          metaDescription: editingBlog.metaDescription || e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">
                      Rich Text Article Content (HTML Supported)
                    </label>
                    <RichTextEditor
                      value={editingBlog.content || ""}
                      onChange={(val) => setEditingBlog({ ...editingBlog, content: val })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">SEO Meta Title</label>
                      <input
                        type="text"
                        value={editingBlog.metaTitle || ""}
                        onChange={(e) =>
                          setEditingBlog({ ...editingBlog, metaTitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Focus Keyword</label>
                      <input
                        type="text"
                        value={editingBlog.focusKeyword || ""}
                        onChange={(e) =>
                          setEditingBlog({ ...editingBlog, focusKeyword: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Canonical URL</label>
                      <input
                        type="text"
                        value={editingBlog.canonicalUrl || ""}
                        onChange={(e) =>
                          setEditingBlog({ ...editingBlog, canonicalUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingBlog(null)}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                    >
                      Save Article
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {blogs.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#B89246]">{b.category}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {b.status} • {b.publishDate}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#071A35] dark:text-white">
                        {b.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{b.shortDescription}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        className="text-xs font-bold text-[#B89246] hover:underline"
                      >
                        /blog/{b.slug}
                      </Link>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingBlog(b)}
                          aria-label={`Edit ${b.title}`}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({ module: "blogs", id: b.id, name: b.title })
                          }
                          aria-label={`Delete ${b.title}`}
                          className="p-2 rounded-lg bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. BLOG CATEGORIES */}
          {activeTab === "blog_categories" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold">Blog Categories ({blogCategories.length})</h2>
                <button
                  type="button"
                  onClick={() => setEditingCategory({ name: "", description: "" })}
                  className="px-4 py-2 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                >
                  + Add Category
                </button>
              </div>
              {editingCategory && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingCategory.name) return;
                    const res = await postCMS("blogCategories", editingCategory);
                    if (res?.success && res.data) {
                      setBlogCategories((p) => [...p.filter((c) => c.id !== res.data.id), res.data]);
                      setEditingCategory(null);
                      toast.success("Category saved!");
                    }
                  }}
                  className="p-5 rounded-2xl bg-white border-2 border-[#D6B36A] flex flex-wrap gap-3"
                >
                  <input
                    type="text"
                    required
                    placeholder="Category Name"
                    value={editingCategory.name || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={editingCategory.description || ""}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, description: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm flex-1"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                  >
                    Save
                  </button>
                </form>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {blogCategories.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-serif font-bold">{c.name}</h4>
                      <p className="text-xs text-slate-500">{c.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ module: "blogCategories", id: c.id, name: c.name })
                      }
                      aria-label={`Delete ${c.name}`}
                      className="p-2 rounded-lg bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11 & 12. DYNAMIC SEO MANAGEMENT & LOCATION PAGES */}
          {(activeTab === "seo" || activeTab === "locations") && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                    {activeTab === "locations"
                      ? "Dynamic Location SEO Pages (/locations/[slug])"
                      : "Dynamic SEO Page Builder & Validator (/pages/[slug] & /locations/[slug])"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Create indexable SEO landing pages without coding. Includes real-time validation for Meta Title, Meta Description, H1, Alt Text, Slug, and Canonical URL.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingSEOPage({
                      pageName: "",
                      slug: "",
                      routePrefix: activeTab === "locations" ? "/locations" : "/pages",
                      metaTitle: "",
                      metaDescription: "",
                      h1Heading: "",
                      focusKeyword: "",
                      secondaryKeywords: [],
                      pageContent:
                        "<h2>Architectural & Turnkey Construction Excellence</h2>\n<p>Contact Manoj Kumar Sharma at ARCH NEW ERA DESIGN (NRBL TECH) for a personalized consultation.</p>",
                      featuredImage:
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                      imageAltText: "",
                      canonicalUrl: "",
                      robotsIndex: true,
                      robotsFollow: true,
                      locationCity: "Delhi",
                      locationArea: "Shahdara",
                      status: "Published",
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] font-bold text-xs shrink-0"
                >
                  <Plus className="w-4 h-4" /> Create New SEO Page
                </button>
              </div>

              {editingSEOPage && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingSEOPage.pageName) return;
                    const slug = editingSEOPage.slug || slugify(editingSEOPage.pageName);
                    const prefix = editingSEOPage.routePrefix || "/pages";
                    const canonical =
                      editingSEOPage.canonicalUrl || `http://localhost:3000${prefix}/${slug}`;
                    const res = await postCMS("seoPages", {
                      ...editingSEOPage,
                      slug,
                      canonicalUrl: canonical,
                    });
                    if (res?.success && res.data) {
                      setSeoPages((prev) => {
                        const idx = prev.findIndex((p) => p.id === res.data.id);
                        if (idx >= 0) {
                          const copy = [...prev];
                          copy[idx] = res.data;
                          return copy;
                        }
                        return [res.data, ...prev];
                      });
                      setEditingSEOPage(null);
                      toast.success("SEO page saved & sitemap updated!");
                    }
                  }}
                  className="rounded-2xl bg-white dark:bg-slate-900 p-6 border-2 border-[#D6B36A] space-y-5"
                >
                  <h3 className="font-serif text-xl font-bold">
                    {editingSEOPage.id ? `Edit SEO Page: ${editingSEOPage.pageName}` : "Create Dynamic SEO Page"}
                  </h3>

                  {/* Live SEO Validator Component */}
                  <SeoValidator
                    page={editingSEOPage}
                    existingSlugs={seoPages
                      .filter((p) => p.id !== editingSEOPage.id)
                      .map((p) => p.slug)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Page Name *</label>
                      <input
                        type="text"
                        required
                        value={editingSEOPage.pageName || ""}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = editingSEOPage.id ? editingSEOPage.slug : slugify(name);
                          const prefix = editingSEOPage.routePrefix || "/pages";
                          setEditingSEOPage({
                            ...editingSEOPage,
                            pageName: name,
                            slug,
                            h1Heading: editingSEOPage.h1Heading || name,
                            canonicalUrl:
                              editingSEOPage.canonicalUrl || `http://localhost:3000${prefix}/${slug}`,
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Route Prefix</label>
                      <select
                        value={editingSEOPage.routePrefix || "/pages"}
                        onChange={(e) =>
                          setEditingSEOPage({
                            ...editingSEOPage,
                            routePrefix: e.target.value as "/pages" | "/locations",
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      >
                        <option value="/locations">/locations/[slug] (Local SEO)</option>
                        <option value="/pages">/pages/[slug] (Landing Page)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={editingSEOPage.slug || ""}
                        onChange={(e) =>
                          setEditingSEOPage({ ...editingSEOPage, slug: slugify(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={editingSEOPage.metaTitle || ""}
                        onChange={(e) =>
                          setEditingSEOPage({ ...editingSEOPage, metaTitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">H1 Heading</label>
                      <input
                        type="text"
                        value={editingSEOPage.h1Heading || ""}
                        onChange={(e) =>
                          setEditingSEOPage({ ...editingSEOPage, h1Heading: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      value={editingSEOPage.metaDescription || ""}
                      onChange={(e) =>
                        setEditingSEOPage({ ...editingSEOPage, metaDescription: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Focus Keyword</label>
                      <input
                        type="text"
                        value={editingSEOPage.focusKeyword || ""}
                        onChange={(e) =>
                          setEditingSEOPage({ ...editingSEOPage, focusKeyword: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Featured Image URL</label>
                      <input
                        type="text"
                        value={editingSEOPage.featuredImage || ""}
                        onChange={(e) =>
                          setEditingSEOPage({ ...editingSEOPage, featuredImage: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Image Alt Text</label>
                      <input
                        type="text"
                        value={editingSEOPage.imageAltText || ""}
                        onChange={(e) =>
                          setEditingSEOPage({ ...editingSEOPage, imageAltText: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Canonical URL</label>
                      <input
                        type="text"
                        value={editingSEOPage.canonicalUrl || ""}
                        onChange={(e) =>
                          setEditingSEOPage({ ...editingSEOPage, canonicalUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:bg-slate-800 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Page Rich Text Content</label>
                    <RichTextEditor
                      value={editingSEOPage.pageContent || ""}
                      onChange={(val) => setEditingSEOPage({ ...editingSEOPage, pageContent: val })}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={Boolean(editingSEOPage.robotsIndex ?? true)}
                          onChange={(e) =>
                            setEditingSEOPage({ ...editingSEOPage, robotsIndex: e.target.checked })
                          }
                        />
                        Robots Index
                      </label>
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={Boolean(editingSEOPage.robotsFollow ?? true)}
                          onChange={(e) =>
                            setEditingSEOPage({ ...editingSEOPage, robotsFollow: e.target.checked })
                          }
                        />
                        Robots Follow
                      </label>
                      <select
                        value={editingSEOPage.status || "Published"}
                        onChange={(e) =>
                          setEditingSEOPage({
                            ...editingSEOPage,
                            status: e.target.value as "Published" | "Draft",
                          })
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:bg-slate-800 text-xs"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingSEOPage(null)}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                      >
                        Save SEO Page
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {seoPages
                  .filter((p) => (activeTab === "locations" ? p.routePrefix === "/locations" : true))
                  .map((sp) => (
                    <div
                      key={sp.id}
                      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#B89246]">
                            {sp.routePrefix}/{sp.slug}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sp.status === "Published" && sp.robotsIndex
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {sp.status} • {sp.robotsIndex ? "Index" : "Noindex"}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#071A35] dark:text-white">
                          {sp.pageName}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{sp.metaDescription}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href={`${sp.routePrefix}/${sp.slug}`}
                          target="_blank"
                          className="text-xs font-bold text-[#071A35] dark:text-[#F2D99B] hover:underline inline-flex items-center gap-1"
                        >
                          Open Page <ExternalLink className="w-3 h-3" />
                        </Link>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingSEOPage(sp)}
                            aria-label={`Edit ${sp.pageName}`}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({
                                module: "seoPages",
                                id: sp.id,
                                name: sp.pageName,
                              })
                            }
                            aria-label={`Delete ${sp.pageName}`}
                            className="p-2 rounded-lg bg-red-50 text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 13. TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold">
                  Client Testimonials ({testimonials.length})
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setEditingTestimonial({
                      clientName: "",
                      clientRole: "Homeowner",
                      location: "Shahdara, Delhi",
                      rating: 5,
                      content: "",
                      status: "Published",
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                >
                  + Add Testimonial
                </button>
              </div>

              {editingTestimonial && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingTestimonial.clientName || !editingTestimonial.content) return;
                    const res = await postCMS("testimonials", editingTestimonial);
                    if (res?.success && res.data) {
                      setTestimonials((p) => [
                        ...p.filter((t) => t.id !== res.data.id),
                        res.data,
                      ]);
                      setEditingTestimonial(null);
                      toast.success("Testimonial saved!");
                    }
                  }}
                  className="p-6 rounded-2xl bg-white border-2 border-[#D6B36A] space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Client Name *"
                      value={editingTestimonial.clientName || ""}
                      onChange={(e) =>
                        setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })
                      }
                      className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Role / Project Type"
                      value={editingTestimonial.clientRole || ""}
                      onChange={(e) =>
                        setEditingTestimonial({ ...editingTestimonial, clientRole: e.target.value })
                      }
                      className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={editingTestimonial.location || ""}
                      onChange={(e) =>
                        setEditingTestimonial({ ...editingTestimonial, location: e.target.value })
                      }
                      className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Client feedback text *"
                    value={editingTestimonial.content || ""}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, content: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border border-slate-300 text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingTestimonial(null)}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 space-y-3"
                  >
                    <p className="text-xs italic text-slate-600 dark:text-slate-300">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <h4 className="font-serif font-bold text-sm">{t.clientName}</h4>
                        <p className="text-[11px] text-slate-500">{t.location}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial(t)}
                          aria-label={`Edit ${t.clientName}`}
                          className="p-2 rounded bg-slate-100"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              module: "testimonials",
                              id: t.id,
                              name: t.clientName,
                            })
                          }
                          aria-label={`Delete ${t.clientName}`}
                          className="p-2 rounded bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 14. FAQ MANAGEMENT */}
          {activeTab === "faqs" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                    FAQ Management ({faqs.length})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Add, edit, reorder, or publish frequently asked questions shown across the website and knowledge sections.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingFAQ({
                      question: "",
                      answer: "",
                      category: "General",
                      displayOrder: faqs.length + 1,
                      isPublished: true,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A] transition shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New FAQ</span>
                </button>
              </div>

              {editingFAQ && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingFAQ.question?.trim() || !editingFAQ.answer?.trim()) {
                      toast.error("Please enter both FAQ question and answer.");
                      return;
                    }
                    const payload = {
                      ...editingFAQ,
                      question: editingFAQ.question.trim(),
                      answer: editingFAQ.answer.trim(),
                      category: editingFAQ.category || "General",
                      displayOrder: Number(editingFAQ.displayOrder ?? faqs.length + 1),
                      isPublished: editingFAQ.isPublished ?? true,
                    };
                    const res = await postCMS("faqs", payload);
                    if (res?.success && res.data) {
                      setFaqs((p) => {
                        const filtered = p.filter((f) => f.id !== res.data.id);
                        return [...filtered, res.data].sort(
                          (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
                        );
                      });
                      setEditingFAQ(null);
                      toast.success("FAQ saved successfully!");
                      router.refresh();
                    } else {
                      toast.error(res?.error || "Failed to save FAQ. Please try again.");
                    }
                  }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#D6B36A] shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="font-serif font-bold text-base text-[#071A35] dark:text-white">
                      {editingFAQ.id ? "Edit FAQ" : "Create New FAQ"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingFAQ(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#071A35] dark:text-slate-200">
                      Question *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., What are your starting rates for house construction?"
                      value={editingFAQ.question || ""}
                      onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-[#D6B36A] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#071A35] dark:text-slate-200">
                      Answer *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="e.g., Our construction packages start at ₹1,099/sq. ft. for Essential Home and ₹1,399/sq. ft. for Ready-to-Move..."
                      value={editingFAQ.answer || ""}
                      onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-[#D6B36A] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#071A35] dark:text-slate-200">
                        Category
                      </label>
                      <select
                        value={editingFAQ.category || "General"}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, category: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#D6B36A] focus:outline-none"
                      >
                        <option value="General">General</option>
                        <option value="Architecture">Architecture & Planning</option>
                        <option value="Construction">Construction & Civil</option>
                        <option value="Interiors">Interior Designing</option>
                        <option value="Pricing & Packages">Pricing & Packages</option>
                        <option value="Real Estate">Real Estate & Plots</option>
                        <option value="Process">Turnkey Process</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#071A35] dark:text-slate-200">
                        Display Order
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={editingFAQ.displayOrder ?? faqs.length + 1}
                        onChange={(e) =>
                          setEditingFAQ({
                            ...editingFAQ,
                            displayOrder: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#D6B36A] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#071A35] dark:text-slate-200">
                        Status
                      </label>
                      <select
                        value={editingFAQ.isPublished ? "published" : "draft"}
                        onChange={(e) =>
                          setEditingFAQ({
                            ...editingFAQ,
                            isPublished: e.target.value === "published",
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#D6B36A] focus:outline-none"
                      >
                        <option value="published">Published (Visible on Website)</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingFAQ(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A] disabled:opacity-50 transition shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{saving ? "Saving FAQ..." : "Save FAQ"}</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {faqs.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
                    No FAQs added yet. Click "+ Add New FAQ" above to add your first question.
                  </div>
                ) : (
                  faqs.map((f) => (
                    <div
                      key={f.id}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 hover:border-[#D6B36A]/50 transition shadow-sm"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D6B36A]/15 text-[#071A35] dark:text-[#F2D99B]">
                            {f.category || "General"}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            Order #{f.displayOrder ?? 1}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              f.isPublished
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {f.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#071A35] dark:text-white">
                          {f.question}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {f.answer}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingFAQ(f)}
                          aria-label={`Edit FAQ ${f.question}`}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#D6B36A]/20 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({ module: "faqs", id: f.id, name: f.question })
                          }
                          aria-label={`Delete FAQ ${f.question}`}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 15. ENQUIRIES / LEAD CRM */}
          {activeTab === "enquiries" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                  Lead CRM & Enquiry Management ({enquiries.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Search enquiries, filter by service or status, assign follow-up dates, add internal notes, or contact via WhatsApp.
                </p>
              </div>

              {/* Filter Bar */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    placeholder="Search client name, phone, location..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  aria-label="Filter leads by status"
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>

                <select
                  value={leadServiceFilter}
                  onChange={(e) => setLeadServiceFilter(e.target.value)}
                  aria-label="Filter leads by service"
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="All">All Services</option>
                  <option value="Real Estate">Real Estate & Property</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Enquiries Table */}
                <div className="lg:col-span-7">
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Enquiries CRM List"
                    className="table-wrapper rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 shadow-sm"
                  >
                    <table className="responsive-data-table text-left text-xs">
                      <thead className="bg-[#071A35] text-white uppercase">
                        <tr>
                          <th className="py-3.5 px-4">Client</th>
                          <th className="py-3.5 px-4">Service & Area</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredEnquiries.map((enq) => (
                          <tr
                            key={enq.id}
                            onClick={() => setSelectedLead(enq)}
                            className={`cursor-pointer hover:bg-[#FBF6EA]/60 ${
                              selectedLead?.id === enq.id ? "bg-[#FBF6EA]" : ""
                            }`}
                          >
                            <th className="py-3.5 px-4 bg-white dark:bg-slate-900">
                              <p className="font-bold text-[#071A35] dark:text-white">
                                {enq.customerName}
                              </p>
                              <p className="text-slate-500 font-normal">{enq.phone}</p>
                            </th>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold">{enq.serviceRequired}</p>
                              <p className="text-slate-500">
                                {enq.location} {enq.approxAreaSqFt ? `• ${enq.approxAreaSqFt} sq.ft.` : ""}
                              </p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-full bg-[#071A35] text-[#F2D99B] font-bold text-[10px]">
                                {enq.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={formatWhatsAppUrl(
                                    enq.phone,
                                    `Hello ${enq.customerName}, this is Manoj Kumar Sharma from ARCH NEW ERA DESIGN (NRBL TECH) regarding your enquiry for ${enq.serviceRequired}.`
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#25D366] text-white font-bold inline-flex items-center gap-1"
                                >
                                  <MessageCircle className="w-3 h-3" /> WA
                                </a>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteTarget({
                                      module: "enquiries",
                                      id: enq.id,
                                      name: enq.customerName,
                                    });
                                  }}
                                  aria-label={`Delete enquiry from ${enq.customerName}`}
                                  className="p-1.5 rounded bg-red-50 text-red-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Lead Inspector & Notes Panel */}
                <div className="lg:col-span-5">
                  {selectedLead ? (
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border-2 border-[#D6B36A] space-y-4">
                      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B89246]">
                            LEAD DETAILS & FOLLOW-UP
                          </span>
                          <h3 className="font-serif text-xl font-bold text-[#071A35] dark:text-white">
                            {selectedLead.customerName}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Phone: {selectedLead.phone} • Email: {selectedLead.email || "N/A"}
                          </p>
                        </div>
                        <a
                          href={formatWhatsAppUrl(
                            selectedLead.phone,
                            `Hello ${selectedLead.customerName}, Manoj Kumar Sharma here from ARCH NEW ERA DESIGN (NRBL TECH).`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs bg-[#F6F7FA] dark:bg-slate-800 p-3.5 rounded-xl">
                        <div>
                          <span className="text-slate-400 block">Service:</span>
                          <strong>{selectedLead.serviceRequired}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Property Type:</span>
                          <strong>{selectedLead.propertyType}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Location:</span>
                          <strong>{selectedLead.location}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Budget / Area:</span>
                          <strong>
                            {selectedLead.budget || "N/A"} ({selectedLead.approxAreaSqFt || "N/A"} sq.ft.)
                          </strong>
                        </div>
                      </div>

                      {selectedLead.message && (
                        <div className="text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                          <span className="font-bold block mb-1">Client Message:</span>
                          <p>{selectedLead.message}</p>
                        </div>
                      )}

                      {/* Quick Status Update Buttons */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase block">
                          Assign Lead Status:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {(
                            [
                              "New",
                              "Contacted",
                              "Follow-up",
                              "Qualified",
                              "Converted",
                              "Closed",
                            ] as LeadStatus[]
                          ).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleUpdateLead(selectedLead.id, { status: st })}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                selectedLead.status === st
                                  ? "bg-[#071A35] text-[#F2D99B]"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Follow-up Date */}
                      <div>
                        <label className="text-xs font-bold uppercase block mb-1">
                          Next Follow-up Date
                        </label>
                        <input
                          type="date"
                          value={selectedLead.followUpDate || ""}
                          onChange={(e) =>
                            handleUpdateLead(selectedLead.id, { followUpDate: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>

                      {/* Add Internal Note */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label className="text-xs font-bold uppercase block">
                          Internal CRM Notes ({selectedLead.internalNotes?.length || 0})
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add call summary or site visit note..."
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!noteInput.trim()) return;
                              handleUpdateLead(selectedLead.id, { newNote: noteInput });
                            }}
                            className="px-4 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                          >
                            Add Note
                          </button>
                        </div>

                        <div className="space-y-2 max-h-40 overflow-y-auto pt-1">
                          {(selectedLead.internalNotes || []).map((n) => (
                            <div
                              key={n.id}
                              className="p-2.5 rounded-lg bg-[#F6F7FA] dark:bg-slate-800 text-xs"
                            >
                              <p className="font-medium">{n.note}</p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                By {n.author} • {new Date(n.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-8 border border-dashed border-slate-300 text-center text-xs text-slate-500">
                      Select any enquiry row on the left to inspect client details, update lead status, schedule follow-up, or add internal notes.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 16. MEDIA LIBRARY */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white">
                  Media Library & Asset Manager ({media.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Upload image files directly (validated for JPG/PNG/WebP/SVG/AVIF up to 5MB) or register external URLs with Alt Text.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Local File */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 space-y-4">
                  <h3 className="font-serif text-lg font-bold">Upload Image File</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Image Title"
                      value={newMediaTitle}
                      onChange={(e) => setNewMediaTitle(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="SEO Alt Text"
                      value={newMediaAlt}
                      onChange={(e) => setNewMediaAlt(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={newMediaCategory}
                      onChange={(e) =>
                        setNewMediaCategory(e.target.value as MediaAsset["category"])
                      }
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    >
                      <option value="Hero">Hero</option>
                      <option value="Project">Project</option>
                      <option value="Service">Service</option>
                      <option value="Blog">Blog</option>
                      <option value="Brand">Brand</option>
                      <option value="General">General</option>
                    </select>
                    <label className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingFile ? "Uploading..." : "Choose File & Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Add External URL */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newMediaUrl) return;
                    const res = await postCMS("media", {
                      title: newMediaTitle || "Architectural Asset",
                      url: newMediaUrl,
                      altText: newMediaAlt || newMediaTitle || "ARCH NEW ERA DESIGN image",
                      category: newMediaCategory,
                    });
                    if (res?.success && res.data) {
                      setMedia((p) => [res.data, ...p]);
                      setNewMediaUrl("");
                      setNewMediaTitle("");
                      setNewMediaAlt("");
                      toast.success("Media asset added!");
                    }
                  }}
                  className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 space-y-4"
                >
                  <h3 className="font-serif text-lg font-bold">Register Image URL</h3>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Alt Text"
                      value={newMediaAlt}
                      onChange={(e) => setNewMediaAlt(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                    >
                      Save Asset
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {media.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img src={m.url} alt={m.altText} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-[#B89246]">
                        {m.category}
                      </span>
                      <h4 className="font-serif font-bold text-xs truncate">{m.title}</h4>
                      <p className="text-[11px] text-slate-500 truncate">Alt: {m.altText}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(m.url);
                            toast.success("Image URL copied to clipboard!");
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#071A35] dark:text-[#F2D99B]"
                        >
                          <Copy className="w-3 h-3" /> Copy URL
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({ module: "media", id: m.id, name: m.title })
                          }
                          aria-label={`Delete ${m.title}`}
                          className="p-1.5 rounded bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 17. CONTACT SETTINGS & SOCIAL LINKS */}
          {activeTab === "contact" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await postCMS("siteSettings", siteSettings);
                await postCMS("socialLinks", socialLinks);
                toast.success("Contact details & social links updated in MySQL!");
              }}
              className="rounded-2xl bg-white dark:bg-slate-900 p-7 border border-slate-200 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold">
                    Contact Person, Address & Social Media Settings
                  </h2>
                  <p className="text-xs text-slate-500">
                    All changes immediately update the Navbar, Footer, Contact Page, and WhatsApp buttons.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                >
                  <Save className="w-4 h-4" /> Save Contact Settings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">
                    Primary Contact Person
                  </label>
                  <input
                    type="text"
                    value={siteSettings.contactPerson}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, contactPerson: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={siteSettings.phone}
                    onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={siteSettings.whatsapp}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={siteSettings.email}
                    onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase block mb-1">Business Address</label>
                  <input
                    type="text"
                    value={siteSettings.address}
                    onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h3 className="font-serif text-lg font-bold">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {socialLinks.map((soc, idx) => (
                    <div key={soc.id} className="flex items-center gap-2">
                      <span className="w-24 text-xs font-bold">{soc.platform}:</span>
                      <input
                        type="text"
                        value={soc.url}
                        onChange={(e) => {
                          const next = [...socialLinks];
                          next[idx] = { ...soc, url: e.target.value };
                          setSocialLinks(next);
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* 18. ADMIN USERS */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold">Admin Users & Roles ({users.length})</h2>
                <button
                  type="button"
                  onClick={() =>
                    setEditingUser({
                      name: "",
                      email: "",
                      roleId: "role-editor",
                      roleName: "Content Manager",
                      isActive: true,
                      newPassword: "",
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                >
                  + Add Admin User
                </button>
              </div>

              {editingUser && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingUser.name || !editingUser.email) return;
                    const res = await postCMS("users", editingUser);
                    if (res?.success && res.data) {
                      setUsers((p) => [...p.filter((u) => u.id !== res.data.id), res.data]);
                      setEditingUser(null);
                      toast.success("Admin user saved!");
                    }
                  }}
                  className="p-6 rounded-2xl bg-white border-2 border-[#D6B36A] grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={editingUser.name || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email *"
                    value={editingUser.email || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Password (min 5 chars)"
                    value={editingUser.newPassword || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, newPassword: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-lg bg-[#071A35] text-[#F2D99B] text-xs font-bold"
                    >
                      Save User
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-base">{u.name}</h4>
                      <p className="text-xs text-slate-500">
                        {u.email} • <strong className="text-[#B89246]">{u.roleName}</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingUser(u)}
                      aria-label={`Edit ${u.name}`}
                      className="p-2 rounded bg-slate-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 19. PROFILE & SECURITY */}
          {activeTab === "profile" && (
            <div className="max-w-2xl space-y-6">
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B89246]">
                      ADMIN CREDENTIALS & SECURITY
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#071A35] dark:text-white mt-0.5">
                      Admin Profile & Password
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#D6B36A]/20 text-[#071A35] dark:text-[#F2D99B] text-xs font-bold">
                    {currentUser.roleName}
                  </span>
                </div>

                {/* Edit Personal Details */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!profileName.trim() || !profileEmail.trim()) {
                      toast.error("Name and Email are required.");
                      return;
                    }
                    setUpdatingProfile(true);
                    const res = await postCMS("profile", {
                      name: profileName.trim(),
                      email: profileEmail.trim(),
                    });
                    setUpdatingProfile(false);
                    if (res?.success) {
                      toast.success("Profile details updated successfully!");
                      setUsers((prev) =>
                        prev.map((u) =>
                          u.email.toLowerCase() === currentUser.email.toLowerCase()
                            ? { ...u, name: profileName.trim(), email: profileEmail.trim() }
                            : u
                        )
                      );
                    }
                  }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#071A35] dark:text-white">
                    1. Edit Admin Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#071A35] text-[#F2D99B] text-xs font-bold hover:bg-[#10284A] transition cursor-pointer touch-manipulation active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    {updatingProfile ? "Saving Details..." : "Save Details"}
                  </button>
                </form>

                <hr className="border-slate-200 dark:border-slate-800" />

                {/* Change Password Form */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newPassword) {
                      toast.error("Please enter a new password.");
                      return;
                    }
                    if (newPassword.length < 5) {
                      toast.error("New password must be at least 5 characters.");
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      toast.error("New password and confirm password do not match!");
                      return;
                    }
                    setUpdatingProfile(true);
                    const res = await postCMS("profile", {
                      currentPassword,
                      newPassword,
                    });
                    setUpdatingProfile(false);
                    if (res?.success) {
                      toast.success("Password changed successfully! Keep your new password safe.");
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }
                  }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#071A35] dark:text-white">
                    2. Change Account Password
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold uppercase block mb-1">
                        Current Password (Optional if forgotten)
                      </label>
                      <input
                        type="password"
                        placeholder="Current admin password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase block mb-1">
                          New Password (Min 5 chars) *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="New password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase block mb-1">
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6B36A] to-[#F2D99B] text-[#071A35] text-xs font-bold hover:brightness-105 transition cursor-pointer touch-manipulation active:scale-95 shadow-gold"
                  >
                    <Save className="w-4 h-4" />
                    {updatingProfile ? "Updating Password..." : "Update Password Now"}
                  </button>
                </form>

                <hr className="border-slate-200 dark:border-slate-800" />

                {/* Session Sign Out */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Active login session for <strong>{currentUser.email}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition cursor-pointer touch-manipulation active:scale-95"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={saving}
      />

      {/* Media Picker Modal */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#071A35] dark:text-white">
                  Select Image from Media Library
                </h3>
                <p className="text-xs text-slate-500">
                  {mediaPickerTarget === "serviceFeatured"
                    ? "Click an image to set as the Service Cover / Featured Image"
                    : mediaPickerTarget === "serviceGallery"
                    ? "Click an image to add it to the Service Photo Gallery"
                    : mediaPickerTarget === "projectCover"
                    ? "Click an image to set as the Project Cover Photo"
                    : mediaPickerTarget === "projectGallery"
                    ? "Click an image to add it to the Project Photo Gallery"
                    : mediaPickerTarget === "heroImage"
                    ? "Click an image to set as the Homepage Hero Background"
                    : mediaPickerTarget === "logoUrl"
                    ? "Click an image to set as the Website Logo"
                    : mediaPickerTarget === "galleryItem"
                    ? "Click an image to set as the Portfolio Gallery Photo"
                    : mediaPickerTarget === "blogFeatured"
                    ? "Click an image to set as the Blog Article Cover"
                    : mediaPickerTarget === "aboutImage"
                    ? "Click an image to set as the About Page Image"
                    : "Click an image to select from library"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter / Search Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search media by title or keyword..."
                  value={mediaPickerSearch}
                  onChange={(e) => setMediaPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {["All", "Service", "Project", "Hero", "Brand", "General"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMediaPickerCategory(cat)}
                    className={`px-3 py-1 rounded-full font-medium transition ${
                      mediaPickerCategory === cat
                        ? "bg-[#071A35] text-[#F2D99B]"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#D6B36A]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Images Grid */}
            <div className="p-5 flex-1 overflow-y-auto">
              {filteredPickerMedia.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No images found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredPickerMedia.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => handleSelectFromMediaPicker(asset)}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#071A35] aspect-video cursor-pointer hover:border-[#D6B36A] hover:shadow-lg transition-all"
                    >
                      <img
                        src={asset.url}
                        alt={asset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                        <span className="text-[10px] text-white font-medium line-clamp-1">
                          {asset.title}
                        </span>
                        <button
                          type="button"
                          className="w-full py-1.5 rounded bg-[#D6B36A] text-[#071A35] font-bold text-xs shadow text-center"
                        >
                          Select Image
                        </button>
                      </div>
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white font-medium group-hover:hidden">
                        {asset.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <span className="text-xs text-slate-500">
                Showing {filteredPickerMedia.length} assets
              </span>
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
