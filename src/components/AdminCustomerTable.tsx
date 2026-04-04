"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  orderCount: number;
  totalSpent?: number;
}

type SortKey = "name" | "email" | "role" | "registered" | "orders" | "spent";
type SortDir = "asc" | "desc" | null;

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="inline h-3.5 w-3.5 ml-1 text-stone-300" />;
  return dir === "asc" ? (
    <ChevronUp className="inline h-3.5 w-3.5 ml-1 text-sky-500" />
  ) : (
    <ChevronDown className="inline h-3.5 w-3.5 ml-1 text-sky-500" />
  );
}

export default function AdminCustomerTable({ customers }: { customers: Customer[] }) {
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

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortKey) {
      case "name":
        return dir * a.name.localeCompare(b.name);
      case "email":
        return dir * a.email.localeCompare(b.email);
      case "role":
        return dir * a.role.localeCompare(b.role);
      case "registered":
        return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "orders":
        return dir * (a.orderCount - b.orderCount);
      case "spent":
        return dir * ((a.totalSpent ?? 0) - (b.totalSpent ?? 0));
      default:
        return 0;
    }
  });

  const columns: { key: SortKey; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "registered", label: "Registered" },
    { key: "orders", label: "Orders" },
    { key: "spent", label: "Total Spent" },
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
          placeholder="Search by name or email..."
          className="w-full max-w-md bg-white/50 border border-sky-200/40 rounded-xl pl-9 pr-4 py-2.5 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-sky-500/50 transition-colors"
        />
      </div>

      <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl overflow-hidden">
        {sorted.length === 0 ? (
          <p className="text-stone-500 text-sm py-12 text-center">
            No customers found.
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
                {sorted.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-sky-100/40 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs font-bold shrink-0">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-stone-800 font-medium">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-800/50">{customer.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.role === "admin"
                            ? "bg-sky-500/20 text-sky-400"
                            : "bg-white/10 text-stone-800/50"
                        }`}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-800/50">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-stone-800/70">
                      {customer.orderCount}
                    </td>
                    <td className="px-6 py-4 text-stone-800 font-medium">
                      {customer.totalSpent ? `$${(customer.totalSpent / 100).toFixed(2)}` : "$0.00"}
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
