import { prisma } from "@/lib/prisma";
import { Clock, Package } from "lucide-react";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function PreOrdersPage() {
  const preOrderVariants = await prisma.productVariant.findMany({
    where: { stockStatus: "pre_order" },
    include: { product: { select: { name: true, slug: true, active: true } } },
    orderBy: { product: { name: "asc" } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Pre-Order Queue</h1>
          <p className="text-sm text-stone-500 mt-1">
            {preOrderVariants.length} variant{preOrderVariants.length !== 1 ? "s" : ""} on pre-order
          </p>
        </div>
        <Link
          href="/admin/inventory"
          className="rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-sky-500 transition-colors"
        >
          Manage Inventory
        </Link>
      </div>

      {preOrderVariants.length === 0 ? (
        <div className="bg-white/50 border border-sky-200/40 rounded-2xl p-12 text-center">
          <Package className="mx-auto h-10 w-10 text-stone-300 mb-3" />
          <p className="text-stone-500 text-sm">No products currently on pre-order.</p>
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stone-500 border-b border-sky-200/40 bg-white/50">
                <th className="text-left px-6 py-4 font-medium">Product</th>
                <th className="text-left px-6 py-4 font-medium">SKU</th>
                <th className="text-right px-6 py-4 font-medium">Current Qty</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {preOrderVariants.map((v) => (
                <tr key={v.id} className="border-b border-sky-100/40 hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-stone-800">
                      {v.product.name} — {v.label}
                    </p>
                    {!v.product.active && (
                      <span className="text-xs text-stone-400">(hidden from shop)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-stone-500">{v.sku}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-bold ${v.quantity === 0 ? "text-red-500" : "text-amber-600"}`}>
                      {v.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                      <Clock size={13} />
                      Pre-Order (Est. ships 5-7 days)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
