import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatWhatsAppUrl(phone: string, text?: string): string {
  const clean = phone.replace(/\D/g, "");
  const formatted = clean.length === 10 ? `91${clean}` : clean;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${formatted}${query}`;
}
