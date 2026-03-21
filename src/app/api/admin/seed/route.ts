import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  // Safety check: only works if no admin user exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "admin" },
  });

  if (existingAdmin) {
    return Response.json(
      { message: "Admin user already exists", email: existingAdmin.email },
      { status: 200 }
    );
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@revia.bio",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  return Response.json({
    message: "Admin user created successfully",
    email: admin.email,
    name: admin.name,
  });
}
