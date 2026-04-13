export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, hashPassword, comparePassword } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  // Get last shipping address from most recent order
  const lastOrder = await prisma.order.findFirst({
    where: { userId: payload.id },
    orderBy: { createdAt: "desc" },
    select: { address: true, city: true, state: true, zip: true },
  });

  return NextResponse.json({
    user,
    lastAddress: lastOrder ? {
      address: lastOrder.address,
      city: lastOrder.city,
      state: lastOrder.state,
      zip: lastOrder.zip,
    } : null,
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body as {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    };

    const data: Record<string, string> = {};

    if (name && name.trim()) data.name = name.trim();

    if (email && email.trim()) {
      const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
      if (existing && existing.id !== payload.id) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
      data.email = email.toLowerCase().trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password required" }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
      }
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const valid = await comparePassword(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      data.password = await hashPassword(newPassword);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: payload.id },
      select: { id: true, name: true, email: true },
      data,
    });

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("PATCH /api/auth/me error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
