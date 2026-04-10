export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactAutoReply } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // Send auto-reply
    try {
      await sendContactAutoReply(name, email, subject);
    } catch (emailErr) {
      console.error("Failed to send contact auto-reply:", emailErr);
    }

    return NextResponse.json({ success: true, id: contact.id });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
