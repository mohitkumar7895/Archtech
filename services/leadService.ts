import { db } from "@/lib/db";
import { EnquiryFormValues } from "@/lib/validations";

// Simple in-memory rate limiter for public enquiry endpoint
const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, maxRequests = 12, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = ipRequestMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequestMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

export const leadService = {
  async submitEnquiry(payload: EnquiryFormValues) {
    return db.createEnquiry(payload);
  },
};
