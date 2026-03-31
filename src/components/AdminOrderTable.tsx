"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";

interface Order {
  id: string;
  name: string;
  email: string;
  itemCount: number;
  total: number;
  status: string;
  createdAt: string;
}

type SortKey = "id" | "customer" | "email" | "items" | "total" | "status" | "date";
type SortDir = "asc" | "desc" | null;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-sky-500/20 text-sky-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const statusRank: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 4,
};

const allStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="inline h-3.5 w-3.5 ml-1 text-stone-300" />;
  return dir === "asc" ? (
    <ChevronUp className="inline h-3.5 w-3.5 ml-1 text-sky-500" />
  ) : (
    <ChevronDown className="inline h-3.5 w-3.5 ml-1 text-sky-500" />
  );
}

export default function AdminOrderTable({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
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

  const filtered = orders.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !o.name.toLowerCase().includes(q) &&
        !o.email.toLowerCase().includes(q) &&
        !o.id.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortKey) {
      case "id":
        return dir * a.id.localeCompare(b.id);
      case "customer":
        return dir * a.name.localeCompare(b.name);
      case "email":
        return dir * a.email.localeCompare(b.email);
      case "items":
        return dir * (a.itemCount - b.itemCount);
      case "total":
        return dir * (a.total - b.total);
      case "status":
        return dir * ((statusRank[a.status] ?? 5) - (statusRank[b.status] ?? 5));
      case "date":
        return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default:
        return 0;
    }
  });

  const columns: { key: SortKey; label: string }[] = [
    { key: "id", label: "Order ID" },
    { key: "customer", label: "Customer" },
    { key: "email", label: "Email" },
    { key: "items", label: "Items" },
    { key: "total", label: "Total" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ];

  return (
    <>
      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            !statusFilter
              ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
              : "bg-white/50 text-stone-800/50 border border-sky-200/40 hover:text-stone-800 hover:bg-sky-50"
          }`}
        >
          All
        </button>
        {allStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? null : s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              statusFilter === s
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                : "bg-white/50 text-stone-800/50 border border-sky-200/40 hover:text-stone-800 hover:bg-sky-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or order ID..."
          className="w-full max-w-md bg-white/50 border border-sky-200/40 rounded-xl pl-9 pr-4 py-2.5 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-sky-500/50 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl overflow-hidden">
        {sorted.length === 0 ? (
          <p className="text-stone-500 text-sm py-12 text-center">
            No orders found.
          </p>
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
                      <SortIcon active={sortKey === col.key} dir={sortKey === col.key ? sortDir : null} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-sky-100/40 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sky-400 hover:underline font-mono text-xs"
                      >
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-stone-800/80">{order.name}</td>
                    <td className="px-6 py-4 text-stone-800/50">{order.email}</td>
                    <td className="px-6 py-4 text-stone-800/50">{order.itemCount}</td>
                    <td className="px-6 py-4 text-stone-800 font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] ?? "bg-gray-500/20 text-stone-500"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-800/50">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
