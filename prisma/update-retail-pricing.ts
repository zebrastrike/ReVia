import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/**
 * Retail pricing from "Next Pass Summary" sheet (04.10.26).
 * F&F = 40% off retail. Founders = 20% off retail.
 * All prices stored in CENTS.
 */

interface PriceEntry {
  slug: string;
  label: string;
  sku: string;
  retail: number; // dollars from spreadsheet
}

const PRICES: PriceEntry[] = [
  // ── ORAL CAPSULES ──
  { slug: "rebalance", label: "120 Capsules", sku: "RV-OCS-REB-120-ORA", retail: 156.99 },
  { slug: "rebalance-sample-pack", label: "20 Capsules", sku: "RV-OCS-REB-20-ORA", retail: 14.59 },
  { slug: "recover", label: "60 Capsules", sku: "RV-OCS-REC-60-ORA", retail: 127.99 },
  { slug: "recover-sample-pack", label: "10 Capsules", sku: "RV-OCS-REC-10-ORA", retail: 12.57 },
  { slug: "revive", label: "60 Capsules", sku: "RV-OCS-REV-60-ORA", retail: 145.49 },
  { slug: "revive-sample-pack", label: "10 Capsules", sku: "RV-OCS-REV-10-ORA", retail: 13.92 },

  // ── METABOLIC & WEIGHT MANAGEMENT ──
  { slug: "5-amino-1mq", label: "5mg", sku: "RV-MWM-5AM-5-SC", retail: 75.49 },
  { slug: "5-amino-1mq", label: "10mg", sku: "RV-MWM-5AM-10-SC", retail: 112.99 },
  { slug: "aod-9604", label: "5mg", sku: "RV-MWM-AOD-5-SC", retail: 87.49 },
  { slug: "aod-9604", label: "10mg", sku: "RV-MWM-AOD-10-SC", retail: 133.99 },
  { slug: "adipotide", label: "5mg", sku: "RV-MWM-ADI-5-SC", retail: 156.99 },
  { slug: "cagrilintide", label: "5mg", sku: "RV-MWM-CAG-5-SC", retail: 97.99 },
  { slug: "cagrilintide", label: "10mg", sku: "RV-MWM-CAG-10-SC", retail: 143.99 },
  { slug: "mots-c", label: "10mg", sku: "RV-MWM-MOT-10-SC", retail: 80.99 },
  { slug: "mots-c-40mg", label: "40mg", sku: "RV-MWM-MOT-40-SC", retail: 244.49 },
  { slug: "mazdutide", label: "10mg", sku: "RV-MWM-MAZ-10-SC", retail: 208.99 },
  { slug: "retatrutide", label: "5mg", sku: "RV-MWM-RET-5-SC", retail: 85.49 },
  { slug: "retatrutide", label: "10mg", sku: "RV-MWM-RET-10-SC", retail: 139.49 },
  { slug: "retatrutide", label: "30mg", sku: "RV-MWM-RET-30-SC", retail: 287.49 },
  { slug: "retatrutide-60mg", label: "60mg", sku: "RV-MWM-RET-60-SC", retail: 461.99 },
  { slug: "semaglutide", label: "5mg", sku: "RV-MWM-SEM-5-SC", retail: 94.99 },
  { slug: "semaglutide", label: "10mg", sku: "RV-MWM-SEM-10-SC", retail: 149.99 },
  { slug: "semaglutide", label: "30mg", sku: "RV-MWM-SEM-30-SC", retail: 287.99 },
  { slug: "survodutide", label: "10mg", sku: "RV-MWM-SUR-10-SC", retail: 205.49 },
  { slug: "tirzepatide", label: "5mg", sku: "RV-MWM-TIR-5-SC", retail: 74.99 },
  { slug: "tirzepatide", label: "10mg", sku: "RV-MWM-TIR-10-SC", retail: 123.99 },
  { slug: "tirzepatide", label: "15mg", sku: "RV-MWM-TIR-15-SC", retail: 161.99 },
  { slug: "tirzepatide-30mg", label: "30mg", sku: "RV-MWM-TIR-30-SC", retail: 245.49 },
  { slug: "tirzepatide-60mg", label: "60mg", sku: "RV-MWM-TIR-60-SC", retail: 398.99 },

  // ── PERFORMANCE, GH & BODY ──
  { slug: "aicar", label: "5mg", sku: "RV-GHP-AIC-5-SC", retail: 73.99 },
  { slug: "cjc-1295-no-dac", label: "5mg", sku: "RV-GHP-CJC-5-SC", retail: 60.99 },
  { slug: "cjc-1295-no-dac", label: "10mg", sku: "RV-GHP-CJC-10-SC", retail: 118.99 },
  { slug: "cjc-1295-with-dac", label: "5mg", sku: "RV-GHP-CJCNOD-5-SC", retail: 123.49 },
  { slug: "cjc-1295-ipamorelin", label: "5mg / 5mg", sku: "RV-GHP-CJC-5/5-SC", retail: 85.49 },
  { slug: "follistatin-344", label: "1mg", sku: "RV-GHP-FOL-1-SC", retail: 234.99 },
  { slug: "ghrp-2", label: "5mg", sku: "RV-GHP-GH2-5-SC", retail: 38.49 },
  { slug: "ghrp-2", label: "10mg", sku: "RV-GHP-GH2-10-SC", retail: 59.49 },
  { slug: "ghrp-6", label: "5mg", sku: "RV-GHP-GH6-5-SC", retail: 39.99 },
  { slug: "ghrp-6", label: "10mg", sku: "RV-GHP-GH6-10-SC", retail: 61.99 },
  { slug: "hgh-fragment-176-191", label: "5mg", sku: "RV-GHP-HGH-5-SC", retail: 112.49 },
  { slug: "hexarellin-acetate", label: "5mg", sku: "RV-GHP-HEX-5-SC", retail: 70.99 },
  { slug: "igf-1-lr3", label: "0.1mg", sku: "RV-GHP-IGF-0.1-SC", retail: 68.99 },
  { slug: "igf-1-lr3", label: "1mg", sku: "RV-GHP-IGF-1-SC", retail: 164.99 },
  { slug: "ipamorelin", label: "5mg", sku: "RV-GHP-IPA-5-SC", retail: 43.49 },
  { slug: "ipamorelin-10mg", label: "10mg", sku: "RV-GHP-IPA-10-SC", retail: 72.49 },
  { slug: "mgf", label: "2mg", sku: "RV-GHP-MGF-2-SC", retail: 73.99 },
  { slug: "sermorelin", label: "5mg", sku: "RV-GHP-SER-5-SC", retail: 58.49 },
  { slug: "sermorelin-10mg", label: "10mg", sku: "RV-GHP-SER-10-SC", retail: 94.49 },
  { slug: "tesamorelin", label: "5mg", sku: "RV-GHP-TES-5-SC", retail: 86.99 },
  { slug: "tesamorelin-10mg", label: "10mg", sku: "RV-GHP-TES-10-SC", retail: 160.49 },

  // ── HEALING, RECOVERY & IMMUNE ──
  { slug: "ara-290", label: "10mg", sku: "RV-HRI-ARA-10-SC", retail: 70.49 },
  { slug: "bpc-157", label: "5mg", sku: "RV-HRI-BPC-5-SC", retail: 49.99 },
  { slug: "bpc-157", label: "10mg", sku: "RV-HRI-BPC-10-SC", retail: 81.99 },
  { slug: "bpc-157-tb-500", label: "5mg / 5mg", sku: "RV-HRI-BPCTB-10-SC", retail: 105.99 },
  { slug: "bpc-157-tb-500", label: "10mg / 10mg", sku: "RV-HRI-BPCTB-20-SC", retail: 176.99 },
  { slug: "ghk-cu", label: "100mg", sku: "RV-HRI-GHK-100-SC", retail: 73.99 },
  { slug: "kpv", label: "5mg", sku: "RV-HRI-KPV-5-SC", retail: 37.49 },
  { slug: "kpv", label: "10mg", sku: "RV-HRI-KPV-10-SC", retail: 60.99 },
  { slug: "ll-37", label: "5mg", sku: "RV-HRI-LL3-5-SC", retail: 92.99 },
  { slug: "oxytocin-acetate", label: "2mg", sku: "RV-HRI-OXY-2-SC", retail: 43.99 },
  { slug: "tb-500", label: "5mg", sku: "RV-HRI-TB5-5-SC", retail: 167.99 },
  { slug: "tb-500", label: "10mg", sku: "RV-HRI-TB5-10-SC", retail: 141.49 },
  { slug: "thymalin", label: "10mg", sku: "RV-HRI-THY-10-SC", retail: 65.99 },
  { slug: "thymosin-alpha-1", label: "5mg", sku: "RV-HRI-TA1-5-SC", retail: 80.99 },
  { slug: "thymosin-alpha-1", label: "10mg", sku: "RV-HRI-TA1-10-SC", retail: 143.49 },
  { slug: "vip", label: "5mg", sku: "RV-HRI-VIP-5-SC", retail: 74.49 },
  { slug: "vip", label: "10mg", sku: "RV-HRI-VIP-10-SC", retail: 135.49 },

  // ── COGNITIVE & LONGEVITY ──
  { slug: "cerebrolysin", label: "60mg (liquid)", sku: "RV-CL-CER-60-LIQ", retail: 48.99 },
  { slug: "dihexa", label: "5mg", sku: "RV-CL-DIH-5-SC", retail: 89.49 },
  { slug: "dihexa", label: "10mg", sku: "RV-CL-DIH-10-SC", retail: 129.99 },
  { slug: "epitalon", label: "10mg", sku: "RV-CL-EPI-10-SC", retail: 50.49 },
  { slug: "epitalon-50mg", label: "50mg", sku: "RV-CL-EPI-50-SC", retail: 169.49 },
  { slug: "fox-04", label: "10mg", sku: "RV-CL-FOX-10-SC", retail: 330.99 },
  { slug: "humanin", label: "5mg", sku: "RV-CL-HUM-5-SC", retail: 75.49 },
  { slug: "humanin-10mg", label: "10mg", sku: "RV-CL-HUM-10-SC", retail: 136.99 },
  { slug: "nad-plus", label: "100mg", sku: "RV-CL-NAD-100-SC", retail: 46.49 },
  { slug: "nad-plus", label: "500mg", sku: "RV-CL-NAD-500-SC", retail: 164.49 },
  { slug: "pinealon", label: "10mg", sku: "RV-CL-PIN-10-SC", retail: 70.49 },
  { slug: "pinealon", label: "20mg", sku: "RV-CL-PIN-20-SC", retail: 105.49 },
  { slug: "slu-pp-332", label: "5mg", sku: "RV-CL-SLU-5-SC", retail: 113.49 },
  { slug: "ss-31", label: "10mg", sku: "RV-CL-SS3-10-SC", retail: 90.49 },
  { slug: "selank", label: "5mg", sku: "RV-CL-SEL-5-SC", retail: 33.99 },
  { slug: "selank", label: "10mg", sku: "RV-CL-SEL-10-SC", retail: 54.49 },
  { slug: "semax", label: "5mg", sku: "RV-CL-SEM-5-SC", retail: 32.99 },
  { slug: "semax", label: "10mg", sku: "RV-CL-SEM-10-SC", retail: 50.99 },

  // ── SEXUAL HEALTH & SPECIALTY ──
  { slug: "dsip", label: "5mg", sku: "RV-SHS-DSI-5-SC", retail: 50.49 },
  { slug: "dsip", label: "15mg", sku: "RV-SHS-DSI-15-SC", retail: 111.49 },
  { slug: "kisspeptin", label: "5mg", sku: "RV-SHS-KIS-5-SC", retail: 63.49 },
  { slug: "kisspeptin", label: "10mg", sku: "RV-SHS-KIS-10-SC", retail: 101.99 },
  { slug: "melanotan-1", label: "10mg", sku: "RV-SHS-MT1-10-SC", retail: 52.49 },
  { slug: "melanotan-2", label: "10mg", sku: "RV-SHS-MT2-10-SC", retail: 45.49 },
  { slug: "pt-141", label: "10mg", sku: "RV-SHS-PT1-10-SC", retail: 61.49 },

  // ── TOPICALS & SERUMS ──
  { slug: "snap-8", label: "10mg", sku: "RV-TS-SNA-10-SC", retail: 35.99 },
  { slug: "snap-8-ghk-cu-serum", label: "30ml", sku: "RV-TS-SNA-30-SER", retail: 66.99 },
  { slug: "privive-transdermal", label: "30ml", sku: "RV-TS-PRI-30-SER", retail: 113.99 },

  // ── SPECIALTY BLENDS & LIQUIDS ──
  { slug: "glow", label: "50/10/10mg", sku: "RV-SBL-GLO-70-SC", retail: 238.49 },
  { slug: "glutathione", label: "1,500mg", sku: "RV-SBL-GLU-1500-SC", retail: 68.99 },
  { slug: "klow", label: "50/10/10/10mg", sku: "RV-SBL-KLO-80-SC", retail: 247.99 },
  { slug: "l-carnitine", label: "600mg (liquid)", sku: "RV-SBL-LCA-600-LIQ", retail: 80.99 },
  { slug: "lc120", label: "10ml", sku: "RV-SBL-LC1-10-LIQ", retail: 69.49 },
  { slug: "lc216", label: "10ml", sku: "RV-SBL-LC2-10-LIQ", retail: 71.99 },
  { slug: "super-human-blend", label: "10ml", sku: "RV-SBL-SUP-10-LIQ", retail: 97.49 },

  // ── SUPPLIES ──
  { slug: "acetic-acid-water", label: "10ml", sku: "RV-H2O-AES-10-LIQ", retail: 10.90 },
  { slug: "bac-water", label: "10ml", sku: "RV-H2O-BAC-10-LIQ", retail: 11.00 },
  { slug: "syringes", label: "10 Pack (31G 100U)", sku: "RV-MIS-SYR10-1-MIS", retail: 11.00 },
];

async function main() {
  console.log("💰 Updating retail pricing from Next Pass Summary...\n");

  let updated = 0;
  let created = 0;
  let notFound = 0;

  for (const entry of PRICES) {
    const product = await prisma.product.findUnique({
      where: { slug: entry.slug },
      include: { variants: true },
    });

    if (!product) {
      console.log(`⚠️  Product not found: ${entry.slug}`);
      notFound++;
      continue;
    }

    const retailCents = Math.round(entry.retail * 100);
    const foundersCents = Math.round(retailCents * 0.80);
    const friendsCents = Math.round(retailCents * 0.60);

    // Find variant by SKU or label match
    const variant = product.variants.find(
      (v) => v.sku === entry.sku || v.label === entry.label
    );

    if (variant) {
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: {
          label: entry.label,
          sku: entry.sku,
          price: retailCents,
          retailPrice: retailCents,
          foundersPrice: foundersCents,
          friendsPrice: friendsCents,
        },
      });
      updated++;
    } else {
      // Create missing variant
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          label: entry.label,
          sku: entry.sku,
          price: retailCents,
          retailPrice: retailCents,
          foundersPrice: foundersCents,
          friendsPrice: friendsCents,
          quantity: 0,
          reorderThreshold: 0,
          inStock: false,
        },
      });
      console.log(`  + Created variant: ${product.name} ${entry.label}`);
      created++;
    }
  }

  // ── Fix sample pack sizes ──
  // REbalance sample: was 10 capsules, now 20
  const rebSample = await prisma.product.findUnique({ where: { slug: "rebalance-sample-pack" } });
  if (rebSample) {
    await prisma.product.update({
      where: { id: rebSample.id },
      data: { description: "Trial-size REbalance capsule pack (20 qty) — Glutathione, Anserine, and Cerluten+ for cognitive and longevity support." },
    });
  }

  // REcover sample: was 5 capsules, now 10
  const recSample = await prisma.product.findUnique({ where: { slug: "recover-sample-pack" } });
  if (recSample) {
    await prisma.product.update({
      where: { id: recSample.id },
      data: { description: "Trial-size REcover capsule pack (10 qty) — BPC-157, GHK-Cu, and Carnosine for recovery and tissue repair." },
    });
  }

  // REvive sample: was 5 capsules, now 10
  const revSample = await prisma.product.findUnique({ where: { slug: "revive-sample-pack" } });
  if (revSample) {
    await prisma.product.update({
      where: { id: revSample.id },
      data: { description: "Trial-size REvive capsule pack (10 qty) — NAD+, SLU-PP-332, and 5-Amino-1MQ for energy and metabolic support." },
    });
  }

  // ── Update syringe product ──
  const syringes = await prisma.product.findUnique({ where: { slug: "syringes" } });
  if (syringes) {
    await prisma.product.update({
      where: { id: syringes.id },
      data: { description: "31G 100U insulin syringes for subcutaneous administration. 10-pack." },
    });
  }

  console.log(`\n✅ Done: ${updated} variants updated, ${created} created, ${notFound} products not found`);

  // Sample verification
  console.log("\n📊 Sample prices:");
  for (const slug of ["tirzepatide", "bpc-157", "ghk-cu", "bac-water", "glow"]) {
    const p = await prisma.product.findUnique({ where: { slug }, include: { variants: true } });
    if (p) {
      for (const v of p.variants) {
        console.log(`  ${p.name} ${v.label}: $${(v.price / 100).toFixed(2)} retail, $${((v.foundersPrice ?? 0) / 100).toFixed(2)} founders, $${((v.friendsPrice ?? 0) / 100).toFixed(2)} F&F`);
      }
    }
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
