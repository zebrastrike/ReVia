"use client";

import { useState } from "react";
import { Shield, ShieldOff, KeyRound, Search, Loader2, Check } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  orderCount: number;
}

export default function UserManagementTable({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "customer">("all");

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || u.role === filter;
    return matchesSearch && matchesFilter;
  });

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    setLoading(userId);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setMessage({
        type: "success",
        text: `${data.user.name} is now ${newRole === "admin" ? "an admin" : "a customer"}`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update role",
      });
    } finally {
      setLoading(null);
    }
  }

  async function handleResetPassword(userId: string) {
    if (!newPassword || newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    setLoading(userId);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage({ type: "success", text: "Password reset successfully" });
      setResetPasswordId(null);
      setNewPassword("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to reset password",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-sky-500/30 bg-sky-50 text-sky-700"
              : "border-red-300 bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-sky-200/40 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "admin", "customer"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                filter === f
                  ? "bg-sky-400 text-white"
                  : "bg-white/50 border border-sky-200/40 text-stone-600 hover:bg-sky-50"
              }`}
            >
              {f === "all" ? "All" : f === "admin" ? "Admins" : "Customers"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-sky-200/40 bg-white/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sky-100 text-left">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">User</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Role</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 hidden sm:table-cell">Email Verified</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 hidden md:table-cell">Orders</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 hidden md:table-cell">Joined</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100/50">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-sky-50/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-800">{u.name}</p>
                  <p className="text-xs text-stone-400">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {u.role === "admin" ? <Shield className="h-3 w-3" /> : null}
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {u.emailVerified ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-xs text-stone-400">Unverified</span>
                  )}
                </td>
                <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{u.orderCount}</td>
                <td className="px-4 py-3 text-stone-400 text-xs hidden md:table-cell">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleRole(u.id, u.role)}
                      disabled={loading === u.id}
                      title={u.role === "admin" ? "Remove admin" : "Make admin"}
                      className={`rounded-lg p-2 text-xs font-medium transition ${
                        u.role === "admin"
                          ? "text-red-500 hover:bg-red-50"
                          : "text-sky-600 hover:bg-sky-50"
                      }`}
                    >
                      {loading === u.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : u.role === "admin" ? (
                        <ShieldOff className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setResetPasswordId(resetPasswordId === u.id ? null : u.id);
                        setNewPassword("");
                      }}
                      title="Reset password"
                      className="rounded-lg p-2 text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition"
                    >
                      <KeyRound className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Password reset inline */}
                  {resetPasswordId === u.id && (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (8+ chars)"
                        className="flex-1 rounded-lg border border-sky-200/40 bg-white px-3 py-1.5 text-xs outline-none focus:border-sky-500/50"
                      />
                      <button
                        onClick={() => handleResetPassword(u.id)}
                        disabled={loading === u.id}
                        className="rounded-lg bg-sky-400 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-50"
                      >
                        {loading === u.id ? "..." : "Reset"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-stone-400">No users found.</p>
        )}
      </div>
    </div>
  );
}
