"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";
import ProductVisibilityToggle from "@/components/ProductVisibilityToggle";
import FeaturedToggle from "@/components/FeaturedToggle";

interface Product {
  id: string;
  name: string;
  active: boolean;
  featured: boolean;
  category: { name: string };
  variants: { price: number; label: string }[];
}

type SortKey = "name" | "category" | "variants" | "price" | "featured" | "visibility";
type SortDir = "asc" | "desc" | null;

function getLowestPrice(variants: { price: number; label: string }[]) {
  return variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : null;
}

export default function AdminProductTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  function handleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const filtered = products.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.name.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const dir = sortDir === "asc" ? 1 : -1;

    switch (sortKey) {
      case "name":
        return dir * a.name.localeCompare(b.name);
      case "category":
        return dir * a.category.name.localeCompare(b.category.name);
      case "variants":
        return dir * (a.variants.length - b.variants.length);
      case "price": {
        const ap = getLowestPrice(a.variants) ?? 0;
        const bp = getLowestPrice(b.variants) ?? 0;
        return dir * (ap - bp);
      }
      case "featured":
        return dir * (Number(a.featured) - Number(b.featured));
      case "visibility":
        return dir * (Number(a.active) - Number(b.active));
      default:
        return 0;
    }
  });

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) {
      return <ChevronsUpDown className="inline h-3.5 w-3.5 ml-1 text-stone-300" />;
    }
    return sortDir === "asc" ? (
      <ChevronUp className="inline h-3.5 w-3.5 ml-1 text-sky-500" />
    ) : (
      <ChevronDown className="inline h-3.5 w-3.5 ml-1 text-sky-500" />
    );
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "variants", label: "Variants" },
    { key: "price", label: "Lowest Price" },
    { key: "featured", label: "Featured" },
    { key: "visibility", label: "Visibility" },
  ];

  return (
    <>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or category..."
          className="w-full max-w-md bg-white/50 border border-sky-200/40 rounded-xl pl-9 pr-4 py-2.5 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-sky-500/50 transition-colors"
        />
      </div>

    <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl overflow-hidden">
      {sorted.length === 0 ? (
        <p className="text-stone-500 text-sm py-12 text-center">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stone-500 border-b border-sky-200/40 bg-white/500">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left px-6 py-4 font-medium cursor-pointer select-none hover:text-stone-700 transition-colors"
                  >
                    {col.label}
                    <SortIcon column={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((product) => {
                const lowestPrice = getLowestPrice(product.variants);

                return (
                  <tr
                    key={product.id}
                    className={`border-b border-sky-100/40 hover:bg-white/50 transition-colors ${!product.active ? "opacity-60" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-sky-400 hover:underline font-medium"
                      >
                        {product.name}
                      </Link>
                      {product.variants.length > 0 && (
                        <p className="text-xs text-stone-400 mt-0.5">
                          {product.variants.map((v) => v.label).join(" · ")}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-stone-800/50">{product.category.name}</td>
                    <td className="px-6 py-4 text-stone-800/50">{product.variants.length}</td>
                    <td className="px-6 py-4 text-stone-800 font-medium">
                      {lowestPrice !== null ? `$${(lowestPrice / 100).toFixed(2)}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <FeaturedToggle productId={product.id} initialFeatured={product.featured} />
                    </td>
                    <td className="px-6 py-4">
                      <ProductVisibilityToggle productId={product.id} initialActive={product.active} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}
