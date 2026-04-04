"use client";

import { useState } from "react";
import { Download, Search, Mail } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function NewsletterTable({ subscribers }: { subscribers: Subscriber[] }) {
  const [search, setSearch] = useState("");

  const filtered = subscribers.filter((s) =>
    search ? s.email.toLowerCase().includes(search.toLowerCase()) : true
  );

  function exportCsv() {
    const csv = ["Email,Subscribed Date", ...filtered.map((s) => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revia-newsletter-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emails..."
            className="w-full max-w-md bg-white/50 border border-sky-200/40 rounded-xl pl-9 pr-4 py-2.5 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-sky-500/50 transition-colors"
          />
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-sky-500 transition-colors"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="mx-auto h-10 w-10 text-stone-300 mb-3" />
            <p className="text-stone-500 text-sm">No subscribers yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stone-500 border-b border-sky-200/40 bg-white/50">
                <th className="text-left px-6 py-4 font-medium">Email</th>
                <th className="text-left px-6 py-4 font-medium">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-sky-100/40 hover:bg-white/50 transition-colors">
                  <td className="px-6 py-3 text-stone-800">{s.email}</td>
                  <td className="px-6 py-3 text-stone-500">
                    {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
