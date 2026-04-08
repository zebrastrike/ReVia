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

/**
 * Explicit mapping: "product-slug::variant-label" -> image filename.
 * This avoids guessing filenames — every variant image is mapped directly.
 */
const variantImageMap: Record<string, string> = {
  // Retatrutide
  "retatrutide::5mg": "retatrutide-5mg.png",
  "retatrutide::10mg": "retatrutide-10mg.png",
  "retatrutide::30mg": "retatrutide-30mg.png",
  // Tirzepatide
  "tirzepatide::5mg": "tirzepatide-5mg.png",
  "tirzepatide::10mg": "tirzepatide-10mg.png",
  "tirzepatide::15mg": "tirzepatide-15mg.png",
  // Cagrilintide
  "cagrilintide::5mg": "cagrilintide-5mg.png",
  "cagrilintide::10mg": "cagrilintide-10mg.png",
  // Survodutide
  "survodutide::10mg": "survodutide-10mg.png",
  // CJC-1295 (no DAC)
  "cjc-1295-no-dac::5mg": "cjc-1295-5mg.png",
  "cjc-1295-no-dac::10mg": "cjc-1295-10mg.png",
  // CJC-1295 + Ipamorelin
  "cjc-1295-ipamorelin::5mg / 5mg": "cjc-1295-ipamorelin-5mg-5mg.png",
  // Ipamorelin
  "ipamorelin::5mg": "ipamorelin-5mg.png",
  "ipamorelin-10mg::10mg": "ipamorelin-10mg.png",
  // Sermorelin
  "sermorelin::5mg": "sermorelin-5mg.png",
  "sermorelin-10mg::10mg": "sermorelin-10mg.png",
  // Tesamorelin
  "tesamorelin::5mg": "tesamorelin-5mg.png",
  "tesamorelin-10mg::10mg": "tesamorelin-10mg.png",
  // BPC-157 / TB-500
  "bpc-157-tb-500::5mg / 5mg": "bpc-157-tb-500-5mg-5mg.png",
  "bpc-157-tb-500::10mg / 10mg": "bpc-157-tb-500-10mg-10mg.png",
  // GHK-Cu
  "ghk-cu::100mg": "ghk-cu-100mg.png",
  // Epitalon
  "epitalon::10mg": "epitalon-10mg.png",
  "epitalon-50mg::50mg": "epitalon-50mg.png",
  // MOTS-c
  "mots-c::10mg": "mots-c-10mg.png",
  "mots-c-40mg::40mg": "mots-c-40mg.png",
  // Humanin
  "humanin::5mg": "humanin-5mg.png",
  "humanin-10mg::10mg": "humanin-10mg.png",
  // SS-31
  "ss-31::50mg": "ss-31-50mg.png",
  // SLU-PP-332
  "slu-pp-332::5mg": "slu-pp-332-5mg.png",
  // NAD+
  "nad-plus::100mg": "nad-100mg.png",
  "nad-plus::500mg": "nad-500mg.png",
  // BPC-157
  "bpc-157::5mg": "bpc-157-5mg.png",
  "bpc-157::10mg": "bpc-157-10mg.png",
  // TB-500
  "tb-500::5mg": "tb-500-5mg.png",
  "tb-500::10mg": "tb-500-10mg.png",
  // KPV
  "kpv::5mg": "kpv-5mg.png",
  "kpv::10mg": "kpv-10mg.png",
  // LL-37
  "ll-37::5mg": "ll-37-5mg.png",
  // ARA-290
  "ara-290::10mg": "ara-290-10mg.png",
  // Thymalin
  "thymalin::10mg": "thymalin-10mg.png",
  // Thymosin Alpha-1
  "thymosin-alpha-1::5mg": "thymosinalpha-1-5mg.png",
  "thymosin-alpha-1::10mg": "thymosinalpha-1-10mg.png",
  // VIP
  "vip::5mg": "vip-5mg.png",
  "vip::10mg": "vip-10mg.png",
  // 5-Amino-1MQ
  "5-amino-1mq::5mg": "5-amino-1mq-5mg.png",
  "5-amino-1mq::10mg": "5-amino-1mq-10mg.png",
  // AOD-9604
  "aod-9604::5mg": "aod-9604-5mg.png",
  "aod-9604::10mg": "aod-9604-10mg.png",
  // Adipotide
  "adipotide::5mg": "adipotide-5mg.png",
  // Semaglutide
  "semaglutide::5mg": "semaglutide-5mg.png",
  "semaglutide::10mg": "semaglutide-10mg.png",
  "semaglutide::30mg": "semaglutide-30mg.png",
  // Mazdutide
  "mazdutide::10mg": "mazdutide-10mg.png",
  // HGH Fragment 176-191
  "hgh-fragment-176-191::5mg": "hghfragment176-191-5mg.png",
  // Hexarellin Acetate
  "hexarellin-acetate::5mg": "hexarellinacetate-5mg.png",
  // GHRP-2
  "ghrp-2::5mg": "ghrp-2-5mg.png",
  "ghrp-2::10mg": "ghrp-2-10mg.png",
  // GHRP-6
  "ghrp-6::5mg": "ghrp-6-5mg.png",
  "ghrp-6::10mg": "ghrp-6-10mg.png",
  // IGF-1 LR3
  "igf-1-lr3::0.1mg": "igf-1lr3-01mg.png",
  "igf-1-lr3::1mg": "igf-1lr3-1mg.png",
  // Follistatin-344
  "follistatin-344::1mg": "follistatin-344-1mg.png",
  // AICAR
  "aicar::5mg": "aicar-5mg.png",
  // CJC-1295 with DAC
  "cjc-1295-with-dac::5mg": "cjc-1295withdac-5mg.png",
  // Oxytocin Acetate
  "oxytocin-acetate::2mg": "oxytocinacetate-2mg.png",
  // FOX-04
  "fox-04::10mg": "fox-04-10mg.png",
  // Kisspeptin
  "kisspeptin::5mg": "kisspeptin-5mg.png",
  "kisspeptin::10mg": "kisspeptin-10mg.png",
  // PT-141
  "pt-141::10mg": "pt-141-10mg.png",
  // DSIP
  "dsip::5mg": "dsip-5mg.png",
  "dsip::15mg": "dsip-15mg.png",
  // Melanotan
  "melanotan-1::10mg": "melanotan-1-10mg.png",
  "melanotan-2::10mg": "melanotan-2-10mg.png",
  // SNAP-8
  "snap-8::10mg": "snap-8-10mg.png",
  // Glutathione
  "glutathione::1,500mg": "glutathione-1500mg.png",
  // Selank
  "selank::5mg": "selank-5mg.png",
  "selank::10mg": "selank-10mg.png",
  // Semax
  "semax::5mg": "semax-5mg.png",
  "semax::10mg": "semax-10mg.png",
  // Pinealon
  "pinealon::10mg": "pinealon-10mg.png",
  "pinealon::20mg": "pinealon-20mg.png",
  // Dihexa
  "dihexa::5mg": "dihexa-5mg.png",
  "dihexa::10mg": "dihexa-10mg.png",
  // Cerebrolysin
  "cerebrolysin::60mg (liquid)": "cerebrolysin-60mg.png",
  // Stacks / Blends
  "glow::50/10/10mg": "glow-50-10-10mg.png",
  "klow::50/10/10/10mg": "klow-80mgblend.png",
  "revia-lean::15mg Blended Vial": "lean-15mgblend.png",
  "revia-lean-pro-plus::25mg Blended Vial": "leanpro-25mgblend.png",
  "revia-renew::220mg Blended Vial": "renew-220mgblend.png",
  "revia-sculpt-glow::145mg Blended Vial": "sculptglow-145mgblend.png",
  // L-Carnitine
  "l-carnitine::600mg (liquid)": "l-carnitine-600mg.png",
  // Tirzepatide higher doses
  "tirzepatide-30mg::30mg": "tirzepatide-30mg.png",
  "tirzepatide-60mg::60mg": "tirzepatide-60mg.png",
  // Retatrutide higher dose
  "retatrutide-60mg::60mg": "retatrutide-60mg.png",
};

/**
 * Build a map of variantId -> image path for a product's variants.
 */
export function getVariantImages(
  productSlug: string,
  variants: { id: string; label: string }[],
): Record<string, string> {
  const map: Record<string, string> = {};
  const defaultImg = productImages[productSlug];

  for (const v of variants) {
    const key = `${productSlug}::${v.label}`;
    const filename = variantImageMap[key];
    if (filename) {
      map[v.id] = `/images/products/${filename}`;
    } else if (defaultImg) {
      map[v.id] = defaultImg;
    }
  }

  return map;
}
