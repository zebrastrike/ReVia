export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("auth-token", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });

  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", cookie);
  return response;
}
