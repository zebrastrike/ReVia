const { fal } = require("@fal-ai/client");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
require("dotenv/config");

// ── Config ──
const REFERENCE_IMAGE = "C:/Users/burns/Desktop/ReVia Vial Images/Tirzepepatide 15mg - product image.png";
const OUTPUT_DIR = "C:/Users/burns/Desktop/ReVia Vial Images/generated";

fal.config({ credentials: process.env.FAL_KEY });

async function uploadImage(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: "image/png" });
  const url = await fal.storage.upload(blob);
  console.log("Uploaded reference image:", url);
  return url;
}

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(outputPath);
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => { fs.unlink(outputPath, () => {}); reject(err); });
  });
}

async function generateVialImage(imageUrl, productName, mg, outputFilename) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const prompt = `Edit ONLY the text on the vial label. Replace the product name with "${productName}" and the dosage with "${mg}". The banner strip behind the product name must be dark navy blue color hex #3a4059. The mg dosage text below must also be dark navy blue color hex #3a4059. Do NOT change anything else. The background MUST remain pure clean white product photography style. The vial shape, cap color, glass transparency, ReVia logo, label design, small text "5ML Multi Dose | 99% Purity" and "Research Use Only" must all stay identical to the input image. No shadows, no color shifts, no gray backgrounds.`;

  console.log(`\n  Generating: ${productName} ${mg}...`);

  const result = await fal.subscribe("fal-ai/nano-banana-2/edit", {
    input: {
      prompt,
      image_urls: [imageUrl],
      aspect_ratio: "1:1",
      resolution: "2K",
      output_format: "png",
      num_images: 1,
      seed: 77,
    },
    logs: false,
  });

  if (result.data?.images?.[0]?.url) {
    const outputPath = path.join(OUTPUT_DIR, outputFilename);
    await downloadImage(result.data.images[0].url, outputPath);
    console.log(`  Done: ${outputFilename}`);
    return outputPath;
  } else {
    console.error(`  FAILED: ${productName} ${mg}`, JSON.stringify(result.data, null, 2));
    return null;
  }
}

// ── All vial products with their variants ──
// Excludes: capsules (REbalance, REcover, REvive), syringes, serums, liquids, topicals
const VIAL_PRODUCTS = [
  // Batch 1 (products 1-5)
  { name: "Retatrutide", variants: ["5 mg", "10 mg", "30 mg"] },
  { name: "Tirzepatide", variants: ["5 mg", "10 mg", "15 mg"] },
  { name: "Cagrilintide", variants: ["5 mg", "10 mg"] },
  { name: "Survodutide", variants: ["10 mg"] },
  { name: "CJC-1295", variants: ["5 mg", "10 mg"] },

  // Batch 2 (products 6-10)
  { name: "Ipamorelin", variants: ["5 mg", "10 mg"] },
  { name: "CJC-1295 + Ipamorelin", variants: ["5 mg / 5 mg"] },
  { name: "Sermorelin", variants: ["5 mg", "10 mg"] },
  { name: "Tesamorelin", variants: ["5 mg", "10 mg"] },
  { name: "BPC-157 / TB-500", variants: ["5 mg / 5 mg", "10 mg / 10 mg"] },

  // Batch 3 (products 11-15)
  { name: "GHK-Cu", variants: ["100 mg"] },
  { name: "Epitalon", variants: ["10 mg", "50 mg"] },
  { name: "MOTS-c", variants: ["10 mg", "40 mg"] },
  { name: "Humanin", variants: ["5 mg", "10 mg"] },
  { name: "SS-31", variants: ["50 mg"] },

  // Batch 4 (products 16-20)
  { name: "SLU-PP-332", variants: ["5 mg"] },
  { name: "NAD+", variants: ["100 mg", "500 mg"] },
  { name: "BPC-157", variants: ["5 mg", "10 mg"] },
  { name: "TB-500", variants: ["5 mg", "10 mg"] },
  { name: "KPV", variants: ["5 mg", "10 mg"] },

  // Batch 5 (products 21-25)
  { name: "LL-37", variants: ["5 mg"] },
  { name: "ARA-290", variants: ["10 mg"] },
  { name: "Thymalin", variants: ["10 mg"] },
  { name: "Thymosin Alpha-1", variants: ["5 mg", "10 mg"] },
  { name: "VIP", variants: ["5 mg", "10 mg"] },

  // Batch 6 (products 26-30)
  { name: "5-Amino-1MQ", variants: ["5 mg", "10 mg"] },
  { name: "AOD-9604", variants: ["5 mg", "10 mg"] },
  { name: "Adipotide", variants: ["5 mg"] },
  { name: "Semaglutide", variants: ["5 mg", "10 mg", "30 mg"] },
  { name: "Mazdutide", variants: ["10 mg"] },

  // Batch 7 (products 31-35)
  { name: "HGH Fragment 176-191", variants: ["5 mg"] },
  { name: "Hexarellin Acetate", variants: ["5 mg"] },
  { name: "GHRP-2", variants: ["5 mg", "10 mg"] },
  { name: "GHRP-6", variants: ["5 mg", "10 mg"] },
  { name: "IGF-1 LR3", variants: ["0.1 mg", "1 mg"] },

  // Batch 8 (products 36-40)
  { name: "Follistatin-344", variants: ["1 mg"] },
  { name: "AICAR", variants: ["5 mg"] },
  { name: "CJC-1295 with DAC", variants: ["5 mg"] },
  { name: "Oxytocin Acetate", variants: ["2 mg"] },
  { name: "FOX-04", variants: ["10 mg"] },

  // Batch 9 (products 41-45)
  { name: "Kisspeptin", variants: ["5 mg", "10 mg"] },
  { name: "PT-141", variants: ["10 mg"] },
  { name: "DSIP", variants: ["5 mg", "15 mg"] },
  { name: "Melanotan-1", variants: ["10 mg"] },
  { name: "Melanotan-2", variants: ["10 mg"] },

  // Batch 10 (products 46-50)
  { name: "SNAP-8", variants: ["10 mg"] },
  { name: "Glutathione", variants: ["1500 mg"] },
  { name: "Selank", variants: ["5 mg", "10 mg"] },
  { name: "Semax", variants: ["5 mg", "10 mg"] },
  { name: "Pinealon", variants: ["10 mg", "20 mg"] },

  // Batch 11 (remaining)
  { name: "Dihexa", variants: ["5 mg", "10 mg"] },
  { name: "Cerebrolysin", variants: ["60 mg"] },
];

function slugify(name, mg) {
  const slug = name.toLowerCase()
    .replace(/[+\/]/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const mgSlug = mg.toLowerCase()
    .replace(/\s*\/\s*/g, "-")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9-]/g, "");
  return `${slug}-${mgSlug}.png`;
}

async function main() {
  if (!process.env.FAL_KEY) {
    console.error("FAL_KEY not found in .env");
    process.exit(1);
  }

  // Quick redo mode: node scripts/generate-vial-fal.js redo "Retatrutide" "10 mg"
  if (process.argv[2] === "redo") {
    const name = process.argv[3];
    const mg = process.argv[4];
    if (!name || !mg) { console.error("Usage: node scripts/generate-vial-fal.js redo \"Name\" \"10 mg\""); process.exit(1); }
    console.log("\nUploading reference image...");
    const imageUrl = await uploadImage(REFERENCE_IMAGE);
    const filename = slugify(name, mg);
    await generateVialImage(imageUrl, name, mg, filename);
    console.log("\nDone!");
    return;
  }

  const batchArg = parseInt(process.argv[2] || "1", 10);
  const BATCH_SIZE = 5;
  const startIdx = (batchArg - 1) * BATCH_SIZE;
  const batch = VIAL_PRODUCTS.slice(startIdx, startIdx + BATCH_SIZE);

  if (batch.length === 0) {
    console.log("No more products in this batch. All done!");
    return;
  }

  const totalVariants = batch.reduce((sum, p) => sum + p.variants.length, 0);
  console.log(`\n=== BATCH ${batchArg} === (${batch.length} products, ${totalVariants} images)\n`);
  console.log("Products:", batch.map(p => p.name).join(", "));

  console.log("\nUploading reference image...");
  const imageUrl = await uploadImage(REFERENCE_IMAGE);

  let count = 0;
  for (const product of batch) {
    for (const mg of product.variants) {
      count++;
      const filename = slugify(product.name, mg);
      console.log(`\n[${count}/${totalVariants}]`);
      await generateVialImage(imageUrl, product.name, mg, filename);
    }
  }

  console.log(`\n=== BATCH ${batchArg} COMPLETE === (${count} images generated)`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`\nTo generate next batch: node scripts/generate-vial-fal.js ${batchArg + 1}`);
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
