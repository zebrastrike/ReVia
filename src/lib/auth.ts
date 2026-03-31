import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "revia-dev-secret-change-in-production";
const TOKEN_EXPIRY = "7d";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(cookieStore: { get(name: string): { value: string } | undefined }): Promise<AuthUser | null> {
  const tokenCookie = cookieStore.get("auth-token");
  if (!tokenCookie) return null;

  const payload = verifyToken(tokenCookie.value);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return user;
}
