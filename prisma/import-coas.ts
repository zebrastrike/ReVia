import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { copyFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Map COA filenames to product slugs
const COA_MAP: Record<string, string> = {
  "GLOW": "glow",
  "VIP 5mg": "vip",
  "KPV 10mg": "kpv",
  "DSIP 5mg": "dsip",
  "LL-37 5mg": "ll-37",
  "NAD+ 500mg": "nad-plus",
  "KLOW Blend": "klow",
  "GHRP-2 5mg": "ghrp-2",
  "GHRP-6 5mg": "ghrp-6",
  "Semax 10mg": "semax",
  "SNAP-8 10mg": "snap-8",
  "MOTS-c 10mg": "mots-c",
  "ARA290 10mg": "ara-290",
  "PT-141 10mg": "pt-141",
  "AOD-9604 5mg": "aod-9604",
  "GHK-Cu 100mg": "ghk-cu",
  "BPC-157 10mg": "bpc-157",
  "IGF-1 LR3 1mg": "igf-1-lr3",
  "Pinealon 10mg": "pinealon",
  "Hexarelin 5mg": "hexarellin-acetate",
  "Ipamorelin 5mg": "ipamorelin",
  "Ipamorelin 10mg": "ipamorelin-10mg",
  "Thymosin α1 5mg": "thymosin-alpha-1",
  "Semaglutide 5mg": "semaglutide",
  "Sermorelin 10mg": "sermorelin-10mg",
  "Cagrilintide 5mg": "cagrilintide",
  "Melanotan I 10mg": "melanotan-1",
  "Tesamorelin 10mg": "tesamorelin-10mg",
  "CJC-1295 DAC 5mg": "cjc-1295-with-dac",
  "TB-500 (Tβ4) 10mg": "tb-500",
  "Melanotan II 10mg": "melanotan-2",
  "Kisspeptin-10 10mg": "kisspeptin",
  "CJC-1295 no DAC 5mg": "cjc-1295-no-dac",
  "L-Glutathione 1500mg": "glutathione",
  "CJC-1295 no DAC 5mg + Ipamorelin 5mg": "cjc-1295-ipamorelin",
  // GLP variants — these map to ReVia product names
  "GLP-3RT 5mg": "retatrutide",
  "GLP-3RT 10mg": "retatrutide",
  "GLP-3RT 30mg": "retatrutide",
  "GLP-2TZ 10mg": "tirzepatide",
  "GLP-2TZ 30mg": "tirzepatide-30mg",
  "GLP-1SV 10 mg": "survodutide",
};

const COA_SOURCE_DIR = "C:/Users/keyse_pt9dxr4/Downloads/coa_extracted";
const COA_DEST_DIR = path.join(process.cwd(), "public", "coa");

async function main() {
  console.log("📋 Importing COA files...\n");

  mkdirSync(COA_DEST_DIR, { recursive: true });

  const files = readdirSync(COA_SOURCE_DIR).filter(f => f.endsWith(".png"));
  let matched = 0;
  let unmatched = 0;

  for (const file of files) {
    // Extract the compound name from filename like "Chromate_Job_33284_GLOW.png"
    const match = file.match(/Chromate_Job_\d+_(.+)\.png/);
    if (!match) {
      console.log(`⚠️  Can't parse: ${file}`);
      unmatched++;
      continue;
    }

    const compoundName = match[1];
    const slug = COA_MAP[compoundName];

    if (!slug) {
      console.log(`⚠️  No slug mapping for: "${compoundName}" (${file})`);
      unmatched++;
      continue;
    }

    // Check product exists
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      console.log(`⚠️  Product not found: ${slug} (${compoundName})`);
      unmatched++;
      continue;
    }

    // Copy file
    const destFilename = `${slug}-coa.png`;
    const destPath = path.join(COA_DEST_DIR, destFilename);
    const srcPath = path.join(COA_SOURCE_DIR, file);

    copyFileSync(srcPath, destPath);

    // Update DB
    const coaUrl = `/coa/${destFilename}`;
    await prisma.product.update({
      where: { slug },
      data: { coaUrl },
    });

    console.log(`✅ ${product.name} ← ${compoundName}`);
    matched++;
  }

  console.log(`\n✅ Done: ${matched} matched, ${unmatched} unmatched`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
