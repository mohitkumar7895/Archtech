import { db } from "@/lib/db";
import { validateSEOPageInput } from "@/lib/validations";

export const seoService = {
  async getAllPagesWithHealth() {
    const pages = await db.getSEOPages(false);
    return pages.map((page) => {
      const otherSlugs = pages.filter((p) => p.id !== page.id).map((p) => p.slug);
      const warnings = validateSEOPageInput(page, otherSlugs);
      return {
        ...page,
        warnings,
        healthScore: Math.max(0, 100 - warnings.length * 15),
      };
    });
  },
};
