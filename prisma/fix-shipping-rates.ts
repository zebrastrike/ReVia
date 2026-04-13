import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const rates = [
    { label: "Standard Shipping", price: 795, estimate: "5-7 business days", minOrder: 0 },
    { label: "Priority Shipping", price: 1295, estimate: "2-3 business days", minOrder: 0 },
    { label: "Overnight Shipping", price: 4995, estimate: "Next business day", minOrder: 0 },
    { label: "FREE Standard Shipping", price: 0, estimate: "5-7 business days", minOrder: 20000 },
    { label: "Priority Shipping", price: 995, estimate: "2-3 business days", minOrder: 20000 },
    { label: "Overnight Shipping", price: 4995, estimate: "Next business day", minOrder: 20000 },
  ];

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { shippingRates: JSON.stringify(rates) },
    create: { id: "singleton", shippingRates: JSON.stringify(rates) },
  });

  console.log("✅ Shipping rates set:");
  console.log("   $0-$199: Standard $7.95 / Priority $12.95 / Overnight $49.95");
  console.log("   $200+:   FREE Standard / Priority $9.95 / Overnight $49.95");
}

main().finally(() => prisma.$disconnect());
