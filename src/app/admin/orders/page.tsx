import { prisma } from "@/lib/prisma";
import AdminOrderTable from "@/components/AdminOrderTable";
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Orders</h1>
        <p className="text-sm text-stone-500">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

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
