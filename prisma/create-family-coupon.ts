import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Check if already exists
  const existing = await prisma.coupon.findUnique({ where: { code: "REVIAFAMILY" } });
  if (existing) {
    console.log("Coupon REVIAFAMILY already exists");
    return;
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: "REVIAFAMILY",
      type: "percentage",
      value: 40,
      minOrder: 0,
      maxUses: 0, // unlimited uses
      active: true,
      expiresAt: null, // never expires
    },
  });

  console.log(`✅ Created coupon: ${coupon.code} — ${coupon.value}% off, unlimited uses, no expiry`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
