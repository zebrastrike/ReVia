import { prisma } from "@/lib/prisma";
import { Users, DollarSign, Repeat, TrendingUp } from "lucide-react";
import AdminCustomerTable from "@/components/AdminCustomerTable";
export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { orders: true } },
      orders: { select: { total: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalCustomers = users.filter((u) => u.role === "customer").length;
  const repeatBuyers = users.filter((u) => u._count.orders > 1).length;
  const totalLifetimeValue = users.reduce((sum, u) => sum + u.orders.reduce((s, o) => s + o.total, 0), 0);
  const avgOrderValue = users.reduce((sum, u) => sum + u._count.orders, 0);
  const avgSpend = avgOrderValue > 0 ? totalLifetimeValue / avgOrderValue : 0;

  const insights = [
    { label: "Total Customers", value: totalCustomers.toLocaleString(), icon: Users, color: "text-sky-500", bg: "bg-sky-50" },
    { label: "Repeat Buyers", value: repeatBuyers.toLocaleString(), icon: Repeat, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Lifetime Revenue", value: `$${totalLifetimeValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-sky-500", bg: "bg-sky-50" },
    { label: "Avg Order Value", value: `$${avgSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Customers</h1>
        <p className="text-sm text-stone-500">
          {users.length} user{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white/50 border border-sky-200/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                  <Icon size={16} className={item.color} />
                </div>
                <span className="text-xs text-stone-500">{item.label}</span>
              </div>
              <p className="text-xl font-bold text-stone-800">{item.value}</p>
            </div>
          );
        })}
      </div>

      <AdminCustomerTable
        customers={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt.toISOString(),
          orderCount: u._count.orders,
          totalSpent: u.orders.reduce((s, o) => s + o.total, 0),
        }))}
      />
    </div>
  );
}
