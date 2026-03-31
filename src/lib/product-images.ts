/**
 * Local product image overrides.
 * Maps product slugs to local image paths in /public/images/products/.
 * These take priority over the database `image` field.
 * Once all images are finalized, push them to the database and remove this file.
 */
const productImages: Record<string, string> = {
  "retatrutide": "/images/products/retatrutide.png",
  "cagrilintide": "/images/products/cagrilintide.png",
  "tirzepatide": "/images/products/tirzepatide.png",
  "bpc-157-tb-500": "/images/products/bpc-157-tb-500.png",
  "ghk-cu": "/images/products/ghk-cu.png",
};

export function getProductImage(slug: string, dbImage?: string | null): string | null {
  return productImages[slug] ?? dbImage ?? null;
}
