import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import CompareClient from "@/components/CompareClient";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Compare Research Compounds | ReVia",
};

export default async function ComparePage() {
  const tier = await getActiveTier();

  const products = await prisma.product.findMany({
    where: { active: true },
    include: { variants: true, category: true },
    orderBy: { name: "asc" },
  });

  const serialized = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    categoryName: p.category.name,
    coaUrl: p.coaUrl,
    variants: p.variants.map((v) => ({
      label: v.label,
      price: resolvePriceForVariant(v, tier),
      stockStatus: v.stockStatus,
    })),
  }));

  return <CompareClient products={serialized} />;
}
