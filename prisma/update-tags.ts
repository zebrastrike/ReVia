import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/**
 * Comprehensive multi-category tag mapping for all peptides.
 * Tags map to category slugs so products appear when any matching category is selected.
 * Key = product slug, Value = array of category slug tags
 */
const TAG_MAP: Record<string, string[]> = {
  // ── CAPSULES ──
  "rebalance":        ["capsules", "nootropic", "longevity", "antioxidant"],
  "recover":          ["capsules", "recovery", "anti-inflammatory", "copper-peptide-cosmetic"],
  "revive":           ["capsules", "mitochondrial", "weight-management"],
  "rebalance-sample-pack": ["capsules", "nootropic", "longevity"],
  "recover-sample-pack":   ["capsules", "recovery", "anti-inflammatory"],
  "revive-sample-pack":    ["capsules", "mitochondrial", "weight-management"],

  // ── WEIGHT MANAGEMENT / METABOLIC ──
  "cagrilintide":     ["weight-management", "hormone"],
  "retatrutide":      ["weight-management", "hormone"],
  "survodutide":      ["weight-management", "hormone"],
  "tirzepatide":      ["weight-management", "hormone"],
  "5-amino-1mq":      ["weight-management", "mitochondrial"],
  "aod-9604":         ["weight-management", "growth-hormone"],
  "adipotide":        ["weight-management"],
  "mots-c-40mg":      ["weight-management", "mitochondrial", "longevity"],
  "mazdutide":        ["weight-management", "hormone"],
  "retatrutide-60mg": ["weight-management", "hormone"],
  "semaglutide":      ["weight-management", "hormone"],
  "tirzepatide-30mg": ["weight-management", "hormone"],
  "tirzepatide-60mg": ["weight-management", "hormone"],
  "l-carnitine":      ["weight-management", "mitochondrial"],

  // ── MITOCHONDRIAL ──
  "mots-c":           ["mitochondrial", "weight-management", "longevity"],
  "humanin":          ["mitochondrial", "neuroprotective", "longevity"],
  "ss-31":            ["mitochondrial", "longevity", "antioxidant"],
  "slu-pp-332":       ["mitochondrial", "weight-management"],
  "humanin-10mg":     ["mitochondrial", "neuroprotective", "longevity"],
  "nad-plus":         ["mitochondrial", "longevity", "antioxidant"],
  "slu-pp-332-future":["mitochondrial", "weight-management"],
  "ss-31-elamipretide":["mitochondrial", "longevity", "antioxidant"],

  // ── GROWTH HORMONE ──
  "cjc-1295-no-dac":  ["growth-hormone"],
  "cjc-1295-ipamorelin": ["growth-hormone"],
  "ipamorelin":       ["growth-hormone"],
  "sermorelin":       ["growth-hormone", "longevity"],
  "tesamorelin":      ["growth-hormone", "weight-management"],
  "aicar":            ["growth-hormone", "weight-management", "mitochondrial"],
  "cjc-1295-with-dac":["growth-hormone"],
  "follistatin-344":  ["growth-hormone", "hormone"],
  "ghrp-2":           ["growth-hormone"],
  "ghrp-6":           ["growth-hormone"],
  "hgh-fragment-176-191": ["growth-hormone", "weight-management"],
  "hexarellin-acetate":   ["growth-hormone", "neuroprotective"],
  "igf-1-lr3":        ["growth-hormone"],
  "ipamorelin-10mg":  ["growth-hormone"],
  "sermorelin-10mg":  ["growth-hormone", "longevity"],
  "tesamorelin-10mg": ["growth-hormone", "weight-management"],

  // ── RECOVERY ──
  "bpc-157-tb-500":   ["recovery", "anti-inflammatory"],
  "bpc-157":          ["recovery", "anti-inflammatory"],
  "tb-500":           ["recovery", "anti-inflammatory", "immune"],

  // ── COPPER PEPTIDE / COSMETIC ──
  "ghk-cu":           ["copper-peptide-cosmetic", "recovery", "anti-inflammatory", "cosmetic", "longevity"],

  // ── LONGEVITY ──
  "epitalon":         ["longevity"],
  "epitalon-50mg":    ["longevity"],
  "fox-04":           ["longevity"],

  // ── COSMETIC ──
  "glow":             ["cosmetic", "copper-peptide-cosmetic"],
  "klow":             ["cosmetic", "copper-peptide-cosmetic", "hormone", "reproductive"],
  "snap-8":           ["cosmetic", "neuropeptide"],
  "snap-8-ghk-cu-serum": ["cosmetic", "copper-peptide-cosmetic"],
  "privive-transdermal":  ["cosmetic"],

  // ── ANTI-INFLAMMATORY ──
  "kpv":              ["anti-inflammatory", "immune", "recovery"],

  // ── ANTIMICROBIAL ──
  "ll-37":            ["antimicrobial", "immune", "recovery"],

  // ── NEUROPROTECTIVE ──
  "ara-290":          ["neuroprotective", "recovery", "anti-inflammatory"],

  // ── HORMONE ──
  "oxytocin-acetate": ["hormone", "neuropeptide"],

  // ── IMMUNE ──
  "thymalin":         ["immune", "longevity"],
  "thymosin-alpha-1": ["immune"],

  // ── NEUROPEPTIDE ──
  "vip":              ["neuropeptide", "immune", "neuroprotective", "sleep"],

  // ── NOOTROPIC ──
  "cerebrolysin":     ["nootropic", "neuroprotective"],
  "dihexa":           ["nootropic", "neuroprotective"],
  "pinealon":         ["nootropic", "neuroprotective", "sleep", "longevity"],
  "selank":           ["nootropic", "neuropeptide", "immune"],
  "semax":            ["nootropic", "neuroprotective", "neuropeptide"],

  // ── REPRODUCTIVE ──
  "kisspeptin":       ["reproductive", "hormone"],

  // ── SEXUAL HEALTH ──
  "pt-141":           ["sexual-health", "hormone"],

  // ── SLEEP ──
  "dsip":             ["sleep", "neuropeptide"],

  // ── TANNING ──
  "melanotan-1":      ["tanning", "cosmetic"],
  "melanotan-2":      ["tanning", "sexual-health", "cosmetic"],

  // ── ANTIOXIDANT ──
  "glutathione":      ["antioxidant", "immune", "longevity"],

  // ── STACKS ──
  "revia-lean":       ["stacks", "weight-management"],
  "revia-lean-pro-plus": ["stacks", "weight-management", "growth-hormone"],
  "revia-renew":      ["stacks", "recovery", "anti-inflammatory", "copper-peptide-cosmetic"],
  "revia-sculpt-glow":["stacks", "weight-management", "recovery", "cosmetic", "growth-hormone"],
  "lc120":            ["stacks", "weight-management", "mitochondrial"],
  "lc216":            ["stacks", "weight-management", "mitochondrial"],
  "super-human-blend":["stacks", "growth-hormone", "recovery"],

  // ── SUPPLIES (no cross-category needed) ──
  "bac-water":        ["supplies"],
  "acetic-acid-water":["supplies"],
  "syringes":         ["supplies"],
};

async function main() {
  console.log("🏷️  Updating product tags for multi-category support...\n");

  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, tags: true },
  });

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const newTags = TAG_MAP[product.slug];
    if (!newTags) {
      console.log(`⚠️  No tag mapping for: ${product.slug} (${product.name})`);
      skipped++;
      continue;
    }

    const newTagsJson = JSON.stringify(newTags);
    if (product.tags === newTagsJson) {
      continue; // already up to date
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { tags: newTagsJson },
    });

    console.log(`✅ ${product.name}: ${newTags.join(", ")}`);
    updated++;
  }

  console.log(`\n✅ Done: ${updated} updated, ${skipped} unmapped, ${products.length - updated - skipped} already current`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
