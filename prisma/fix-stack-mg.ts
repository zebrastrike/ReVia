import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Fixing stack mg counts...\n");

  // ── RENEW: 220mg → 120mg ──
  const renew = await prisma.product.findUnique({
    where: { slug: "revia-renew" },
    include: { variants: true },
  });

  if (renew) {
    await prisma.product.update({
      where: { id: renew.id },
      data: {
        description: "Full-spectrum recovery blend — BPC-157 10mg + TB-500 10mg + GHK-Cu 100mg. Systemic tissue repair, anti-inflammatory action, and regenerative peptide signaling in one vial.",
      },
    });

    for (const v of renew.variants) {
      if (v.label.includes("220")) {
        await prisma.productVariant.update({
          where: { id: v.id },
          data: {
            label: "120mg Blended Vial",
            sku: v.sku.replace("220", "120"),
          },
        });
        console.log(`✅ RENEW variant: "${v.label}" → "120mg Blended Vial"`);
      }
    }
  }

  // ── SCULPT & GLOW: 145mg → 125mg, GHK-Cu 100mg → 80mg ──
  const sculpt = await prisma.product.findUnique({
    where: { slug: "revia-sculpt-glow" },
    include: { variants: true },
  });

  if (sculpt) {
    await prisma.product.update({
      where: { id: sculpt.id },
      data: {
        description: "Ultimate body composition and aesthetics blend — Ipamorelin 10mg + Tirzepatide 10mg + Cagrilintide 5mg + BPC-157 10mg + TB-500 10mg + GHK-Cu 80mg. Six-peptide formula combining metabolic, recovery, and skin-health signaling.",
      },
    });

    for (const v of sculpt.variants) {
      if (v.label.includes("145")) {
        await prisma.productVariant.update({
          where: { id: v.id },
          data: {
            label: "125mg Blended Vial",
            sku: v.sku.replace("145", "125"),
          },
        });
        console.log(`✅ SCULPT & GLOW variant: "${v.label}" → "125mg Blended Vial"`);
      }
    }
  }

  console.log("\n✅ Done");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
