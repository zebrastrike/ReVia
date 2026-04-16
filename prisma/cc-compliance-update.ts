import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔧 CC compliance updates...\n");

  // Rename "Weight Management" → "Metabolic Research"
  const wmCat = await prisma.category.findUnique({ where: { slug: "weight-management" } });
  if (wmCat) {
    await prisma.category.update({
      where: { id: wmCat.id },
      data: { name: "Metabolic Research", description: "Peptides studied for metabolic optimization and body composition research." },
    });
    console.log("✅ Category: Weight Management → Metabolic Research");
  }

  // Update product tags: "weight-management" → "metabolic-research"
  const products = await prisma.product.findMany({ select: { id: true, slug: true, tags: true } });
  let updated = 0;
  for (const p of products) {
    if (p.tags && p.tags.includes("weight-management")) {
      const newTags = p.tags.replace(/weight-management/g, "metabolic-research");
      await prisma.product.update({ where: { id: p.id }, data: { tags: newTags } });
      updated++;
    }
  }
  console.log(`✅ Updated ${updated} product tags: weight-management → metabolic-research`);

  // Update product descriptions: remove "weight management" → "metabolic optimization"
  const allProducts = await prisma.product.findMany({ select: { id: true, description: true } });
  let descUpdated = 0;
  for (const p of allProducts) {
    if (p.description && /weight management/i.test(p.description)) {
      const newDesc = p.description
        .replace(/weight management/gi, "metabolic optimization")
        .replace(/appetite regulation/gi, "satiety signaling")
        .replace(/fat metabolism/gi, "energy utilization");
      await prisma.product.update({ where: { id: p.id }, data: { description: newDesc } });
      descUpdated++;
    }
  }
  console.log(`✅ Updated ${descUpdated} product descriptions`);

  console.log("\n✅ Done — CC compliance updates applied");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
