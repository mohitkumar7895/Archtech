import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enquirySchema } from "@/lib/validations";
import { requireAdminAuth } from "@/lib/permissions";
import { checkRateLimit, leadService } from "@/services/leadService";
import { revalidatePath } from "next/cache";

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const enquiries = await db.getEnquiries();
  return NextResponse.json({ enquiries });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(`enquiry:${ip}`, 15, 60_000)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const enquiry = await leadService.submitEnquiry(parsed.data);
    revalidatePath("/admin/dashboard");
    return NextResponse.json({
      success: true,
      message: "Thank you! Manoj Kumar Sharma's team at ARCH NEW ERA DESIGN will contact you shortly.",
      enquiry,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to submit enquiry" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id, status, followUpDate, newNote } = body;
    if (!id) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
    }
    const updated = await db.updateEnquiry(id, {
      status,
      followUpDate,
      newNote,
      noteAuthor: auth.user?.name || "Manoj Kumar Sharma",
    });
    revalidatePath("/admin/dashboard");
    return NextResponse.json({ success: true, enquiry: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update enquiry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
  }
  await db.deleteEnquiry(id);
  revalidatePath("/admin/dashboard");
  return NextResponse.json({ success: true });
}
