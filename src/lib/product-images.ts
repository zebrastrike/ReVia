/**
 * Local product image overrides.
 * Maps product slugs to local image paths in /public/images/products/.
 * These take priority over the database `image` field.
 */
const productImages: Record<string, string> = {
  // Weight Management
  "retatrutide": "/images/products/retatrutide-5mg.png",
  "tirzepatide": "/images/products/tirzepatide-5mg.png",
  "cagrilintide": "/images/products/cagrilintide-5mg.png",
  "survodutide": "/images/products/survodutide-10mg.png",
  "semaglutide": "/images/products/semaglutide-5mg.png",
  "mazdutide": "/images/products/mazdutide-10mg.png",
  "5-amino-1mq": "/images/products/5-amino-1mq-5mg.png",
  "aod-9604": "/images/products/aod-9604-5mg.png",
  "adipotide": "/images/products/adipotide-5mg.png",
  "tirzepatide-30mg": "/images/products/tirzepatide-30mg.png",
  "tirzepatide-60mg": "/images/products/tirzepatide-60mg.png",
  "retatrutide-60mg": "/images/products/retatrutide-60mg.png",
  "mots-c-40mg": "/images/products/mots-c-40mg.png",
  "l-carnitine": "/images/products/l-carnitine-600mg.png",

  // Growth Hormone
  "cjc-1295-no-dac": "/images/products/cjc-1295-5mg.png",
  "cjc-1295-ipamorelin": "/images/products/cjc-1295-ipamorelin-5mg-5mg.png",
  "ipamorelin": "/images/products/ipamorelin-5mg.png",
  "sermorelin": "/images/products/sermorelin-5mg.png",
  "tesamorelin": "/images/products/tesamorelin-5mg.png",
  "ipamorelin-10mg": "/images/products/ipamorelin-10mg.png",
  "sermorelin-10mg": "/images/products/sermorelin-10mg.png",
  "tesamorelin-10mg": "/images/products/tesamorelin-10mg.png",
  "cjc-1295-with-dac": "/images/products/cjc-1295withdac-5mg.png",
  "ghrp-2": "/images/products/ghrp-2-5mg.png",
  "ghrp-6": "/images/products/ghrp-6-5mg.png",
  "hgh-fragment-176-191": "/images/products/hghfragment176-191-5mg.png",
  "hexarellin-acetate": "/images/products/hexarellinacetate-5mg.png",
  "igf-1-lr3": "/images/products/igf-1lr3-01mg.png",
  "follistatin-344": "/images/products/follistatin-344-1mg.png",
  "aicar": "/images/products/aicar-5mg.png",

  // Recovery
  "bpc-157-tb-500": "/images/products/bpc-157-tb-500-5mg-5mg.png",
  "ghk-cu": "/images/products/ghk-cu-100mg.png",
  "bpc-157": "/images/products/bpc-157-5mg.png",
  "tb-500": "/images/products/tb-500-5mg.png",
  "kpv": "/images/products/kpv-5mg.png",

  // Anti-inflammatory / Antimicrobial / Neuroprotective
  "ll-37": "/images/products/ll-37-5mg.png",
  "ara-290": "/images/products/ara-290-10mg.png",

  // Immune
  "thymalin": "/images/products/thymalin-10mg.png",
  "thymosin-alpha-1": "/images/products/thymosinalpha-1-5mg.png",

  // Neuropeptide
  "vip": "/images/products/vip-5mg.png",

  // Longevity
  "epitalon": "/images/products/epitalon-10mg.png",
  "epitalon-50mg": "/images/products/epitalon-50mg.png",
  "fox-04": "/images/products/fox-04-10mg.png",

  // Mitochondrial
  "mots-c": "/images/products/mots-c-10mg.png",
  "humanin": "/images/products/humanin-5mg.png",
  "humanin-10mg": "/images/products/humanin-10mg.png",
  "ss-31": "/images/products/ss-31-50mg.png",
  "slu-pp-332": "/images/products/slu-pp-332-5mg.png",
  "nad-plus": "/images/products/nad-100mg.png",
  "ss-31-elamipretide": "/images/products/ss-31-elamipretide-10mg.png",
  "slu-pp-332-future": "/images/products/slu-pp-332-5mg.png",

  // Hormone
  "oxytocin-acetate": "/images/products/oxytocinacetate-2mg.png",

  // Reproductive / Sexual Health
  "kisspeptin": "/images/products/kisspeptin-5mg.png",
  "pt-141": "/images/products/pt-141-10mg.png",

  // Sleep
  "dsip": "/images/products/dsip-5mg.png",

  // Tanning
  "melanotan-1": "/images/products/melanotan-1-10mg.png",
  "melanotan-2": "/images/products/melanotan-2-10mg.png",

  // Cosmetic
  "snap-8": "/images/products/snap-8-10mg.png",

  // Stacks / Blends
  "glow": "/images/products/glow-50-10-10mg.png",
  "klow": "/images/products/klow-80mgblend.png",
  "revia-lean": "/images/products/lean-15mgblend.png",
  "revia-lean-pro-plus": "/images/products/leanpro-25mgblend.png",
  "revia-renew": "/images/products/renew-220mgblend.png",
  "revia-sculpt-glow": "/images/products/sculptglow-145mgblend.png",

  // Antioxidant
  "glutathione": "/images/products/glutathione-1500mg.png",

  // Nootropic
  "selank": "/images/products/selank-5mg.png",
  "semax": "/images/products/semax-5mg.png",
  "pinealon": "/images/products/pinealon-10mg.png",
  "dihexa": "/images/products/dihexa-5mg.png",
  "cerebrolysin": "/images/products/cerebrolysin-60mg.png",
};

export function getProductImage(slug: string, dbImage?: string | null): string | null {
  return productImages[slug] ?? dbImage ?? null;
}
