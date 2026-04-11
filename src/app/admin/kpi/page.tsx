"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Loader2,
  BarChart3,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface KpiData {
  revenue: {
    thisMonth: number;
    lastMonth: number;
    ytd: number;
    allTime: number;
    monthOverMonth: string | null;
  };
  profitLoss: {
    thisMonthRevenue: number;
    thisMonthCogs: number;
    thisMonthGrossProfit: number;
    thisMonthMargin: string;
    ytdRevenue: number;
    ytdCogs: number;
    ytdGrossProfit: number;
  };
  orders: {
    thisMonth: number;
    lastMonth: number;
    pending: number;
    pendingValue: number;
    avgOrderValue: number;
  };
  customers: { total: number; newThisMonth: number };
  inventory: {
    totalVariants: number;
    outOfStock: number;
    lowStock: number;
    inventoryValue: number;
  };
  topProducts: Array<{ name: string; revenue: number; units: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
  paymentMethods: Record<string, number>;
}

function fmt(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StatCard({ label, value, sub, icon: Icon, trend }: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; trend?: "up" | "down" | null;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</span>
        <Icon size={18} className="text-neutral-300" />
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      {sub && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-neutral-400"}`}>
          {trend === "up" && <TrendingUp size={12} />}
          {trend === "down" && <TrendingDown size={12} />}
          {sub}
        </p>
      )}
    </div>
  );
}

export default function KpiPage() {
  const [data, setData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/kpi")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-neutral-500 py-20 text-center">Failed to load KPI data.</p>;
  }

  const mom = data.revenue.monthOverMonth;
  const momTrend = mom ? (parseFloat(mom) >= 0 ? "up" : "down") : null;
  const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.revenue), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">KPI Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Business performance and P&L overview</p>
      </div>

      {/* ── Top-level KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue (This Month)"
          value={fmt(data.revenue.thisMonth)}
          sub={mom ? `${parseFloat(mom) >= 0 ? "+" : ""}${mom}% vs last month` : "First month"}
          icon={DollarSign}
          trend={momTrend as "up" | "down" | null}
        />
        <StatCard
          label="Orders (This Month)"
          value={String(data.orders.thisMonth)}
          sub={`${data.orders.pending} pending payment`}
          icon={ShoppingCart}
        />
        <StatCard
          label="Avg Order Value"
          value={fmt(data.orders.avgOrderValue)}
          icon={BarChart3}
        />
        <StatCard
          label="Customers"
          value={String(data.customers.total)}
          sub={`+${data.customers.newThisMonth} this month`}
          icon={Users}
          trend={data.customers.newThisMonth > 0 ? "up" : null}
        />
      </div>

      {/* ── P&L Section ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">Profit & Loss</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">This Month Revenue</p>
            <p className="text-xl font-bold text-neutral-900">{fmt(data.profitLoss.thisMonthRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">COGS (Est.)</p>
            <p className="text-xl font-bold text-red-600">{fmt(data.profitLoss.thisMonthCogs)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Gross Profit</p>
            <p className={`text-xl font-bold ${data.profitLoss.thisMonthGrossProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {fmt(data.profitLoss.thisMonthGrossProfit)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Gross Margin</p>
            <p className="text-xl font-bold text-neutral-900">{data.profitLoss.thisMonthMargin}%</p>
          </div>
        </div>

        <hr className="my-4 border-neutral-100" />

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">YTD Revenue</p>
            <p className="text-lg font-semibold text-neutral-800">{fmt(data.profitLoss.ytdRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">YTD COGS</p>
            <p className="text-lg font-semibold text-red-500">{fmt(data.profitLoss.ytdCogs)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">YTD Gross Profit</p>
            <p className={`text-lg font-semibold ${data.profitLoss.ytdGrossProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {fmt(data.profitLoss.ytdGrossProfit)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Revenue Chart (bar chart) ── */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Monthly Revenue (6 Months)</h2>
          <div className="flex items-end gap-3 h-48">
            {data.monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-neutral-500 font-medium">{fmt(m.revenue)}</span>
                <div
                  className="w-full bg-sky-500 rounded-t-lg transition-all min-h-[4px]"
                  style={{ height: `${Math.max((m.revenue / maxRevenue) * 160, 4)}px` }}
                />
                <span className="text-xs text-neutral-400">{m.month}</span>
                <span className="text-[10px] text-neutral-300">{m.orders} orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top Products ── */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Top Products (This Month)</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-neutral-400 py-8 text-center">No sales this month yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-300 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.units} units</p>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">{fmt(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Inventory Health ── */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Inventory Health</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Active SKUs</span>
              <span className="text-sm font-semibold">{data.inventory.totalVariants}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 flex items-center gap-1">
                <AlertTriangle size={13} className="text-red-500" /> Out of Stock
              </span>
              <span className="text-sm font-semibold text-red-600">{data.inventory.outOfStock}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 flex items-center gap-1">
                <AlertTriangle size={13} className="text-amber-500" /> Low Stock
              </span>
              <span className="text-sm font-semibold text-amber-600">{data.inventory.lowStock}</span>
            </div>
            <hr className="border-neutral-100" />
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Inventory Value (cost)</span>
              <span className="text-sm font-semibold">{fmt(data.inventory.inventoryValue)}</span>
            </div>
          </div>
        </div>

        {/* ── Payment Methods ── */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Payment Methods (This Month)</h2>
          {Object.keys(data.paymentMethods).length === 0 ? (
            <p className="text-sm text-neutral-400 py-4 text-center">No orders this month.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.paymentMethods).map(([method, count]) => (
                <div key={method} className="flex justify-between">
                  <span className="text-sm text-neutral-600 capitalize">{method === "bitcoin" ? "Bitcoin" : method === "wire" ? "Wire Transfer" : method.charAt(0).toUpperCase() + method.slice(1)}</span>
                  <span className="text-sm font-semibold">{count} order{count !== 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Revenue Summary ── */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Revenue Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">This Month</span>
              <span className="text-sm font-semibold">{fmt(data.revenue.thisMonth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Last Month</span>
              <span className="text-sm font-semibold">{fmt(data.revenue.lastMonth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Year to Date</span>
              <span className="text-sm font-semibold">{fmt(data.revenue.ytd)}</span>
            </div>
            <hr className="border-neutral-100" />
            <div className="flex justify-between">
              <span className="text-sm font-medium text-neutral-800">All Time</span>
              <span className="text-sm font-bold text-neutral-900">{fmt(data.revenue.allTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Pending Payment</span>
              <span className="text-sm font-semibold text-amber-600">{fmt(data.orders.pendingValue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
