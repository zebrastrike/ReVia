import { prisma } from "@/lib/prisma";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [orderCount, revenueResult, productCount, customerCount, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count(),
      prisma.user.count({ where: { role: "customer" } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
    ]);

  const revenue = revenueResult._sum.total ?? 0;

  const stats = [
    {
      label: "Total Orders",
      value: orderCount.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: "Total Revenue",
      value: `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-sky-400",
      bgColor: "bg-sky-400/10",
    },
    {
      label: "Products",
      value: productCount.toLocaleString(),
      icon: Package,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      label: "Customers",
      value: customerCount.toLocaleString(),
      icon: Users,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    processing: "bg-blue-500/20 text-blue-400",
    shipped: "bg-purple-500/20 text-purple-400",
    delivered: "bg-sky-500/20 text-sky-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-stone-800">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-stone-800/50">{stat.label}</span>
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                >
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-stone-800">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-stone-500 text-sm py-8 text-center">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-stone-500 border-b border-sky-200/40">
                  <th className="text-left pb-3 font-medium">Order ID</th>
                  <th className="text-left pb-3 font-medium">Customer</th>
                  <th className="text-left pb-3 font-medium">Total</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-sky-100/40 hover:bg-white/50 transition-colors"
                  >
                    <td className="py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sky-400 hover:underline font-mono text-xs"
                      >
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="py-3 text-stone-800/70">{order.name}</td>
                    <td className="py-3 text-stone-800 font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-500/20 text-stone-500"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-stone-800/50">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
