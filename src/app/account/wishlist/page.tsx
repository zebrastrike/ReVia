import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import RemoveWishlistButton from "./RemoveWishlistButton";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Wishlist | ReVia",
};

export default async function WishlistPage() {
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);

  if (!user) {
    redirect("/login");
  }

  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          variants: true,
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-6 w-6 text-red-500" />
        <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-sky-200/40 bg-white/5 px-6 py-20 text-center backdrop-blur-xl">
          <Heart className="mb-4 h-12 w-12 text-gray-600" />
          <h2 className="text-lg font-semibold text-white">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Save products you love for later.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((item) => {
            const product = item.product;
            const cheapest = product.variants.length
              ? product.variants.reduce(
                  (min, v) => (v.price < min.price ? v : min),
                  product.variants[0]
                )
              : null;
            const categoryName = product.category?.name ?? "Peptide";
            const initial = categoryName.charAt(0).toUpperCase();

            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-sky-200/40 bg-white/60 backdrop-blur-sm transition-colors hover:border-sky-300"
              >
                <Link href={`/shop/${product.slug}`}>
                  {/* Image */}
                  <div className="relative aspect-square w-full overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-sky-900/40 to-sky-700/20">
                        <span className="text-5xl font-bold text-sky-500/60">
                          {initial}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-sky-500/80">
                      {categoryName}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-gray-100 line-clamp-2">
                      {product.name}
                    </h3>
                    {cheapest && (
                      <p className="mt-2 text-sm font-medium text-gray-300">
                        {product.variants.length > 1 ? "From " : ""}$
                        {cheapest.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Remove button */}
                <div className="border-t border-white/5 px-4 py-3">
                  <RemoveWishlistButton productId={product.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
