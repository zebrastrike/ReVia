import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const oldSkus = ["RV-OCS-REB-10-ORA", "RV-OCS-REC-5-ORA", "RV-OCS-REV-5-ORA", "RV-MIS-SYR20-1-MIS"];
  for (const sku of oldSkus) {
    try {
      await prisma.productVariant.delete({ where: { sku } });
      console.log(`Deleted old variant: ${sku}`);
    } catch {
      console.log(`Not found (already clean): ${sku}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
