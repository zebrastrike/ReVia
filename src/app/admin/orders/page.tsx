import { prisma } from "@/lib/prisma";
import AdminOrderTable from "@/components/AdminOrderTable";
import { Clock, Package } from "lucide-react";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [orders, preOrderVariants] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true, items: true },
    }),
    prisma.productVariant.findMany({
      where: { stockStatus: "pre_order" },
      include: { product: { select: { name: true, active: true } } },
      orderBy: { product: { name: "asc" } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Orders</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/api/admin/orders/export"
            className="rounded-xl border border-sky-200/40 bg-white/50 px-4 py-2 text-xs font-medium text-stone-600 hover:bg-sky-50 transition-colors"
          >
            Export CSV
          </Link>
          <p className="text-sm text-stone-500">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Pre-Order Queue */}
      {preOrderVariants.length > 0 && (
        <div className="bg-white/50 backdrop-blur border border-amber-200/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-stone-800">
              Pre-Order Queue
            </h2>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              {preOrderVariants.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {preOrderVariants.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-lg border border-amber-200/40 bg-amber-50/40 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-stone-700 truncate">
                    {v.product.name} — {v.label}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 shrink-0 ml-2">
                  <Clock size={10} />
                  Est. ships 5-7 days
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdminOrderTable
        orders={orders.map((o) => ({
          id: o.id,
          name: o.name,
          email: o.email,
          itemCount: o.items.length,
          total: o.total,
          status: o.status,
          createdAt: o.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
