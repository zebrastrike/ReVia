import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/**
 * Inventory & pricing update from 04.10.26 spreadsheet.
 * Wholesale prices → Retail at ~3.5x, Founders ~20% off retail, Friends ~40% off retail.
 * Rounds to x9.99 or x9 endings for clean pricing.
 */

// Helper: wholesale → retail/founders/friends (all in CENTS)
function calcPricing(wholesale: number): { retail: number; founders: number; friends: number } {
  const retailDollars = wholesale * 3.5;
  // Round to nearest .99
  const retail = Math.round(Math.ceil(retailDollars) - 0.01) * 100 + 99;
  const founders = Math.round(retail * 0.80); // 20% off
  const friends = Math.round(retail * 0.60);  // 40% off
  return { retail, founders, friends };
}

// Product pricing from spreadsheet (wholesale in dollars)
const INVENTORY: Array<{
  slug: string;
  variants: Array<{
    label: string;
    sku: string;
    wholesale: number;
  }>;
}> = [
  // ── ORAL CAPSULES ──
  { slug: "rebalance", variants: [{ label: "120 Capsules", sku: "RV-OCS-REB-120-ORA", wholesale: 68 }] },
  { slug: "rebalance-sample-pack", variants: [{ label: "10 Capsules", sku: "RV-OCS-REB-10-ORA", wholesale: 6 }] },
  { slug: "recover", variants: [{ label: "60 Capsules", sku: "RV-OCS-REC-60-ORA", wholesale: 54 }] },
  { slug: "recover-sample-pack", variants: [{ label: "5 Capsules", sku: "RV-OCS-REC-5-ORA", wholesale: 4.5 }] },
  { slug: "revive", variants: [{ label: "60 Capsules", sku: "RV-OCS-REV-60-ORA", wholesale: 63 }] },
  { slug: "revive-sample-pack", variants: [{ label: "5 Capsules", sku: "RV-OCS-REV-5-ORA", wholesale: 5.5 }] },

  // ── METABOLIC & WEIGHT MANAGEMENT ──
  { slug: "5-amino-1mq", variants: [
    { label: "5mg", sku: "RV-MWM-5AM-5-SC", wholesale: 22.5 },
    { label: "10mg", sku: "RV-MWM-5AM-10-SC", wholesale: 33.75 },
  ]},
  { slug: "aod-9604", variants: [
    { label: "5mg", sku: "RV-MWM-AOD-5-SC", wholesale: 32.75 },
    { label: "10mg", sku: "RV-MWM-AOD-10-SC", wholesale: 50.75 },
  ]},
  { slug: "adipotide", variants: [{ label: "5mg", sku: "RV-MWM-ADI-5-SC", wholesale: 61 }] },
  { slug: "cagrilintide", variants: [
    { label: "5mg", sku: "RV-MWM-CAG-5-SC", wholesale: 33.75 },
    { label: "10mg", sku: "RV-MWM-CAG-10-SC", wholesale: 56.25 },
  ]},
  { slug: "mots-c", variants: [{ label: "10mg", sku: "RV-MWM-MOT-10-SC", wholesale: 24.75 }] },
  { slug: "mots-c-40mg", variants: [{ label: "40mg", sku: "RV-MWM-MOT-40-SC", wholesale: 65.25 }] },
  { slug: "mazdutide", variants: [{ label: "10mg", sku: "RV-MWM-MAZ-10-SC", wholesale: 65 }] },
  { slug: "retatrutide", variants: [
    { label: "5mg", sku: "RV-MWM-RET-5-SC", wholesale: 21 },
    { label: "10mg", sku: "RV-MWM-RET-10-SC", wholesale: 32.75 },
    { label: "30mg", sku: "RV-MWM-RET-30-SC", wholesale: 71 },
  ]},
  { slug: "retatrutide-60mg", variants: [{ label: "60mg", sku: "RV-MWM-RET-60-SC", wholesale: 110 }] },
  { slug: "semaglutide", variants: [
    { label: "5mg", sku: "RV-MWM-SEM-5-SC", wholesale: 24.75 },
    { label: "10mg", sku: "RV-MWM-SEM-10-SC", wholesale: 33 },
    { label: "30mg", sku: "RV-MWM-SEM-30-SC", wholesale: 37 },
  ]},
  { slug: "survodutide", variants: [{ label: "10mg", sku: "RV-MWM-SUR-10-SC", wholesale: 89.5 }] },
  { slug: "tirzepatide", variants: [
    { label: "5mg", sku: "RV-MWM-TIR-5-SC", wholesale: 19 },
    { label: "10mg", sku: "RV-MWM-TIR-10-SC", wholesale: 24 },
    { label: "15mg", sku: "RV-MWM-TIR-15-SC", wholesale: 31 },
  ]},
  { slug: "tirzepatide-30mg", variants: [{ label: "30mg", sku: "RV-MWM-TIR-30-SC", wholesale: 39 }] },
  { slug: "tirzepatide-60mg", variants: [{ label: "60mg", sku: "RV-MWM-TIR-60-SC", wholesale: 61.75 }] },

  // ── GROWTH HORMONE & PERFORMANCE ──
  { slug: "aicar", variants: [{ label: "5mg", sku: "RV-GHP-AIC-5-SC", wholesale: 24 }] },
  { slug: "cjc-1295-no-dac", variants: [
    { label: "5mg", sku: "RV-GHP-CJC-5-SC", wholesale: 24.75 },
    { label: "10mg", sku: "RV-GHP-CJC-10-SC", wholesale: 51 },
  ]},
  { slug: "cjc-1295-with-dac", variants: [{ label: "5mg", sku: "RV-GHP-CJCNOD-5-SC", wholesale: 50.75 }] },
  { slug: "cjc-1295-ipamorelin", variants: [{ label: "5mg / 5mg", sku: "RV-GHP-CJC-5/5-SC", wholesale: 33 }] },
  { slug: "follistatin-344", variants: [{ label: "1mg", sku: "RV-GHP-FOL-1-SC", wholesale: 77 }] },
  { slug: "ghrp-2", variants: [
    { label: "5mg", sku: "RV-GHP-GH2-5-SC", wholesale: 14.75 },
    { label: "10mg", sku: "RV-GHP-GH2-10-SC", wholesale: 21 },
  ]},
  { slug: "ghrp-6", variants: [
    { label: "5mg", sku: "RV-GHP-GH6-5-SC", wholesale: 14.75 },
    { label: "10mg", sku: "RV-GHP-GH6-10-SC", wholesale: 21 },
  ]},
  { slug: "hgh-fragment-176-191", variants: [{ label: "5mg", sku: "RV-GHP-HGH-5-SC", wholesale: 37 }] },
  { slug: "hexarellin-acetate", variants: [{ label: "5mg", sku: "RV-GHP-HEX-5-SC", wholesale: 26 }] },
  { slug: "igf-1-lr3", variants: [
    { label: "0.1mg", sku: "RV-GHP-IGF-0.1-SC", wholesale: 13 },
    { label: "1mg", sku: "RV-GHP-IGF-1-SC", wholesale: 67.5 },
  ]},
  { slug: "ipamorelin", variants: [{ label: "5mg", sku: "RV-GHP-IPA-5-SC", wholesale: 15 }] },
  { slug: "ipamorelin-10mg", variants: [{ label: "10mg", sku: "RV-GHP-IPA-10-SC", wholesale: 26 }] },
  { slug: "sermorelin", variants: [{ label: "5mg", sku: "RV-GHP-SER-5-SC", wholesale: 23.75 }] },
  { slug: "sermorelin-10mg", variants: [{ label: "10mg", sku: "RV-GHP-SER-10-SC", wholesale: 37 }] },
  { slug: "tesamorelin", variants: [{ label: "5mg", sku: "RV-GHP-TES-5-SC", wholesale: 36 }] },
  { slug: "tesamorelin-10mg", variants: [{ label: "10mg", sku: "RV-GHP-TES-10-SC", wholesale: 66 }] },

  // ── HEALING, RECOVERY & IMMUNE ──
  { slug: "ara-290", variants: [{ label: "10mg", sku: "RV-HRI-ARA-10-SC", wholesale: 23 }] },
  { slug: "bpc-157", variants: [
    { label: "5mg", sku: "RV-HRI-BPC-5-SC", wholesale: 17 },
    { label: "10mg", sku: "RV-HRI-BPC-10-SC", wholesale: 22.5 },
  ]},
  { slug: "bpc-157-tb-500", variants: [
    { label: "5mg / 5mg", sku: "RV-HRI-BPCTB-10-SC", wholesale: 33.75 },
    { label: "10mg / 10mg", sku: "RV-HRI-BPCTB-20-SC", wholesale: 62 },
  ]},
  { slug: "ghk-cu", variants: [{ label: "100mg", sku: "RV-HRI-GHK-100-SC", wholesale: 14.75 }] },
  { slug: "kpv", variants: [
    { label: "5mg", sku: "RV-HRI-KPV-5-SC", wholesale: 13.5 },
    { label: "10mg", sku: "RV-HRI-KPV-10-SC", wholesale: 17 },
  ]},
  { slug: "ll-37", variants: [{ label: "5mg", sku: "RV-HRI-LL3-5-SC", wholesale: 30 }] },
  { slug: "oxytocin-acetate", variants: [{ label: "2mg", sku: "RV-HRI-OXY-2-SC", wholesale: 13.5 }] },
  { slug: "tb-500", variants: [
    { label: "5mg", sku: "RV-HRI-TB5-5-SC", wholesale: 28 },
    { label: "10mg", sku: "RV-HRI-TB5-10-SC", wholesale: 49.5 },
  ]},
  { slug: "thymalin", variants: [{ label: "10mg", sku: "RV-HRI-THY-10-SC", wholesale: 21.5 }] },
  { slug: "thymosin-alpha-1", variants: [
    { label: "5mg", sku: "RV-HRI-TA1-5-SC", wholesale: 31 },
    { label: "10mg", sku: "RV-HRI-TA1-10-SC", wholesale: 56 },
  ]},
  { slug: "vip", variants: [
    { label: "5mg", sku: "RV-HRI-VIP-5-SC", wholesale: 28 },
    { label: "10mg", sku: "RV-HRI-VIP-10-SC", wholesale: 50 },
  ]},

  // ── COGNITIVE & LONGEVITY ──
  { slug: "cerebrolysin", variants: [{ label: "60mg (liquid)", sku: "RV-CL-CER-60-LIQ", wholesale: 15 }] },
  { slug: "dihexa", variants: [
    { label: "5mg", sku: "RV-CL-DIH-5-SC", wholesale: 34 },
    { label: "10mg", sku: "RV-CL-DIH-10-SC", wholesale: 45 },
  ]},
  { slug: "epitalon", variants: [{ label: "10mg", sku: "RV-CL-EPI-10-SC", wholesale: 17 }] },
  { slug: "epitalon-50mg", variants: [{ label: "50mg", sku: "RV-CL-EPI-50-SC", wholesale: 49.5 }] },
  { slug: "fox-04", variants: [{ label: "10mg", sku: "RV-CL-FOX-10-SC", wholesale: 129 }] },
  { slug: "humanin", variants: [{ label: "5mg", sku: "RV-CL-HUM-5-SC", wholesale: 28 }] },
  { slug: "humanin-10mg", variants: [{ label: "10mg", sku: "RV-CL-HUM-10-SC", wholesale: 45 }] },
  { slug: "nad-plus", variants: [
    { label: "100mg", sku: "RV-CL-NAD-100-SC", wholesale: 13 },
    { label: "500mg", sku: "RV-CL-NAD-500-SC", wholesale: 30 },
  ]},
  { slug: "pinealon", variants: [
    { label: "10mg", sku: "RV-CL-PIN-10-SC", wholesale: 23 },
    { label: "20mg", sku: "RV-CL-PIN-20-SC", wholesale: 31.5 },
  ]},
  { slug: "slu-pp-332", variants: [{ label: "5mg", sku: "RV-CL-SLU-5-SC", wholesale: 45 }] },
  { slug: "ss-31", variants: [{ label: "10mg", sku: "RV-CL-SS3-10-SC", wholesale: 31.5 }] },
  { slug: "selank", variants: [
    { label: "5mg", sku: "RV-CL-SEL-5-SC", wholesale: 13.5 },
    { label: "10mg", sku: "RV-CL-SEL-10-SC", wholesale: 22.5 },
  ]},
  { slug: "semax", variants: [
    { label: "5mg", sku: "RV-CL-SEM-5-SC", wholesale: 12.5 },
    { label: "10mg", sku: "RV-CL-SEM-10-SC", wholesale: 20.25 },
  ]},

  // ── SEXUAL HEALTH & SPECIALTY ──
  { slug: "dsip", variants: [
    { label: "5mg", sku: "RV-SHS-DSI-5-SC", wholesale: 18 },
    { label: "15mg", sku: "RV-SHS-DSI-15-SC", wholesale: 33 },
  ]},
  { slug: "kisspeptin", variants: [
    { label: "5mg", sku: "RV-SHS-KIS-5-SC", wholesale: 22.5 },
    { label: "10mg", sku: "RV-SHS-KIS-10-SC", wholesale: 37 },
  ]},
  { slug: "melanotan-1", variants: [{ label: "10mg", sku: "RV-SHS-MT1-10-SC", wholesale: 17 }] },
  { slug: "melanotan-2", variants: [{ label: "10mg", sku: "RV-SHS-MT2-10-SC", wholesale: 15.75 }] },
  { slug: "pt-141", variants: [{ label: "10mg", sku: "RV-SHS-PT1-10-SC", wholesale: 24 }] },

  // ── TOPICALS & SERUMS ──
  { slug: "snap-8", variants: [{ label: "10mg", sku: "RV-TS-SNA-10-SC", wholesale: 12.5 }] },
  { slug: "snap-8-ghk-cu-serum", variants: [{ label: "30ml", sku: "RV-TS-SNA-30-SER", wholesale: 21.5 }] },
  { slug: "privive-transdermal", variants: [{ label: "30ml", sku: "RV-TS-PRI-30-SER", wholesale: 38.75 }] },

  // ── SPECIALTY BLENDS & LIQUIDS ──
  { slug: "glow", variants: [{ label: "50/10/10mg", sku: "RV-SBL-GLO-70-SC", wholesale: 64 }] },
  { slug: "glutathione", variants: [{ label: "1,500mg", sku: "RV-SBL-GLU-1500-SC", wholesale: 22.5 }] },
  { slug: "klow", variants: [{ label: "50/10/10/10mg", sku: "RV-SBL-KLO-80-SC", wholesale: 66 }] },
  { slug: "l-carnitine", variants: [{ label: "600mg (liquid)", sku: "RV-SBL-LCA-600-LIQ", wholesale: 24.75 }] },
  { slug: "lc120", variants: [{ label: "10ml", sku: "RV-SBL-LC1-10-LIQ", wholesale: 21.5 }] },
  { slug: "lc216", variants: [{ label: "10ml", sku: "RV-SBL-LC2-10-LIQ", wholesale: 21.5 }] },
  { slug: "super-human-blend", variants: [{ label: "10ml", sku: "RV-SBL-SUP-10-LIQ", wholesale: 29.25 }] },

  // ── SUPPLIES ──
  { slug: "acetic-acid-water", variants: [{ label: "10ml", sku: "RV-H2O-AES-10-LIQ", wholesale: 3.5 }] },
  { slug: "bac-water", variants: [{ label: "10ml", sku: "RV-H2O-BAC-10-LIQ", wholesale: 3.5 }] },
];

// New product not yet in DB
const NEW_PRODUCTS: Array<{
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  tags: string[];
  active: boolean;
  variants: Array<{ label: string; sku: string; wholesale: number }>;
}> = [
  {
    name: "MGF",
    slug: "mgf",
    description: "Mechano Growth Factor — splice variant of IGF-1 studied for localized muscle repair, satellite cell activation, and tissue regeneration.",
    categorySlug: "growth-hormone",
    tags: ["growth-hormone", "recovery"],
    active: false,
    variants: [{ label: "2mg", sku: "RV-GHP-MGF-2-SC", wholesale: 24 }],
  },
];

async function main() {
  console.log("📦 Updating inventory & pricing from 04.10.26 spreadsheet...\n");

  let updated = 0;
  let notFound = 0;
  let variantsUpdated = 0;

  for (const item of INVENTORY) {
    const product = await prisma.product.findUnique({
      where: { slug: item.slug },
      include: { variants: true },
    });

    if (!product) {
      console.log(`⚠️  Product not found: ${item.slug}`);
      notFound++;
      continue;
    }

    for (const sv of item.variants) {
      const pricing = calcPricing(sv.wholesale);

      // Find variant by SKU or label
      const variant = product.variants.find(
        (v) => v.sku === sv.sku || v.label === sv.label
      );

      if (variant) {
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: {
            label: sv.label,
            sku: sv.sku,
            price: pricing.retail,
            retailPrice: pricing.retail,
            foundersPrice: pricing.founders,
            friendsPrice: pricing.friends,
          },
        });
        variantsUpdated++;
      } else {
        // Variant doesn't exist — create it
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            label: sv.label,
            sku: sv.sku,
            price: pricing.retail,
            retailPrice: pricing.retail,
            foundersPrice: pricing.founders,
            friendsPrice: pricing.friends,
            quantity: 0,
            reorderThreshold: 0,
            inStock: false,
          },
        });
        console.log(`  + Added variant: ${product.name} ${sv.label}`);
        variantsUpdated++;
      }
    }

    updated++;
  }

  // ── Create new products ──
  for (const np of NEW_PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { slug: np.slug } });
    if (existing) {
      console.log(`⏭️  ${np.name} already exists, skipping`);
      continue;
    }

    const cat = await prisma.category.findUnique({ where: { slug: np.categorySlug } });
    if (!cat) {
      console.log(`⚠️  Category not found: ${np.categorySlug}`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: np.name,
        slug: np.slug,
        description: np.description,
        categoryId: cat.id,
        active: np.active,
        tags: JSON.stringify(np.tags),
        variants: {
          create: np.variants.map((v) => {
            const pricing = calcPricing(v.wholesale);
            return {
              label: v.label,
              sku: v.sku,
              price: pricing.retail,
              retailPrice: pricing.retail,
              foundersPrice: pricing.founders,
              friendsPrice: pricing.friends,
              quantity: 0,
              reorderThreshold: 0,
              inStock: false,
            };
          }),
        },
      },
    });
    console.log(`✅ Created new product: ${np.name}`);
  }

  // ── Fix SS-31: current seed has 50mg, spreadsheet says 10mg ──
  const ss31 = await prisma.product.findUnique({
    where: { slug: "ss-31" },
    include: { variants: true },
  });
  if (ss31) {
    for (const v of ss31.variants) {
      if (v.label.includes("50mg")) {
        await prisma.productVariant.update({
          where: { id: v.id },
          data: { label: "10mg" },
        });
        console.log(`🔧 Fixed SS-31 variant: 50mg → 10mg`);
      }
    }
  }

  console.log(`\n✅ Done: ${updated} products updated, ${variantsUpdated} variants priced, ${notFound} not found`);

  // Print a sample of pricing for verification
  console.log("\n📊 Sample pricing verification:");
  for (const slug of ["tirzepatide", "bpc-157", "ghk-cu", "epitalon", "bac-water"]) {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { variants: true },
    });
    if (p) {
      for (const v of p.variants) {
        console.log(`  ${p.name} ${v.label}: retail $${(v.price / 100).toFixed(2)}, founders $${((v.foundersPrice ?? 0) / 100).toFixed(2)}, friends $${((v.friendsPrice ?? 0) / 100).toFixed(2)}`);
      }
    }
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
