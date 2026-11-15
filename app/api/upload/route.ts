import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdminAuth } from "@/lib/permissions";
import { db } from "@/lib/db";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/avif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "Uploaded Image";
    const altText = (formData.get("altText") as string) || title;
    const category = ((formData.get("category") as string) || "General") as any;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed formats: JPG, PNG, WebP, SVG, AVIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds maximum allowed size of 5 MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeExt = path.extname(file.name) || ".jpg";
    const baseName = path
      .basename(file.name, safeExt)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-");
    const fileName = `${Date.now()}-${baseName}${safeExt}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${fileName}`;

    const mediaAsset = await db.saveMedia({
      title,
      url: publicUrl,
      altText,
      category,
      mimeType: file.type,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      asset: mediaAsset,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "File upload failed" }, { status: 500 });
  }
}
