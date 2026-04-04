import { prisma } from "@/lib/prisma";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowRight,
  AlertTriangle,
  Download,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    orderCount,
    revenueResult,
    productCount,
    customerCount,
    recentOrders,
    lowStockVariants,
    topSellingItems,
    dailyRevenue,
    preOrderCount,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.count(),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
    prisma.productVariant
      .findMany({
        where: { reorderThreshold: { gt: 0 } },
        include: { product: { select: { name: true, active: true } } },
        orderBy: { quantity: "asc" },
      })
      .then((variants) => variants.filter((v) => v.quantity <= v.reorderThreshold)),
    // Top selling products by quantity ordered
    prisma.orderItem
      .groupBy({
        by: ["productName"],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 8,
      })
      .catch(() => []),
    // Daily revenue for last 30 days
    prisma.order
      .findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      })
      .catch(() => []),
    // Pre-order variant count
    prisma.productVariant.count({ where: { stockStatus: "pre_order" } }).catch(() => 0),
  ]);

  const revenue = revenueResult?._sum?.total ?? 0;

  // Build daily revenue chart data (last 14 days)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const revenueByDay: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    revenueByDay[d.toISOString().split("T")[0]] = 0;
  }
  dailyRevenue.forEach((order) => {
    const key = order.createdAt.toISOString().split("T")[0];
    if (key in revenueByDay) {
      revenueByDay[key] += order.total;
    }
  });
  const chartData = Object.entries(revenueByDay).map(([date, total]) => ({ date, total }));
  const maxRevenue = Math.max(...chartData.map((d) => d.total), 1);

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Dashboard Overview</h1>
        <p className="text-xs text-stone-400">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

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
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 rounded-xl border border-sky-200/40 bg-white/50 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-sky-50 transition-colors"
        >
          <Clock size={16} className="text-amber-500" />
          Pre-Orders
          {preOrderCount > 0 && (
            <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              {preOrderCount}
            </span>
          )}
        </Link>
        <Link
          href="/admin/orders/export"
          className="flex items-center gap-3 rounded-xl border border-sky-200/40 bg-white/50 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-sky-50 transition-colors"
        >
          <Download size={16} className="text-sky-500" />
          Export Orders
        </Link>
      </div>

      {/* Revenue Chart + Top Sellers side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-sky-500" />
              <h2 className="text-lg font-semibold text-stone-800">Revenue (14 days)</h2>
            </div>
            <p className="text-sm font-medium text-stone-600">
              ${chartData.reduce((s, d) => s + d.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex items-end gap-1 h-36">
            {chartData.map((d) => {
              const height = maxRevenue > 0 ? (d.total / maxRevenue) * 100 : 0;
              const dayLabel = new Date(d.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group" title={`${dayLabel}: $${d.total.toFixed(2)}`}>
                  <div
                    className="w-full rounded-t-sm bg-sky-400/70 hover:bg-sky-500 transition-colors min-h-[2px]"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-stone-400">
            <span>{chartData[0]?.date ? new Date(chartData[0].date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
            <span>Today</span>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-sky-500" />
              <h2 className="text-lg font-semibold text-stone-800">Top Sellers</h2>
            </div>
          </div>
          {topSellingItems.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {topSellingItems.map((item, i) => {
                const totalQty = item._sum.quantity ?? 0;
                const totalRev = item._sum.price ?? 0;
                const maxQty = topSellingItems[0]?._sum?.quantity ?? 1;
                const barWidth = (totalQty / maxQty) * 100;
                return (
                  <div key={item.productName} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-stone-400 w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-stone-800 truncate">{item.productName}</p>
                        <p className="text-xs text-stone-500 shrink-0 ml-2">{totalQty} sold · ${(totalRev / 100).toFixed(0)}</p>
                      </div>
                      <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div className="h-full rounded-full bg-sky-400" style={{ width: `${barWidth}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockVariants.length > 0 && (
        <div className="bg-white/50 backdrop-blur border border-amber-200/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                <AlertTriangle size={20} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-800">Low Stock Alerts</h2>
                <p className="text-xs text-stone-500">
                  {lowStockVariants.length} product{lowStockVariants.length !== 1 ? "s" : ""} need
                  {lowStockVariants.length === 1 ? "s" : ""} reordering
                </p>
              </div>
            </div>
            <Link
              href="/admin/inventory"
              className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              Manage Inventory <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockVariants.map((v) => (
              <div
                key={v.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  v.quantity === 0 ? "border-red-200/60 bg-red-50/50" : "border-amber-200/60 bg-amber-50/50"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {v.product.name} — {v.label}
                  </p>
                  <p className="text-xs text-stone-500">Reorder at {v.reorderThreshold} units</p>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <p className={`text-lg font-bold ${v.quantity === 0 ? "text-red-600" : "text-amber-600"}`}>{v.quantity}</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wide">in stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          <p className="text-stone-500 text-sm py-8 text-center">No orders yet.</p>
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
                  <tr key={order.id} className="border-b border-sky-100/40 hover:bg-white/50 transition-colors">
                    <td className="py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-sky-400 hover:underline font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="py-3 text-stone-800/70">{order.name}</td>
                    <td className="py-3 text-stone-800 font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-500/20 text-stone-500"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-stone-800/50">{order.createdAt.toLocaleDateString()}</td>
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
