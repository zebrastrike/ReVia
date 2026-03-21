import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function sku(category: string, product: string, variant: string): string {
  const p = slugify(product).toUpperCase();
  const v = variant.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `${p}-${v}`;
}

interface VariantInput {
  label: string;
  price: number;
}

interface ProductInput {
  name: string;
  description: string;
  variants: VariantInput[];
  featured?: boolean;
  tags?: string[];
}

interface CategoryInput {
  name: string;
  description: string;
  products: ProductInput[];
}

const categories: CategoryInput[] = [
  {
    name: "Anti-inflammatory",
    description:
      "Peptides that target inflammatory pathways, supporting research into autoimmune and inflammatory conditions.",
    products: [
      {
        name: "KPV",
        description:
          "KPV is a tripeptide derived from alpha-MSH with potent anti-inflammatory properties. It has been studied for its ability to modulate NF-kB signaling and reduce intestinal inflammation. Researchers use KPV to investigate therapeutic approaches for IBD and other inflammatory conditions.",
        variants: [
          { label: "10mg", price: 65 },
          { label: "5mg", price: 55 },
        ],
      },
    ],
  },
  {
    name: "Antimicrobial",
    description:
      "Peptides with antimicrobial activity, used in research on host defense and infection control.",
    products: [
      {
        name: "LL37",
        description:
          "LL37 is a human cathelicidin antimicrobial peptide that plays a key role in innate immune defense. It exhibits broad-spectrum activity against bacteria, viruses, and fungi. Research focuses on its wound healing and immunomodulatory properties.",
        variants: [{ label: "5mg", price: 110 }],
      },
    ],
  },
  {
    name: "Antioxidant",
    description:
      "Compounds that combat oxidative stress, supporting cellular health research.",
    products: [
      {
        name: "Glutathione",
        description:
          "Glutathione is the body's master antioxidant, a tripeptide critical for detoxification and cellular protection. It neutralizes free radicals and supports immune function. Research investigates its role in aging, liver health, and disease prevention.",
        variants: [{ label: "1500mg", price: 110 }],
      },
    ],
  },
  {
    name: "Copper Peptide / Cosmetic",
    description:
      "Copper-binding peptides studied for skin rejuvenation, wound healing, and hair growth applications.",
    products: [
      {
        name: "GHK-Cu",
        description:
          "GHK-Cu is a naturally occurring copper peptide with remarkable regenerative properties. It promotes collagen synthesis, skin remodeling, and wound healing at the cellular level. Widely studied for anti-aging, hair growth, and tissue repair applications.",
        variants: [
          { label: "100mg", price: 100 },
          { label: "50mg", price: 40 },
        ],
        featured: true,
        tags: ["bestseller", "anti-aging", "skin"],
      },
    ],
  },
  {
    name: "Cosmetic",
    description:
      "Peptides and formulations designed for skin care and cosmetic research applications.",
    products: [
      {
        name: "SNAP-8 + GHK-Cu Serum",
        description:
          "A synergistic serum combining SNAP-8 and GHK-Cu for advanced skin research. SNAP-8 targets expression lines by modulating SNARE complex formation while GHK-Cu promotes collagen production. Together they represent a comprehensive approach to skin rejuvenation studies.",
        variants: [{ label: "30ml", price: 65 }],
      },
      {
        name: "SNAP-8",
        description:
          "SNAP-8 is an octapeptide that acts as a milder alternative to botulinum toxin in research settings. It inhibits SNARE complex formation to reduce muscle contraction at the cellular level. Used in cosmetic peptide research for anti-wrinkle applications.",
        variants: [{ label: "10mg", price: 55 }],
      },
      {
        name: "GLOW Blend",
        description:
          "A premium cosmetic peptide blend formulated for comprehensive skin research. This multi-peptide complex targets multiple pathways involved in skin health and appearance. Designed for researchers studying synergistic effects of combined peptide therapies on skin.",
        variants: [{ label: "Blend", price: 570 }],
      },
    ],
  },
  {
    name: "Growth Hormone",
    description:
      "Peptides that stimulate growth hormone release, used in research on metabolism, body composition, and aging.",
    products: [
      {
        name: "CJC-1295 (no DAC)",
        description:
          "CJC-1295 without DAC is a modified GHRH analog that stimulates growth hormone release with a shorter duration of action. It provides pulsatile GH release that more closely mimics natural physiology. Researchers use it to study GH secretion patterns and metabolic effects.",
        variants: [
          { label: "10mg", price: 210 },
          { label: "5mg", price: 110 },
        ],
      },
      {
        name: "CJC-1295 (with DAC)",
        description:
          "CJC-1295 with Drug Affinity Complex provides sustained growth hormone releasing hormone activity through extended half-life. The DAC modification allows it to bind to albumin, prolonging its action for days rather than hours. Used in research on sustained GH elevation and its metabolic effects.",
        variants: [{ label: "5mg", price: 210 }],
      },
      {
        name: "CJC-1295 + Ipamorelin",
        description:
          "A synergistic combination of CJC-1295 and Ipamorelin for growth hormone research. CJC-1295 amplifies GH release while Ipamorelin provides selective GH stimulation without affecting cortisol or prolactin. This combination is widely studied for its potent and clean GH-releasing properties.",
        variants: [{ label: "10mg", price: 180 }],
      },
      {
        name: "GHRP-2",
        description:
          "GHRP-2 is a synthetic growth hormone releasing peptide that stimulates GH secretion through the ghrelin receptor. It is one of the most potent GHRP variants studied for its effects on appetite, body composition, and metabolism. Research shows it increases GH levels in a dose-dependent manner.",
        variants: [
          { label: "10mg", price: 110 },
          { label: "5mg", price: 60 },
        ],
      },
      {
        name: "GHRP-6",
        description:
          "GHRP-6 is a hexapeptide growth hormone secretagogue that strongly stimulates appetite and GH release. It acts on the ghrelin receptor and has been studied for its effects on body weight, food intake, and metabolic regulation. It also shows cytoprotective properties in research models.",
        variants: [
          { label: "10mg", price: 60 },
          { label: "5mg", price: 50 },
        ],
      },
      {
        name: "HGH",
        description:
          "Recombinant Human Growth Hormone (HGH) is identical to the 191-amino acid protein produced by the pituitary gland. It plays a central role in growth, metabolism, and cellular repair. Used extensively in research on aging, body composition, and tissue regeneration.",
        variants: [
          { label: "10iu", price: 70 },
          { label: "15iu", price: 100 },
        ],
      },
      {
        name: "HGH Frag 176-191",
        description:
          "HGH Fragment 176-191 is a modified peptide corresponding to the fat-reducing region of human growth hormone. It has been shown to stimulate lipolysis and inhibit lipogenesis without affecting blood sugar or growth. Researchers study it specifically for its targeted fat metabolism properties.",
        variants: [{ label: "5mg", price: 140 }],
      },
      {
        name: "Hexarelin",
        description:
          "Hexarelin is a potent synthetic hexapeptide growth hormone secretagogue. It stimulates GH release through the ghrelin receptor and has shown cardioprotective properties in research. Studies suggest it may also promote wound healing and reduce adiposity.",
        variants: [{ label: "5mg", price: 140 }],
      },
      {
        name: "IGF-1 LR3",
        description:
          "IGF-1 LR3 is a modified form of insulin-like growth factor with an extended half-life due to its arginine substitution. It plays a critical role in cell growth, differentiation, and muscle hypertrophy research. Its enhanced potency makes it a key tool in metabolic and growth studies.",
        variants: [
          { label: "0.1mg", price: 65 },
          { label: "1mg", price: 400 },
        ],
      },
      {
        name: "Ipamorelin",
        description:
          "Ipamorelin is a highly selective growth hormone secretagogue that stimulates GH release without significantly affecting cortisol, prolactin, or ACTH. It is considered one of the safest GHRPs for research due to its clean release profile. Widely used in studies on body composition and metabolism.",
        variants: [
          { label: "10mg", price: 110 },
          { label: "5mg", price: 65 },
        ],
      },
      {
        name: "Sermorelin",
        description:
          "Sermorelin is a synthetic analog of growth hormone releasing hormone (GHRH) consisting of the first 29 amino acids. It stimulates natural GH production and release from the pituitary. Research focuses on its potential for age-related GH decline and metabolic optimization.",
        variants: [
          { label: "10mg", price: 140 },
          { label: "5mg", price: 100 },
        ],
      },
      {
        name: "Tesamorelin",
        description:
          "Tesamorelin is a stabilized GHRH analog that powerfully stimulates growth hormone secretion. It has been extensively studied for reducing visceral adipose tissue and improving body composition. Research also explores its effects on cognitive function and liver health.",
        variants: [
          { label: "10mg", price: 200 },
          { label: "5mg", price: 130 },
        ],
      },
    ],
  },
  {
    name: "Hormone",
    description:
      "Peptide hormones used in behavioral and physiological research.",
    products: [
      {
        name: "Oxytocin",
        description:
          "Oxytocin is a neuropeptide hormone involved in social bonding, trust, and reproductive behavior. It plays crucial roles in labor, lactation, and pair bonding in research models. Studies also explore its potential in anxiety, autism spectrum, and social cognition research.",
        variants: [{ label: "2mg", price: 65 }],
      },
    ],
  },
  {
    name: "Immune",
    description:
      "Peptides that modulate immune function, used in immunology and infectious disease research.",
    products: [
      {
        name: "Thymalin",
        description:
          "Thymalin is a thymic peptide extract that regulates immune system function by modulating T-cell maturation. It has been studied for its ability to restore immune balance in aging and immunocompromised models. Research also explores its potential anti-aging and longevity properties.",
        variants: [{ label: "10mg", price: 85 }],
      },
      {
        name: "Thymosin Alpha-1",
        description:
          "Thymosin Alpha-1 is a potent immunomodulatory peptide that enhances T-cell function and dendritic cell activity. It is studied for its broad-spectrum immune enhancement, including viral infections and cancer immunology. Research highlights its role in restoring immune competence in immunocompromised subjects.",
        variants: [
          { label: "10mg", price: 210 },
          { label: "5mg", price: 110 },
        ],
      },
    ],
  },
  {
    name: "Longevity",
    description:
      "Peptides studied for their effects on aging, telomere biology, and lifespan extension.",
    products: [
      {
        name: "Epithalon",
        description:
          "Epithalon is a synthetic tetrapeptide that activates telomerase, the enzyme responsible for maintaining telomere length. It has been extensively studied for its anti-aging effects, including gene expression regulation and circadian rhythm normalization. Research suggests it may extend cellular lifespan and improve physiological function.",
        variants: [
          { label: "10mg", price: 60 },
          { label: "50mg", price: 175 },
        ],
      },
    ],
  },
  {
    name: "Metabolic",
    description:
      "Peptides targeting metabolic pathways, used in obesity, diabetes, and weight management research.",
    products: [
      {
        name: "5-Amino-1MQ",
        description:
          "5-Amino-1MQ is a small molecule that inhibits NNMT (nicotinamide N-methyltransferase), an enzyme linked to obesity and metabolic dysfunction. By blocking NNMT, it may increase NAD+ levels and promote fat cell shrinkage. Research focuses on its potential as a novel anti-obesity compound.",
        variants: [{ label: "5mg", price: 110 }],
      },
      {
        name: "AOD",
        description:
          "AOD-9604 is a modified fragment of human growth hormone designed to stimulate lipolysis and inhibit lipogenesis. Unlike full-length HGH, it does not affect IGF-1 levels or insulin resistance in research models. Studied for targeted fat reduction without the broader effects of growth hormone.",
        variants: [{ label: "5mg", price: 145 }],
      },
      {
        name: "Adipotide",
        description:
          "Adipotide is a peptidomimetic that targets blood vessels supplying white adipose tissue, causing targeted fat cell apoptosis. It was originally developed in cancer research and repurposed for obesity studies. Research shows it can produce rapid and significant fat loss in animal models.",
        variants: [{ label: "5mg", price: 225 }],
      },
      {
        name: "Cagrilintide",
        description:
          "Cagrilintide is a long-acting amylin analog that reduces appetite and food intake through central satiety pathways. It works synergistically with GLP-1 agonists for enhanced weight loss in research. Studies show promising results for body weight reduction and metabolic improvement.",
        variants: [
          { label: "10mg", price: 220 },
          { label: "5mg", price: 145 },
        ],
      },
      {
        name: "Cagrilintide+Semaglutide",
        description:
          "A combination of Cagrilintide and Semaglutide that targets both amylin and GLP-1 pathways for synergistic metabolic effects. This dual-agonist approach has shown superior weight loss results compared to either compound alone in research. Represents a cutting-edge approach to obesity and metabolic disease research.",
        variants: [
          { label: "10mg", price: 260 },
          { label: "5mg", price: 150 },
        ],
      },
      {
        name: "L-Carnitine",
        description:
          "L-Carnitine is an amino acid derivative essential for transporting fatty acids into mitochondria for energy production. It plays a key role in fat metabolism and cellular energy generation. Research investigates its effects on exercise performance, recovery, and metabolic health.",
        variants: [{ label: "10ml", price: 95 }],
      },
      {
        name: "Mazdutide",
        description:
          "Mazdutide is a dual GLP-1 and glucagon receptor agonist being studied for its powerful effects on body weight and glycemic control. It leverages both incretin and glucagon signaling to promote weight loss and metabolic improvement. Research shows it as a promising next-generation metabolic peptide.",
        variants: [{ label: "10mg", price: 250 }],
      },
      {
        name: "Retatrutide",
        description:
          "Retatrutide is a triple-agonist peptide targeting GLP-1, GIP, and glucagon receptors simultaneously. It has demonstrated unprecedented weight loss results in clinical research, surpassing dual-agonist compounds. Considered one of the most promising metabolic peptides currently under investigation.",
        variants: [
          { label: "5mg", price: 75 },
          { label: "10mg", price: 250 },
          { label: "15mg", price: 275 },
          { label: "20mg", price: 325 },
          { label: "30mg", price: 350 },
          { label: "40mg", price: 400 },
        ],
        featured: true,
        tags: ["bestseller", "weight-loss", "metabolic"],
      },
      {
        name: "Semaglutide",
        description:
          "Semaglutide is a GLP-1 receptor agonist that has revolutionized metabolic research with its potent effects on weight loss and glycemic control. It mimics the incretin hormone GLP-1 to reduce appetite and improve insulin sensitivity. One of the most widely studied peptides for obesity and type 2 diabetes research.",
        variants: [
          { label: "2mg", price: 40 },
          { label: "5mg", price: 50 },
          { label: "10mg", price: 70 },
          { label: "15mg", price: 90 },
          { label: "20mg", price: 110 },
          { label: "30mg", price: 140 },
        ],
        featured: true,
        tags: ["bestseller", "weight-loss", "metabolic"],
      },
      {
        name: "Survodutide",
        description:
          "Survodutide is a dual GLP-1 and glucagon receptor agonist studied for its effects on obesity and metabolic liver disease. It combines the appetite-suppressing effects of GLP-1 with the energy expenditure-boosting properties of glucagon signaling. Research highlights its potential for NASH and significant body weight reduction.",
        variants: [{ label: "10mg", price: 330 }],
      },
      {
        name: "Tirzepatide",
        description:
          "Tirzepatide is a dual GIP and GLP-1 receptor agonist that has shown remarkable efficacy in weight loss and glycemic control research. It uniquely engages both incretin pathways for synergistic metabolic benefits. Clinical research demonstrates it as one of the most effective compounds for obesity and diabetes studies.",
        variants: [
          { label: "5mg", price: 50 },
          { label: "10mg", price: 70 },
          { label: "15mg", price: 100 },
          { label: "20mg", price: 110 },
          { label: "30mg", price: 150 },
          { label: "40mg", price: 175 },
          { label: "50mg", price: 210 },
          { label: "60mg", price: 260 },
        ],
        featured: true,
        tags: ["bestseller", "weight-loss", "metabolic"],
      },
    ],
  },
  {
    name: "Mitochondrial",
    description:
      "Peptides targeting mitochondrial function, energy production, and cellular health.",
    products: [
      {
        name: "MOTS-c",
        description:
          "MOTS-c is a mitochondrial-derived peptide that regulates metabolic homeostasis and insulin sensitivity. It activates AMPK and enhances glucose uptake and fatty acid oxidation. Research explores its role as an exercise mimetic and its potential for metabolic disease and aging studies.",
        variants: [
          { label: "10mg", price: 100 },
          { label: "40mg", price: 250 },
        ],
      },
      {
        name: "NAD",
        description:
          "NAD+ (Nicotinamide Adenine Dinucleotide) is a critical coenzyme found in every cell, essential for energy metabolism and cellular repair. It activates sirtuins and PARPs, key enzymes in DNA repair and longevity pathways. Research focuses on its declining levels with age and potential for cellular rejuvenation.",
        variants: [
          { label: "100mg", price: 45 },
          { label: "500mg", price: 140 },
        ],
        featured: true,
        tags: ["bestseller", "longevity", "energy"],
      },
      {
        name: "SLU-PP-332",
        description:
          "SLU-PP-332 is an ERR (estrogen-related receptor) agonist that mimics the molecular effects of exercise. It enhances mitochondrial biogenesis and oxidative metabolism without physical activity. Research investigates its potential as an exercise mimetic for metabolic and muscle-wasting conditions.",
        variants: [{ label: "5mg", price: 165 }],
      },
      {
        name: "SS-31",
        description:
          "SS-31 (Elamipretide) is a mitochondria-targeted peptide that concentrates in the inner mitochondrial membrane. It stabilizes cardiolipin and improves electron transport chain efficiency, reducing oxidative stress. Studied for age-related mitochondrial dysfunction, heart failure, and neurodegenerative disease research.",
        variants: [
          { label: "10mg", price: 120 },
          { label: "50mg", price: 500 },
        ],
      },
    ],
  },
  {
    name: "Neuropeptide",
    description:
      "Peptides that act on neural pathways, studied for neurological and inflammatory conditions.",
    products: [
      {
        name: "VIP",
        description:
          "Vasoactive Intestinal Peptide (VIP) is a neuropeptide with broad physiological effects on the nervous, immune, and digestive systems. It acts as a potent vasodilator and immunomodulator with anti-inflammatory properties. Research explores its role in CIRS, mold illness, and neurodegenerative conditions.",
        variants: [
          { label: "10mg", price: 180 },
          { label: "5mg", price: 100 },
        ],
      },
    ],
  },
  {
    name: "Neuroprotective",
    description:
      "Peptides with neuroprotective properties, studied for nerve repair and neuroinflammation.",
    products: [
      {
        name: "ARA-290",
        description:
          "ARA-290 is a non-hematopoietic EPO-derived peptide that activates the innate repair receptor (IRR). It has shown neuroprotective and tissue-protective effects without stimulating red blood cell production. Research focuses on its potential for neuropathy, tissue repair, and chronic inflammatory conditions.",
        variants: [{ label: "10mg", price: 80 }],
      },
    ],
  },
  {
    name: "Nootropic",
    description:
      "Peptides that enhance cognitive function, memory, and neuroprotection in research models.",
    products: [
      {
        name: "Cerebrolysin",
        description:
          "Cerebrolysin is a multi-peptide complex derived from porcine brain proteins with neurotrophic properties. It mimics the action of endogenous neurotrophic factors to promote neuronal survival and plasticity. Studied for cognitive enhancement, stroke recovery, and neurodegenerative disease research.",
        variants: [{ label: "60mg", price: 70 }],
      },
      {
        name: "Dihexa",
        description:
          "Dihexa is a potent nootropic hexapeptide derived from angiotensin IV with extraordinary cognitive-enhancing properties. It is reported to be millions of times more potent than BDNF at promoting synaptic connectivity. Research investigates its potential for memory enhancement and neurodegenerative conditions.",
        variants: [
          { label: "10mg", price: 160 },
          { label: "5mg", price: 100 },
        ],
      },
      {
        name: "Pinealon",
        description:
          "Pinealon is a tripeptide bioregulator that crosses the blood-brain barrier and modulates brain function. It has been studied for its effects on cognitive performance, stress resistance, and neuroprotection. Research explores its potential for improving mental clarity and sleep quality.",
        variants: [
          { label: "5mg", price: 60 },
          { label: "10mg", price: 90 },
          { label: "20mg", price: 120 },
        ],
      },
      {
        name: "Selank",
        description:
          "Selank is a synthetic heptapeptide anxiolytic derived from the naturally occurring immunomodulatory peptide tuftsin. It modulates GABA, serotonin, and dopamine systems to reduce anxiety and improve cognitive function. Research highlights its dual nootropic and anxiolytic properties without sedation.",
        variants: [
          { label: "5mg", price: 50 },
          { label: "10mg", price: 75 },
        ],
      },
      {
        name: "Semax",
        description:
          "Semax is a synthetic heptapeptide analog of ACTH(4-7) with potent nootropic and neuroprotective properties. It enhances BDNF expression and modulates serotonergic and dopaminergic systems. Widely studied for cognitive enhancement, stroke recovery, and ADHD research.",
        variants: [
          { label: "5mg", price: 50 },
          { label: "10mg", price: 70 },
        ],
      },
    ],
  },
  {
    name: "Recovery",
    description:
      "Peptides that promote tissue repair, wound healing, and recovery in research models.",
    products: [
      {
        name: "BPC-157",
        description:
          "BPC-157 is a pentadecapeptide derived from human gastric juice with remarkable regenerative properties. It accelerates healing of muscles, tendons, ligaments, and the GI tract in research models. One of the most widely studied peptides for tissue repair, injury recovery, and gut health.",
        variants: [
          { label: "5mg", price: 55 },
          { label: "10mg", price: 100 },
        ],
        featured: true,
        tags: ["bestseller", "recovery", "healing"],
      },
      {
        name: "BPC+TB500",
        description:
          "A powerful combination of BPC-157 and TB-500 for comprehensive tissue repair research. BPC-157 targets local healing while TB-500 provides systemic regenerative support through upregulation of actin. Together they represent a synergistic approach to recovery and healing studies.",
        variants: [
          { label: "10mg", price: 125 },
          { label: "20mg", price: 200 },
        ],
      },
      {
        name: "TB500",
        description:
          "TB-500 is a synthetic fraction of thymosin beta-4 that promotes cell migration, blood vessel formation, and tissue repair. It upregulates actin to facilitate cellular building blocks for healing. Research focuses on its systemic healing properties for muscle, tendon, and cardiac tissue repair.",
        variants: [
          { label: "5mg", price: 60 },
          { label: "10mg", price: 100 },
        ],
      },
    ],
  },
  {
    name: "Reproductive",
    description:
      "Peptides involved in reproductive function, fertility, and hormonal regulation research.",
    products: [
      {
        name: "HMG",
        description:
          "Human Menopausal Gonadotropin (HMG) contains both FSH and LH activity, stimulating gonadal function. It is used in fertility research to study follicular development and spermatogenesis. Research explores its applications in reproductive endocrinology and assisted reproduction.",
        variants: [{ label: "75iu", price: 90 }],
      },
      {
        name: "Kisspeptin-10",
        description:
          "Kisspeptin-10 is a truncated form of kisspeptin that potently stimulates GnRH release from the hypothalamus. It plays a master regulatory role in the reproductive hormone cascade. Research investigates its potential for fertility, puberty disorders, and reproductive endocrinology.",
        variants: [
          { label: "5mg", price: 80 },
          { label: "10mg", price: 140 },
        ],
      },
      {
        name: "hCG",
        description:
          "Human Chorionic Gonadotropin (hCG) mimics luteinizing hormone and stimulates gonadal steroidogenesis. It is essential in fertility research and is studied for its role in testosterone production and ovulation induction. Widely used in reproductive biology and endocrinology research.",
        variants: [
          { label: "5000IU", price: 100 },
          { label: "10000IU", price: 180 },
        ],
      },
    ],
  },
  {
    name: "Sexual Health",
    description:
      "Peptides studied for their effects on sexual function and arousal pathways.",
    products: [
      {
        name: "PT-141",
        description:
          "PT-141 (Bremelanotide) is a melanocortin receptor agonist that acts on the central nervous system to influence sexual arousal. Unlike PDE5 inhibitors, it works through neurological pathways rather than vascular mechanisms. Research focuses on its potential for both male and female sexual dysfunction.",
        variants: [{ label: "10mg", price: 90 }],
      },
    ],
  },
  {
    name: "Sleep",
    description:
      "Peptides that modulate sleep architecture and circadian rhythms in research.",
    products: [
      {
        name: "DSIP",
        description:
          "Delta Sleep-Inducing Peptide (DSIP) is a neuropeptide that modulates sleep architecture and promotes delta wave sleep patterns. It has been studied for its effects on stress, pain perception, and endocrine regulation. Research explores its potential for sleep disorders and stress-related conditions.",
        variants: [
          { label: "5mg", price: 55 },
          { label: "15mg", price: 120 },
        ],
      },
    ],
  },
  {
    name: "Tanning",
    description:
      "Peptides that stimulate melanogenesis, studied for skin pigmentation research.",
    products: [
      {
        name: "Melanotan-1",
        description:
          "Melanotan-1 (Afamelanotide) is a synthetic analog of alpha-MSH that stimulates melanin production in skin cells. It activates MC1R receptors to promote eumelanin synthesis and skin darkening. Research focuses on photoprotection, vitiligo, and UV-related skin damage prevention.",
        variants: [{ label: "10mg", price: 75 }],
      },
    ],
  },
  {
    name: "Supplies",
    description:
      "Essential reconstitution supplies and solvents for peptide research applications.",
    products: [
      {
        name: "Acetic Acid",
        description:
          "Pharmaceutical-grade acetic acid solution for peptide reconstitution. Required for dissolving certain peptides that are not soluble in bacteriostatic water. Essential supply for proper peptide research preparation.",
        variants: [
          { label: "10ml", price: 10 },
          { label: "3ml", price: 10 },
        ],
      },
      {
        name: "BAC Water",
        description:
          "Bacteriostatic water containing 0.9% benzyl alcohol as a preservative for multi-use peptide reconstitution. It inhibits bacterial growth, allowing reconstituted peptides to remain stable for extended periods. The standard solvent for most peptide research applications.",
        variants: [
          { label: "10ml", price: 10 },
          { label: "3ml", price: 5 },
        ],
      },
      {
        name: "Sterile Water",
        description:
          "USP-grade sterile water for single-use peptide reconstitution applications. Free from preservatives and additives, providing the purest reconstitution medium. Recommended when benzyl alcohol sensitivity is a concern in research protocols.",
        variants: [
          { label: "10ml", price: 10 },
          { label: "3ml", price: 5 },
        ],
      },
    ],
  },
];

// Stacks category
const stacks: CategoryInput = {
  name: "Stacks",
  description:
    "Pre-made peptide research stacks combining synergistic compounds for targeted research applications. Each stack is designed for specific research goals at a bundled price.",
  products: [
    {
      name: "Gut Health Stack",
      description:
        "Combines BPC-157 and KPV for comprehensive gut health research. BPC-157 promotes gastrointestinal healing while KPV provides potent anti-inflammatory action targeting intestinal inflammation. Ideal for researchers studying IBD, leaky gut, and GI repair mechanisms.",
      variants: [{ label: "Stack", price: 150 }],
      featured: true,
      tags: ["stack", "gut-health"],
    },
    {
      name: "Bloat Buster Stack",
      description:
        "Pairs BPC-157 with Retatrutide 10mg for research into body composition and GI health. Retatrutide's triple-agonist weight loss properties combine with BPC-157's gut healing effects. Designed for researchers studying metabolic and digestive health synergies.",
      variants: [{ label: "Stack", price: 305 }],
      featured: true,
      tags: ["stack", "weight-loss"],
    },
    {
      name: "Belly Buster Stack",
      description:
        "A comprehensive metabolic research stack combining Retatrutide 10mg, Tesamorelin, and BPC-157. Targets weight loss through triple-agonist activity, visceral fat reduction via GH stimulation, and gut repair. For advanced body composition and metabolic research.",
      variants: [{ label: "Stack", price: 455 }],
      featured: true,
      tags: ["stack", "weight-loss", "metabolic"],
    },
    {
      name: "Weight Loss Stack",
      description:
        "Combines Retatrutide, NAD+, and GHK-Cu for multi-pathway weight management research. Retatrutide drives appetite reduction, NAD+ supports cellular energy metabolism, and GHK-Cu promotes tissue remodeling. A holistic approach to body composition research.",
      variants: [{ label: "Stack", price: 345 }],
      featured: true,
      tags: ["stack", "weight-loss"],
    },
    {
      name: "Baywatch Stack",
      description:
        "Combines Retatrutide, Melanotan-1, and BPC-157 for research on body composition and skin health. Addresses weight loss, melanogenesis, and tissue repair simultaneously. Designed for researchers studying the intersection of metabolic and dermatological pathways.",
      variants: [{ label: "Stack", price: 400 }],
      featured: true,
      tags: ["stack", "weight-loss", "tanning"],
    },
    {
      name: "Healing Stack",
      description:
        "A triple-peptide recovery stack combining BPC-157, TB500, and KPV for comprehensive tissue repair research. Covers local healing, systemic repair, and inflammation modulation. Ideal for injury recovery and wound healing studies.",
      variants: [{ label: "Stack", price: 240 }],
      featured: true,
      tags: ["stack", "recovery", "healing"],
    },
    {
      name: "Recovery Stack",
      description:
        "Combines BPC-157, TB500, and GHK-Cu for advanced regenerative research. BPC-157 and TB500 provide synergistic tissue repair while GHK-Cu adds collagen-boosting and remodeling support. For researchers studying accelerated healing and tissue regeneration.",
      variants: [{ label: "Stack", price: 270 }],
      featured: true,
      tags: ["stack", "recovery"],
    },
    {
      name: "Anti-Aging Stack",
      description:
        "Combines Epithalon, NAD+, and GHK-Cu for multi-target anti-aging research. Epithalon activates telomerase, NAD+ fuels cellular repair enzymes, and GHK-Cu promotes tissue remodeling. A comprehensive approach to longevity and aging research.",
      variants: [{ label: "Stack", price: 285 }],
      featured: true,
      tags: ["stack", "anti-aging", "longevity"],
    },
    {
      name: "Longevity Research Stack",
      description:
        "Pairs Epithalon, NAD+, and SS-31 for cutting-edge longevity research. Targets telomere maintenance, cellular energy metabolism, and mitochondrial function. Designed for researchers studying the fundamental mechanisms of aging.",
      variants: [{ label: "Stack", price: 250 }],
      featured: true,
      tags: ["stack", "longevity"],
    },
    {
      name: "Growth Stack",
      description:
        "Combines CJC-1295, Ipamorelin, and NAD+ for growth hormone and metabolic research. The CJC/Ipamorelin combination provides clean GH stimulation while NAD+ supports cellular energy. For researchers studying GH secretion and metabolic optimization.",
      variants: [{ label: "Stack", price: 300 }],
      featured: true,
      tags: ["stack", "growth-hormone"],
    },
    {
      name: "Cognitive Stack",
      description:
        "A nootropic trio of Semax, Selank, and Pinealon for comprehensive cognitive research. Semax enhances BDNF, Selank modulates GABA for anxiolysis, and Pinealon provides neuroprotection. Designed for researchers studying cognitive enhancement and brain health.",
      variants: [{ label: "Stack", price: 200 }],
      featured: true,
      tags: ["stack", "nootropic", "cognitive"],
    },
    {
      name: "Mental Wellness Stack",
      description:
        "Combines Semax, Selank, and DSIP for research into cognitive function and sleep quality. Addresses both daytime cognitive performance and nighttime recovery through complementary mechanisms. For researchers studying the connection between sleep, stress, and mental performance.",
      variants: [{ label: "Stack", price: 250 }],
      featured: true,
      tags: ["stack", "nootropic", "sleep"],
    },
    {
      name: "Sleep Stack",
      description:
        "Pairs DSIP 15mg, Pinealon 10mg, and Epithalon 10mg for advanced sleep and circadian rhythm research. DSIP promotes delta wave sleep, Pinealon supports pineal gland function, and Epithalon regulates melatonin production. A comprehensive approach to sleep quality research.",
      variants: [{ label: "Stack", price: 160 }],
      featured: true,
      tags: ["stack", "sleep"],
    },
    {
      name: "Skin + Hair Radiance Stack",
      description:
        "Combines GHK-Cu, SNAP-8 Serum, and KPV for dermatological research. GHK-Cu promotes collagen and hair follicle health, SNAP-8 targets expression lines, and KPV reduces skin inflammation. For comprehensive skin rejuvenation and hair growth studies.",
      variants: [{ label: "Stack", price: 205 }],
      featured: true,
      tags: ["stack", "cosmetic", "skin"],
    },
    {
      name: "Glow Stack",
      description:
        "A regenerative skin research stack combining GHK-Cu, TB500, and BPC-157. GHK-Cu boosts collagen synthesis, TB500 promotes angiogenesis and cell migration, and BPC-157 accelerates tissue repair. Designed for advanced wound healing and skin renewal research.",
      variants: [{ label: "Stack", price: 300 }],
      featured: true,
      tags: ["stack", "cosmetic", "recovery"],
    },
    {
      name: "Immune Support Stack",
      description:
        "Combines Thymosin Alpha-1, Thymalin, and KPV for comprehensive immunology research. Thymosin Alpha-1 enhances T-cell function, Thymalin regulates immune balance, and KPV provides anti-inflammatory support. For researchers studying immune modulation and defense mechanisms.",
      variants: [{ label: "Stack", price: 360 }],
      featured: true,
      tags: ["stack", "immune"],
    },
    {
      name: "Energy Stack",
      description:
        "Pairs MOTS-c, SS-31, and NAD+ for mitochondrial and cellular energy research. MOTS-c activates AMPK, SS-31 optimizes electron transport, and NAD+ fuels sirtuins and PARPs. A cutting-edge stack for researchers studying bioenergetics and metabolic performance.",
      variants: [{ label: "Stack", price: 275 }],
      featured: true,
      tags: ["stack", "energy", "mitochondrial"],
    },
  ],
};

async function main() {
  console.log("Seeding ReVia database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Seed all categories and their products
  const allCategories = [...categories, stacks];

  for (const cat of allCategories) {
    const catSlug = slugify(cat.name);
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: catSlug,
        description: cat.description,
      },
    });

    console.log(`Created category: ${category.name}`);

    for (const prod of cat.products) {
      const prodSlug = slugify(prod.name);
      const product = await prisma.product.create({
        data: {
          name: prod.name,
          slug: prodSlug,
          description: prod.description,
          categoryId: category.id,
          featured: prod.featured ?? false,
          tags: JSON.stringify(prod.tags ?? []),
          variants: {
            create: prod.variants.map((v) => ({
              label: v.label,
              price: v.price,
              sku: sku(cat.name, prod.name, v.label),
              inStock: true,
            })),
          },
        },
      });

      console.log(`  Created product: ${product.name} (${prod.variants.length} variant(s))`);
    }
  }

  const productCount = await prisma.product.count();
  const variantCount = await prisma.productVariant.count();
  const categoryCount = await prisma.category.count();

  console.log(`\nSeeding complete!`);
  console.log(`  ${categoryCount} categories`);
  console.log(`  ${productCount} products`);
  console.log(`  ${variantCount} variants`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
