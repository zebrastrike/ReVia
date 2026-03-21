import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Star } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;

  const searchQuery = typeof q === "string" ? q : undefined;

  const products = await prisma.product.findMany({
    where: searchQuery
      ? { name: { contains: searchQuery } }
      : undefined,
    include: {
      category: true,
      variants: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <p className="text-sm text-white/40">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <form className="flex gap-3">
        <input
          type="text"
          name="q"
          defaultValue={searchQuery ?? ""}
          placeholder="Search products by name..."
          className="flex-1 max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Search
        </button>
      </form>

      {/* Products Table */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        {products.length === 0 ? (
          <p className="text-white/40 text-sm py-12 text-center">
            No products found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-6 py-4 font-medium">Name</th>
                  <th className="text-left px-6 py-4 font-medium">Category</th>
                  <th className="text-left px-6 py-4 font-medium">Variants</th>
                  <th className="text-left px-6 py-4 font-medium">
                    Lowest Price
                  </th>
                  <th className="text-left px-6 py-4 font-medium">Featured</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const lowestPrice =
                    product.variants.length > 0
                      ? Math.min(...product.variants.map((v) => v.price))
                      : null;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="text-emerald-400 hover:underline font-medium"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-white/50">
                        {product.category.name}
                      </td>
                      <td className="px-6 py-4 text-white/50">
                        {product.variants.length}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {lowestPrice !== null ? `$${lowestPrice.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {product.featured ? (
                          <Star
                            size={16}
                            className="text-yellow-400 fill-yellow-400"
                          />
                        ) : (
                          <Star size={16} className="text-white/20" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
