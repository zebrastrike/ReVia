import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// All prices in CENTS (dollars × 100)
// Pricing sheet (27-Mar-26) is authoritative for 3-tier prices
// SKU sheet (22-Mar-26) is authoritative for SKU codes

async function main() {
  console.log("🌱 ReVia seed-v2: clearing old catalog...");

  // Clear old product catalog only — preserve users, orders, blog posts
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("✅ Old catalog cleared");

  // ─── CATEGORIES ────────────────────────────────────────────────────────────

  const categories = await prisma.category.createManyAndReturn({
    data: [
      { name: "Oral Capsules & Supplements", slug: "oral-capsules-supplements", description: "Oral capsule formulations for cognitive, recovery, and metabolic support." },
      { name: "Metabolic & Weight Management", slug: "metabolic-weight-management", description: "Peptides and compounds targeting metabolic function and body composition." },
      { name: "Growth Hormone & Performance", slug: "growth-hormone-performance", description: "Growth hormone secretagogues and performance peptides." },
      { name: "Health, Recovery & Immune", slug: "health-recovery-immune", description: "Peptides supporting tissue repair, recovery, and immune modulation." },
      { name: "Cognitive & Longevity", slug: "cognitive-longevity", description: "Nootropic and longevity peptides for cognitive and cellular health." },
      { name: "Sexual Health & Sleep", slug: "sexual-health-sleep", description: "Peptides supporting sexual health, sleep quality, and hormone signaling." },
      { name: "Topicals & Serums", slug: "topicals-serums", description: "Transdermal and topical peptide formulations." },
      { name: "Stacks, Blends & Liquids", slug: "stacks-blends-liquids", description: "Pre-formulated peptide blends, stacks, and liquid compounds." },
      { name: "Water & Supplies", slug: "water-supplies", description: "Reconstitution supplies including BAC water and acetic acid." },
      { name: "Miscellaneous", slug: "miscellaneous", description: "Syringes and ancillary supplies." },
    ],
  });

  const cat = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  console.log(`✅ ${categories.length} categories created`);

  // ─── HELPER ────────────────────────────────────────────────────────────────

  async function createProduct({
    name,
    slug,
    description,
    categorySlug,
    image,
    featured,
    active,
    tags,
    variants,
  }: {
    name: string;
    slug: string;
    description?: string;
    categorySlug: string;
    image?: string;
    featured?: boolean;
    active?: boolean;
    tags?: string[];
    variants: {
      label: string;
      sku: string;
      retailPrice: number;
      foundersPrice?: number;
      friendsPrice?: number;
      quantity?: number;
      reorderThreshold?: number;
      inStock?: boolean;
    }[];
  }) {
    const categoryId = cat[categorySlug];
    if (!categoryId) throw new Error(`Category not found: ${categorySlug}`);

    return prisma.product.create({
      data: {
        name,
        slug,
        description: description ?? null,
        categoryId,
        image: image ?? null,
        featured: featured ?? false,
        active: active ?? true,
        tags: JSON.stringify(tags ?? []),
        variants: {
          create: variants.map((v) => ({
            label: v.label,
            sku: v.sku,
            price: v.retailPrice,
            retailPrice: v.retailPrice,
            foundersPrice: v.foundersPrice ?? null,
            friendsPrice: v.friendsPrice ?? null,
            quantity: v.quantity ?? 0,
            reorderThreshold: v.reorderThreshold ?? 0,
            inStock: v.quantity ? v.quantity > 0 : false,
          })),
        },
      },
    });
  }

  // ─── INITIAL INVENTORY (active: true) ─────────────────────────────────────
  console.log("🌿 Seeding initial inventory...");

  // ORAL CAPSULES & SUPPLEMENTS
  await createProduct({
    name: "REbalance",
    slug: "rebalance",
    description: "Cognitive and longevity oral capsule blend — Glutathione, Anserine, Cerluten+",
    categorySlug: "oral-capsules-supplements",
    active: true,
    tags: ["oral", "cognitive", "longevity"],
    variants: [
      { label: "120 Capsules", sku: "RV-OCS-REB-120-ORA", retailPrice: 12999, foundersPrice: 10499, friendsPrice: 9199, quantity: 0, reorderThreshold: 30 },
    ],
  });

  await createProduct({
    name: "REcover",
    slug: "recover",
    description: "Recovery and repair oral capsule blend — BPC-157, GHK-Cu, Carnosine",
    categorySlug: "oral-capsules-supplements",
    active: true,
    tags: ["oral", "recovery"],
    variants: [
      { label: "60 Capsules", sku: "RV-OCS-REC-60-ORA", retailPrice: 10999, foundersPrice: 8999, friendsPrice: 7199, quantity: 0, reorderThreshold: 20 },
    ],
  });

  await createProduct({
    name: "REvive",
    slug: "revive",
    description: "Energy and metabolic support oral capsule blend — NAD+, SLU-PP-332, 5-Amino-1MQ",
    categorySlug: "oral-capsules-supplements",
    active: true,
    tags: ["oral", "energy", "metabolic"],
    variants: [
      { label: "60 Capsules", sku: "RV-OCS-REV-60-ORA", retailPrice: 11999, foundersPrice: 9499, friendsPrice: 8499, quantity: 0, reorderThreshold: 20 },
    ],
  });

  // METABOLIC & WEIGHT MANAGEMENT
  await createProduct({
    name: "Cagrilintide",
    slug: "cagrilintide",
    description: "Long-acting amylin analogue studied for appetite regulation and metabolic support.",
    categorySlug: "metabolic-weight-management",
    active: true,
    featured: true,
    tags: ["weight-management", "bestseller"],
    variants: [
      { label: "5mg", sku: "RV-MWM-CAG-5-SC",  retailPrice: 8999,  foundersPrice: 6999, friendsPrice: 4499, quantity: 35, reorderThreshold: 18 },
      { label: "10mg", sku: "RV-MWM-CAG-10-SC", retailPrice: 12499, foundersPrice: 8999, friendsPrice: 7499, quantity: 0,  reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "Retatrutide",
    slug: "retatrutide",
    description: "Triple agonist (GLP-1, GIP, glucagon) investigated for weight management and metabolic health.",
    categorySlug: "metabolic-weight-management",
    active: true,
    featured: true,
    tags: ["weight-management", "bestseller"],
    variants: [
      { label: "5mg",  sku: "RV-MWM-RET-5-SC",  retailPrice: 7499,  foundersPrice: 4999, friendsPrice: 3999, quantity: 0,  reorderThreshold: 0 },
      { label: "10mg", sku: "RV-MWM-RET-10-SC", retailPrice: 11999, foundersPrice: 8999, friendsPrice: 6999, quantity: 20, reorderThreshold: 10 },
      { label: "30mg", sku: "RV-MWM-RET-30-SC", retailPrice: 22999, foundersPrice: 14999, friendsPrice: 11999, quantity: 0, reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "Survodutide",
    slug: "survodutide",
    description: "Dual GLP-1/glucagon receptor agonist studied for obesity and non-alcoholic fatty liver disease.",
    categorySlug: "metabolic-weight-management",
    active: true,
    tags: ["weight-management"],
    variants: [
      { label: "10mg", sku: "RV-MWM-SUR-10-SC", retailPrice: 15999, foundersPrice: 12999, friendsPrice: 11999, quantity: 0, reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "Tirzepatide",
    slug: "tirzepatide",
    description: "Dual GLP-1/GIP receptor agonist — one of the most-studied peptides for metabolic and weight management research.",
    categorySlug: "metabolic-weight-management",
    active: true,
    featured: true,
    tags: ["weight-management", "bestseller"],
    variants: [
      { label: "5mg",  sku: "RV-MWM-TIR-5-SC",  retailPrice: 6999,  foundersPrice: 4499, friendsPrice: 3999, quantity: 0,   reorderThreshold: 0 },
      { label: "10mg", sku: "RV-MWM-TIR-10-SC", retailPrice: 11999, foundersPrice: 8999, friendsPrice: 6999, quantity: 150, reorderThreshold: 75 },
      { label: "15mg", sku: "RV-MWM-TIR-15-SC", retailPrice: 15999, foundersPrice: 10999, friendsPrice: 9999, quantity: 0,  reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "MOTS-c",
    slug: "mots-c",
    description: "Mitochondria-derived peptide studied for metabolic regulation, insulin sensitivity, and longevity.",
    categorySlug: "metabolic-weight-management",
    active: true,
    tags: ["metabolic", "longevity", "mitochondrial"],
    variants: [
      { label: "10mg", sku: "RV-MWM-MOT-10-SC", retailPrice: 8999, foundersPrice: 6999, friendsPrice: 5499, quantity: 15, reorderThreshold: 5 },
    ],
  });

  // GROWTH HORMONE & PERFORMANCE
  await createProduct({
    name: "CJC-1295 (no DAC)",
    slug: "cjc-1295-no-dac",
    description: "Growth hormone releasing hormone analogue studied for GH secretion and body composition.",
    categorySlug: "growth-hormone-performance",
    active: true,
    tags: ["growth-hormone", "performance"],
    variants: [
      { label: "5mg",  sku: "RV-GHP-CJC-5-SC",  retailPrice: 4999, foundersPrice: 3499, friendsPrice: 2999, quantity: 20, reorderThreshold: 6 },
      { label: "10mg", sku: "RV-GHP-CJC-10-SC", retailPrice: 8999, foundersPrice: 6999, friendsPrice: 5999, quantity: 0,  reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "CJC-1295 + Ipamorelin",
    slug: "cjc-1295-ipamorelin",
    description: "Synergistic GH secretagogue blend — GHRH analogue paired with selective GHRP.",
    categorySlug: "growth-hormone-performance",
    active: true,
    tags: ["growth-hormone", "performance", "blend"],
    variants: [
      { label: "5mg / 5mg", sku: "RV-GHP-CJC-5/5-SC", retailPrice: 7499, foundersPrice: 5999, friendsPrice: 4499, quantity: 0, reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "Ipamorelin",
    slug: "ipamorelin",
    description: "Selective growth hormone secretagogue studied for pulsatile GH release with minimal side effects.",
    categorySlug: "growth-hormone-performance",
    active: true,
    tags: ["growth-hormone", "performance"],
    variants: [
      { label: "5mg", sku: "RV-GHP-IPA-5-SC", retailPrice: 4299, foundersPrice: 3499, friendsPrice: 2799, quantity: 20, reorderThreshold: 6 },
    ],
  });

  await createProduct({
    name: "Sermorelin",
    slug: "sermorelin",
    description: "Synthetic GHRH analogue studied for GH stimulation and age-related decline.",
    categorySlug: "growth-hormone-performance",
    active: true,
    tags: ["growth-hormone"],
    variants: [
      { label: "5mg", sku: "RV-GHP-SER-5-SC", retailPrice: 4999, foundersPrice: 3999, friendsPrice: 2999, quantity: 0, reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "Tesamorelin",
    slug: "tesamorelin",
    description: "GHRH analogue studied for visceral fat reduction and GH axis modulation.",
    categorySlug: "growth-hormone-performance",
    active: true,
    tags: ["growth-hormone", "visceral-fat"],
    variants: [
      { label: "5mg", sku: "RV-GHP-TES-5-SC", retailPrice: 6999, foundersPrice: 4999, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 },
    ],
  });

  // HEALTH, RECOVERY & IMMUNE
  await createProduct({
    name: "BPC-157 / TB-500",
    slug: "bpc-157-tb-500",
    description: "Blended recovery stack — BPC-157 for gut and tissue repair combined with TB-500 for systemic healing.",
    categorySlug: "health-recovery-immune",
    active: true,
    featured: true,
    tags: ["recovery", "bestseller", "blend"],
    variants: [
      { label: "5mg / 5mg",   sku: "RV-HRI-BPCTB-10-SC", retailPrice: 8999,  foundersPrice: 5999, friendsPrice: 4499, quantity: 40, reorderThreshold: 12 },
      { label: "10mg / 10mg", sku: "RV-HRI-BPCTB-20-SC", retailPrice: 12999, foundersPrice: 9999, friendsPrice: 7999, quantity: 0,  reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "GHK-Cu",
    slug: "ghk-cu",
    description: "Copper peptide complex studied for tissue repair, anti-inflammatory activity, and skin regeneration.",
    categorySlug: "health-recovery-immune",
    active: true,
    featured: true,
    tags: ["recovery", "aesthetics", "bestseller"],
    variants: [
      { label: "100mg", sku: "RV-HRI-GHK-100-SC", retailPrice: 7999, foundersPrice: 5999, friendsPrice: 4999, quantity: 50, reorderThreshold: 15 },
    ],
  });

  // COGNITIVE & LONGEVITY
  await createProduct({
    name: "Epitalon",
    slug: "epitalon",
    description: "Tetrapeptide studied for telomere elongation and longevity research.",
    categorySlug: "cognitive-longevity",
    active: true,
    tags: ["longevity", "anti-aging"],
    variants: [
      { label: "10mg", sku: "RV-CL-EPI-10-SC", retailPrice: 4999, foundersPrice: 3999, friendsPrice: 2999, quantity: 0, reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "Humanin",
    slug: "humanin",
    description: "Mitochondria-derived peptide studied for neuroprotection and metabolic health.",
    categorySlug: "cognitive-longevity",
    active: true,
    tags: ["longevity", "neuroprotective"],
    variants: [
      { label: "5mg", sku: "RV-CL-HUM-5-SC", retailPrice: 6999, foundersPrice: 5999, friendsPrice: 4999, quantity: 0, reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "SS-31",
    slug: "ss-31",
    description: "Mitochondria-targeted antioxidant peptide studied for cellular energy and longevity.",
    categorySlug: "cognitive-longevity",
    active: true,
    tags: ["longevity", "mitochondrial", "antioxidant"],
    variants: [
      { label: "50mg", sku: "RV-CL-SS3-10-SC", retailPrice: 6999, foundersPrice: 5999, friendsPrice: 4999, quantity: 0, reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "SLU-PP-332",
    slug: "slu-pp-332",
    description: "ERR agonist studied for mitochondrial biogenesis and metabolic endurance.",
    categorySlug: "cognitive-longevity",
    active: true,
    tags: ["metabolic", "mitochondrial", "energy"],
    variants: [
      { label: "5mg", sku: "RV-CL-SLU-5-SC", retailPrice: 9999, foundersPrice: 8499, friendsPrice: 6999, quantity: 0, reorderThreshold: 0 },
    ],
  });

  // STACKS, BLENDS & LIQUIDS — Initial inventory
  await createProduct({
    name: "GLOW",
    slug: "glow",
    description: "Aesthetics and skin health blend — GHK-Cu, SNAP-8, and supporting peptides in lyophilized form.",
    categorySlug: "stacks-blends-liquids",
    active: true,
    tags: ["aesthetics", "blend", "skin"],
    variants: [
      { label: "50/10/10mg", sku: "RV-SBL-GLO-70-SC", retailPrice: 20999, foundersPrice: 14999, friendsPrice: 8999, quantity: 15, reorderThreshold: 5 },
    ],
  });

  await createProduct({
    name: "KLOW",
    slug: "klow",
    description: "Advanced aesthetics blend with Kisspeptin added for hormonal support alongside skin-targeting peptides.",
    categorySlug: "stacks-blends-liquids",
    active: true,
    tags: ["aesthetics", "blend", "skin"],
    variants: [
      { label: "50/10/10/10mg", sku: "RV-SBL-KLO-80-SC", retailPrice: 22999, foundersPrice: 15999, friendsPrice: 9999, quantity: 0, reorderThreshold: 0 },
    ],
  });

  // WATER & SUPPLIES
  await createProduct({
    name: "BAC Water",
    slug: "bac-water",
    description: "Bacteriostatic water for peptide reconstitution. 10ml vial.",
    categorySlug: "water-supplies",
    active: true,
    tags: ["supplies"],
    variants: [
      { label: "10ml", sku: "RV-H2O-BAC-10-LIQ", retailPrice: 1199, foundersPrice: 999, friendsPrice: 599, quantity: 50, reorderThreshold: 15 },
    ],
  });

  await createProduct({
    name: "Acetic Acid Water",
    slug: "acetic-acid-water",
    description: "0.6% acetic acid solution for peptide reconstitution. 10ml vial.",
    categorySlug: "water-supplies",
    active: true,
    tags: ["supplies"],
    variants: [
      { label: "10ml", sku: "RV-H2O-AES-10-LIQ", retailPrice: 1199, foundersPrice: 999, friendsPrice: 599, quantity: 0, reorderThreshold: 0 },
    ],
  });

  // MISCELLANEOUS
  await createProduct({
    name: "Syringes",
    slug: "syringes",
    description: "1cc insulin syringes for subcutaneous administration.",
    categorySlug: "miscellaneous",
    active: true,
    tags: ["supplies"],
    variants: [
      { label: "20 Pack", sku: "RV-MIS-SYR20-1-MIS", retailPrice: 1199, foundersPrice: 999, friendsPrice: 599, quantity: 0, reorderThreshold: 0 },
    ],
  });

  // ─── 4 HERO STACKS (active: true, qty: 0 until Lance confirms ship) ────────
  console.log("🚀 Seeding 4 hero stacks...");

  await createProduct({
    name: "ReVia LEAN",
    slug: "revia-lean",
    description: "Precision weight management blend — Tirzepatide 10mg + Cagrilintide 5mg in a single blended vial. Dual-action GLP-1/GIP agonism combined with amylin analogue signaling for comprehensive metabolic support.",
    categorySlug: "stacks-blends-liquids",
    active: true,
    featured: true,
    tags: ["hero-stack", "weight-management", "blend", "featured"],
    variants: [
      { label: "15mg Blended Vial", sku: "RV-SBL-LEA-15-SC", retailPrice: 22500, foundersPrice: null as unknown as number, friendsPrice: null as unknown as number, quantity: 0, reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "ReVia LEAN PRO+",
    slug: "revia-lean-pro-plus",
    description: "Advanced weight management triple-blend — Tirzepatide 10mg + Cagrilintide 5mg + Ipamorelin 10mg. Adds GH secretagogue signaling for enhanced body composition research.",
    categorySlug: "stacks-blends-liquids",
    active: true,
    featured: true,
    tags: ["hero-stack", "weight-management", "blend", "featured"],
    variants: [
      { label: "25mg Blended Vial", sku: "RV-SBL-LPP-25-SC", retailPrice: 26500, foundersPrice: null as unknown as number, friendsPrice: null as unknown as number, quantity: 0, reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "ReVia RENEW",
    slug: "revia-renew",
    description: "Full-spectrum recovery blend — BPC-157 10mg + TB-500 10mg + GHK-Cu 100mg. Systemic tissue repair, anti-inflammatory action, and regenerative peptide signaling in one vial.",
    categorySlug: "stacks-blends-liquids",
    active: true,
    featured: true,
    tags: ["hero-stack", "recovery", "blend", "featured"],
    variants: [
      { label: "220mg Blended Vial", sku: "RV-SBL-REN-220-SC", retailPrice: 18000, foundersPrice: null as unknown as number, friendsPrice: null as unknown as number, quantity: 0, reorderThreshold: 0 },
    ],
  });

  await createProduct({
    name: "ReVia SCULPT & GLOW",
    slug: "revia-sculpt-glow",
    description: "Ultimate body composition and aesthetics blend — Ipamorelin 10mg + Tirzepatide 10mg + Cagrilintide 5mg + BPC-157 10mg + TB-500 10mg + GHK-Cu 100mg. Six-peptide formula combining metabolic, recovery, and skin-health signaling.",
    categorySlug: "stacks-blends-liquids",
    active: true,
    featured: true,
    tags: ["hero-stack", "weight-management", "recovery", "aesthetics", "blend", "featured"],
    variants: [
      { label: "145mg Blended Vial", sku: "RV-SBL-SGL-145-SC", retailPrice: 35000, foundersPrice: null as unknown as number, friendsPrice: null as unknown as number, quantity: 0, reorderThreshold: 0 },
    ],
  });

  // ─── FUTURE INVENTORY (active: false — hidden until toggled) ───────────────
  console.log("💤 Seeding future inventory (inactive)...");

  // ORAL SAMPLE PACKS
  await createProduct({ name: "REbalance Sample Pack", slug: "rebalance-sample-pack", categorySlug: "oral-capsules-supplements", active: false, tags: ["oral", "sample"], variants: [{ label: "10 Capsules", sku: "RV-OCS-REB-10-ORA", retailPrice: 1299, foundersPrice: 999, friendsPrice: 899, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "REcover Sample Pack",   slug: "recover-sample-pack",   categorySlug: "oral-capsules-supplements", active: false, tags: ["oral", "sample"], variants: [{ label: "5 Capsules",  sku: "RV-OCS-REC-5-ORA",  retailPrice: 1299, foundersPrice: 999, friendsPrice: 899, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "REvive Sample Pack",    slug: "revive-sample-pack",    categorySlug: "oral-capsules-supplements", active: false, tags: ["oral", "sample"], variants: [{ label: "5 Capsules",  sku: "RV-OCS-REV-5-ORA",  retailPrice: 1299, foundersPrice: 999, friendsPrice: 899, quantity: 0, reorderThreshold: 0 }] });

  // WEIGHT MANAGEMENT — future
  await createProduct({ name: "5-Amino-1MQ",   slug: "5-amino-1mq",   categorySlug: "metabolic-weight-management", active: false, tags: ["metabolic", "weight-management"], variants: [{ label: "5mg",  sku: "RV-MWM-5AM-5-SC",   retailPrice: 5999,  foundersPrice: 4799, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-MWM-5AM-10-SC",  retailPrice: 8999,  foundersPrice: 7499, friendsPrice: 6499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "AOD-9604",      slug: "aod-9604",      categorySlug: "metabolic-weight-management", active: false, tags: ["metabolic", "weight-management"], variants: [{ label: "5mg",  sku: "RV-MWM-AOD-5-SC",   retailPrice: 5999,  foundersPrice: 4999, friendsPrice: 4499, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-MWM-AOD-10-SC",  retailPrice: 8999,  foundersPrice: 7499, friendsPrice: 6999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Adipotide",     slug: "adipotide",     categorySlug: "metabolic-weight-management", active: false, tags: ["metabolic", "weight-management"], variants: [{ label: "5mg",  sku: "RV-MWM-ADI-5-SC",   retailPrice: 9999,  foundersPrice: 8499, friendsPrice: 7999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "MOTS-c 40mg",   slug: "mots-c-40mg",   categorySlug: "metabolic-weight-management", active: false, tags: ["metabolic", "longevity", "mitochondrial"], variants: [{ label: "40mg", sku: "RV-MWM-MOT-40-SC",  retailPrice: 29999, foundersPrice: 19999, friendsPrice: 12999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Mazdutide",     slug: "mazdutide",     categorySlug: "metabolic-weight-management", active: false, tags: ["weight-management"], variants: [{ label: "10mg", sku: "RV-MWM-MAZ-10-SC",  retailPrice: 18999, foundersPrice: 13999, friendsPrice: 12999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Retatrutide 60mg", slug: "retatrutide-60mg", categorySlug: "metabolic-weight-management", active: false, tags: ["weight-management"], variants: [{ label: "60mg", sku: "RV-MWM-RET-60-SC", retailPrice: 39999, foundersPrice: 29999, friendsPrice: 22999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Semaglutide",   slug: "semaglutide",   categorySlug: "metabolic-weight-management", active: false, tags: ["weight-management"], variants: [{ label: "5mg",  sku: "RV-MWM-SEM-5-SC",   retailPrice: 9999,  foundersPrice: 6499, friendsPrice: 4999, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-MWM-SEM-10-SC",  retailPrice: 16999, foundersPrice: 10999, friendsPrice: 8999, quantity: 0, reorderThreshold: 0 }, { label: "30mg", sku: "RV-MWM-SEM-30-SC",  retailPrice: 39999, foundersPrice: 27999, friendsPrice: 19999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Tirzepatide 30mg", slug: "tirzepatide-30mg", categorySlug: "metabolic-weight-management", active: false, tags: ["weight-management"], variants: [{ label: "30mg", sku: "RV-MWM-TIR-30-SC", retailPrice: 22999, foundersPrice: 18899, friendsPrice: 14999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Tirzepatide 60mg", slug: "tirzepatide-60mg", categorySlug: "metabolic-weight-management", active: false, tags: ["weight-management"], variants: [{ label: "60mg", sku: "RV-MWM-TIR-60-SC", retailPrice: 39999, foundersPrice: 24999, friendsPrice: 19999, quantity: 0, reorderThreshold: 0 }] });

  // GROWTH HORMONE — future
  await createProduct({ name: "AICAR",                 slug: "aicar",                  categorySlug: "growth-hormone-performance", active: false, tags: ["performance", "metabolic"], variants: [{ label: "5mg",   sku: "RV-GHP-AIC-5-SC",      retailPrice: 6299,  foundersPrice: 4999, friendsPrice: 4499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "CJC-1295 with DAC",     slug: "cjc-1295-with-dac",      categorySlug: "growth-hormone-performance", active: false, tags: ["growth-hormone"], variants: [{ label: "5mg",   sku: "RV-GHP-CJCNOD-5-SC",   retailPrice: 9999,  foundersPrice: 7499, friendsPrice: 6999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Follistatin-344",        slug: "follistatin-344",         categorySlug: "growth-hormone-performance", active: false, tags: ["growth-hormone", "performance"], variants: [{ label: "1mg",   sku: "RV-GHP-FOL-1-SC",      retailPrice: 19999, foundersPrice: 14999, friendsPrice: 12999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "GHRP-2",                slug: "ghrp-2",                  categorySlug: "growth-hormone-performance", active: false, tags: ["growth-hormone"], variants: [{ label: "5mg",   sku: "RV-GHP-GH2-5-SC",      retailPrice: 3499,  foundersPrice: 2999, friendsPrice: 2499, quantity: 0, reorderThreshold: 0 }, { label: "10mg",  sku: "RV-GHP-GH2-10-SC",     retailPrice: 5999,  foundersPrice: 4999, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "GHRP-6",                slug: "ghrp-6",                  categorySlug: "growth-hormone-performance", active: false, tags: ["growth-hormone"], variants: [{ label: "5mg",   sku: "RV-GHP-GH6-5-SC",      retailPrice: 3799,  foundersPrice: 3399, friendsPrice: 2499, quantity: 0, reorderThreshold: 0 }, { label: "10mg",  sku: "RV-GHP-GH6-10-SC",     retailPrice: 6499,  foundersPrice: 4999, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "HGH Fragment 176-191",  slug: "hgh-fragment-176-191",    categorySlug: "growth-hormone-performance", active: false, tags: ["growth-hormone", "weight-management"], variants: [{ label: "5mg",   sku: "RV-GHP-HGH-5-SC",      retailPrice: 9499,  foundersPrice: 7999, friendsPrice: 6999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Hexarellin Acetate",    slug: "hexarellin-acetate",      categorySlug: "growth-hormone-performance", active: false, tags: ["growth-hormone"], variants: [{ label: "5mg",   sku: "RV-GHP-HEX-5-SC",      retailPrice: 4999,  foundersPrice: 4499, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "IGF-1 LR3",            slug: "igf-1-lr3",               categorySlug: "growth-hormone-performance", active: false, tags: ["growth-hormone", "performance"], variants: [{ label: "0.1mg", sku: "RV-GHP-IGF-0.1-SC",    retailPrice: 3499,  foundersPrice: 2999, friendsPrice: 2499, quantity: 0, reorderThreshold: 0 }, { label: "1mg",   sku: "RV-GHP-IGF-1-SC",      retailPrice: 13999, foundersPrice: 10999, friendsPrice: 8999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Ipamorelin 10mg",      slug: "ipamorelin-10mg",         categorySlug: "growth-hormone-performance", active: false, tags: ["growth-hormone"], variants: [{ label: "10mg",  sku: "RV-GHP-IPA-10-SC",     retailPrice: 6999,  foundersPrice: 5999, friendsPrice: 4999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Sermorelin 10mg",      slug: "sermorelin-10mg",         categorySlug: "growth-hormone-performance", active: false, tags: ["growth-hormone"], variants: [{ label: "10mg",  sku: "RV-GHP-SER-10-SC",     retailPrice: 8499,  foundersPrice: 6999, friendsPrice: 5499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Tesamorelin 10mg",     slug: "tesamorelin-10mg",        categorySlug: "growth-hormone-performance", active: false, tags: ["growth-hormone", "visceral-fat"], variants: [{ label: "10mg",  sku: "RV-GHP-TES-10-SC",     retailPrice: 12999, foundersPrice: 10499, friendsPrice: 8499, quantity: 0, reorderThreshold: 0 }] });

  // RECOVERY — future
  await createProduct({ name: "ARA-290",              slug: "ara-290",                 categorySlug: "health-recovery-immune", active: false, tags: ["recovery", "neuroprotective"], variants: [{ label: "10mg", sku: "RV-HRI-ARA-10-SC",   retailPrice: 5999,  foundersPrice: 4999, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "BPC-157",              slug: "bpc-157",                 categorySlug: "health-recovery-immune", active: false, tags: ["recovery"], variants: [{ label: "5mg",  sku: "RV-HRI-BPC-5-SC",    retailPrice: 4999,  foundersPrice: 3999, friendsPrice: 2999, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-HRI-BPC-10-SC",   retailPrice: 8999,  foundersPrice: 5499, friendsPrice: 4499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "KPV",                  slug: "kpv",                     categorySlug: "health-recovery-immune", active: false, tags: ["recovery", "anti-inflammatory"], variants: [{ label: "5mg",  sku: "RV-HRI-KPV-5-SC",    retailPrice: 3499,  foundersPrice: 3999, friendsPrice: 2499, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-HRI-KPV-10-SC",   retailPrice: 5999,  foundersPrice: 4499, friendsPrice: 2999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "LL-37",                slug: "ll-37",                   categorySlug: "health-recovery-immune", active: false, tags: ["immune", "antimicrobial"], variants: [{ label: "5mg",  sku: "RV-HRI-LL3-5-SC",    retailPrice: 7999,  foundersPrice: 5999, friendsPrice: 4999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Oxytocin Acetate",     slug: "oxytocin-acetate",        categorySlug: "health-recovery-immune", active: false, tags: ["hormone", "recovery"], variants: [{ label: "2mg",  sku: "RV-HRI-OXY-2-SC",    retailPrice: 4999,  foundersPrice: 3499, friendsPrice: 2499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "TB-500",               slug: "tb-500",                  categorySlug: "health-recovery-immune", active: false, tags: ["recovery"], variants: [{ label: "5mg",  sku: "RV-HRI-TB5-5-SC",    retailPrice: 6999,  foundersPrice: 5999, friendsPrice: 4999, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-HRI-TB5-10-SC",   retailPrice: 13999, foundersPrice: 10999, friendsPrice: 8999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Thymalin",             slug: "thymalin",                categorySlug: "health-recovery-immune", active: false, tags: ["immune", "longevity"], variants: [{ label: "10mg", sku: "RV-HRI-THY-10-SC",   retailPrice: 5599,  foundersPrice: 4499, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Thymosin Alpha-1",     slug: "thymosin-alpha-1",        categorySlug: "health-recovery-immune", active: false, tags: ["immune"], variants: [{ label: "5mg",  sku: "RV-HRI-TA1-5-SC",    retailPrice: 7499,  foundersPrice: 6499, friendsPrice: 5999, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-HRI-TA1-10-SC",   retailPrice: 12999, foundersPrice: 10499, friendsPrice: 8999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "VIP",                  slug: "vip",                     categorySlug: "health-recovery-immune", active: false, tags: ["neuropeptide", "immune"], variants: [{ label: "5mg",  sku: "RV-HRI-VIP-5-SC",    retailPrice: 6999,  foundersPrice: 5499, friendsPrice: 4499, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-HRI-VIP-10-SC",   retailPrice: 12999, foundersPrice: 9999, friendsPrice: 7999, quantity: 0, reorderThreshold: 0 }] });

  // COGNITIVE & LONGEVITY — future
  await createProduct({ name: "Cerebrolysin",    slug: "cerebrolysin",    categorySlug: "cognitive-longevity", active: false, tags: ["nootropic", "neuroprotective"], variants: [{ label: "60mg (liquid)", sku: "RV-CL-CER-60-LIQ", retailPrice: 3999,  foundersPrice: 3499, friendsPrice: 2499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Dihexa",          slug: "dihexa",          categorySlug: "cognitive-longevity", active: false, tags: ["nootropic"], variants: [{ label: "5mg",  sku: "RV-CL-DIH-5-SC",  retailPrice: 7999,  foundersPrice: 5999, friendsPrice: 4999, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-CL-DIH-10-SC", retailPrice: 12999, foundersPrice: 8999, friendsPrice: 6999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Epitalon 50mg",   slug: "epitalon-50mg",   categorySlug: "cognitive-longevity", active: false, tags: ["longevity", "anti-aging"], variants: [{ label: "50mg", sku: "RV-CL-EPI-50-SC",  retailPrice: 19999, foundersPrice: 13999, friendsPrice: 9999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "FOX-04",          slug: "fox-04",          categorySlug: "cognitive-longevity", active: false, tags: ["longevity", "senolytic"], variants: [{ label: "10mg", sku: "RV-CL-FOX-10-SC",  retailPrice: 29999, foundersPrice: 23999, friendsPrice: 19999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Humanin 10mg",    slug: "humanin-10mg",    categorySlug: "cognitive-longevity", active: false, tags: ["longevity", "neuroprotective"], variants: [{ label: "10mg", sku: "RV-CL-HUM-10-SC",  retailPrice: 11999, foundersPrice: 8499, friendsPrice: 7999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "NAD+",            slug: "nad-plus",        categorySlug: "cognitive-longevity", active: false, tags: ["longevity", "mitochondrial", "energy"], variants: [{ label: "100mg", sku: "RV-CL-NAD-100-SC", retailPrice: 4499,  foundersPrice: 2999, friendsPrice: 2499, quantity: 0, reorderThreshold: 0 }, { label: "500mg", sku: "RV-CL-NAD-500-SC", retailPrice: 21999, foundersPrice: 14999, friendsPrice: 5999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Pinealon",        slug: "pinealon",        categorySlug: "cognitive-longevity", active: false, tags: ["nootropic", "longevity"], variants: [{ label: "10mg", sku: "RV-CL-PIN-10-SC",  retailPrice: 5999,  foundersPrice: 4999, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }, { label: "20mg", sku: "RV-CL-PIN-20-SC",  retailPrice: 9999,  foundersPrice: 6999, friendsPrice: 5999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "SLU-PP-332 future", slug: "slu-pp-332-future", categorySlug: "cognitive-longevity", active: false, tags: ["metabolic", "mitochondrial"], variants: [{ label: "5mg", sku: "RV-CL-SLU-5-SC-F", retailPrice: 9999, foundersPrice: 8499, friendsPrice: 6999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "SS-31 (Elamipretide)", slug: "ss-31-elamipretide", categorySlug: "cognitive-longevity", active: false, tags: ["longevity", "mitochondrial"], variants: [{ label: "10mg", sku: "RV-CL-SS3-10-SC-F", retailPrice: 6999, foundersPrice: 5999, friendsPrice: 4999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Selank",          slug: "selank",          categorySlug: "cognitive-longevity", active: false, tags: ["nootropic", "anxiolytic"], variants: [{ label: "5mg",  sku: "RV-CL-SEL-5-SC",  retailPrice: 2999,  foundersPrice: 2499, friendsPrice: 1999, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-CL-SEL-10-SC", retailPrice: 4499,  foundersPrice: 3499, friendsPrice: 2999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Semax",           slug: "semax",           categorySlug: "cognitive-longevity", active: false, tags: ["nootropic"], variants: [{ label: "5mg",  sku: "RV-CL-SEM-5-SC",  retailPrice: 2999,  foundersPrice: 2499, friendsPrice: 1999, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-CL-SEM-10-SC", retailPrice: 4499,  foundersPrice: 3499, friendsPrice: 2999, quantity: 0, reorderThreshold: 0 }] });

  // SEXUAL HEALTH & SLEEP — future
  await createProduct({ name: "DSIP",        slug: "dsip",        categorySlug: "sexual-health-sleep", active: false, tags: ["sleep"], variants: [{ label: "5mg",  sku: "RV-SHS-DSI-5-SC",  retailPrice: 4999,  foundersPrice: 4499, friendsPrice: 2999, quantity: 0, reorderThreshold: 0 }, { label: "15mg", sku: "RV-SHS-DSI-15-SC", retailPrice: 12999, foundersPrice: 8999, friendsPrice: 5999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Kisspeptin",  slug: "kisspeptin",  categorySlug: "sexual-health-sleep", active: false, tags: ["hormone", "reproductive"], variants: [{ label: "5mg",  sku: "RV-SHS-KIS-5-SC",  retailPrice: 5999,  foundersPrice: 4999, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }, { label: "10mg", sku: "RV-SHS-KIS-10-SC", retailPrice: 9999,  foundersPrice: 6999, friendsPrice: 4499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Melanotan-1", slug: "melanotan-1", categorySlug: "sexual-health-sleep", active: false, tags: ["tanning", "skin"], variants: [{ label: "10mg", sku: "RV-SHS-MT1-10-SC",  retailPrice: 4499,  foundersPrice: 3799, friendsPrice: 2999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Melanotan-2", slug: "melanotan-2", categorySlug: "sexual-health-sleep", active: false, tags: ["tanning", "sexual-health"], variants: [{ label: "10mg", sku: "RV-SHS-MT2-10-SC",  retailPrice: 3499,  foundersPrice: 2999, friendsPrice: 2499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "PT-141",      slug: "pt-141",      categorySlug: "sexual-health-sleep", active: false, tags: ["sexual-health"], variants: [{ label: "10mg", sku: "RV-SHS-PT1-10-SC",  retailPrice: 5499,  foundersPrice: 4499, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }] });

  // TOPICALS & SERUMS — future
  await createProduct({ name: "SNAP-8",                     slug: "snap-8",                      categorySlug: "topicals-serums", active: false, tags: ["aesthetics", "topical", "skin"], variants: [{ label: "10mg",  sku: "RV-TS-SNA-10-SC",  retailPrice: 3499,  foundersPrice: 2999, friendsPrice: 2299, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "SNAP-8 + GHK-Cu Serum",     slug: "snap-8-ghk-cu-serum",         categorySlug: "topicals-serums", active: false, tags: ["aesthetics", "topical", "serum"], variants: [{ label: "30ml",  sku: "RV-TS-SNA-30-SER", retailPrice: 5999,  foundersPrice: 4499, friendsPrice: 3499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "PRiVIVE Transdermal",        slug: "privive-transdermal",         categorySlug: "topicals-serums", active: false, tags: ["aesthetics", "topical", "serum"], variants: [{ label: "30ml",  sku: "RV-TS-PRI-30-SER", retailPrice: 9999,  foundersPrice: 6999, friendsPrice: 5999, quantity: 0, reorderThreshold: 0 }] });

  // STACKS, BLENDS & LIQUIDS — future
  await createProduct({ name: "Glutathione",                slug: "glutathione",                 categorySlug: "stacks-blends-liquids", active: false, tags: ["antioxidant", "immune"], variants: [{ label: "1,500mg", sku: "RV-SBL-GLU-1500-SC",  retailPrice: 5999,  foundersPrice: 4499, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "L-Carnitine",                slug: "l-carnitine",                 categorySlug: "stacks-blends-liquids", active: false, tags: ["metabolic", "energy", "liquid"], variants: [{ label: "600mg (liquid)", sku: "RV-SBL-LCA-600-LIQ",  retailPrice: 6499,  foundersPrice: 4999, friendsPrice: 3999, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "LC120",                      slug: "lc120",                       categorySlug: "stacks-blends-liquids", active: false, tags: ["metabolic", "energy", "liquid"], variants: [{ label: "10ml",           sku: "RV-SBL-LC1-10-LIQ",   retailPrice: 5499,  foundersPrice: 4499, friendsPrice: 3499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "LC216",                      slug: "lc216",                       categorySlug: "stacks-blends-liquids", active: false, tags: ["metabolic", "energy", "liquid"], variants: [{ label: "10ml",           sku: "RV-SBL-LC2-10-LIQ",   retailPrice: 5999,  foundersPrice: 4499, friendsPrice: 3499, quantity: 0, reorderThreshold: 0 }] });
  await createProduct({ name: "Super Human Blend",          slug: "super-human-blend",           categorySlug: "stacks-blends-liquids", active: false, tags: ["blend", "liquid", "performance"], variants: [{ label: "10ml",           sku: "RV-SBL-SUP-10-LIQ",   retailPrice: 7999,  foundersPrice: 6499, friendsPrice: 4499, quantity: 0, reorderThreshold: 0 }] });

  // Seed SiteSettings singleton
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", activePricingTier: "retail", freeShippingThreshold: 15000 },
  });

  const productCount = await prisma.product.count();
  const variantCount = await prisma.productVariant.count();
  console.log(`\n✅ Seed complete: ${productCount} products, ${variantCount} variants`);
  console.log("💡 Active (initial inventory): products visible in shop");
  console.log("💤 Inactive (future inventory): hidden until toggled via admin");
  console.log("🚀 Hero stacks: active but qty=0 until Lance confirms ship");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
