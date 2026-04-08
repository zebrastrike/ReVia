export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Shield } from "lucide-react";
import UserManagementTable from "./UserManagementTable";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    orderCount: u._count.orders,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-sky-500" />
        <h1 className="text-2xl font-bold text-stone-800">User Management</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-sky-200/40 bg-white/50 p-4">
          <p className="text-2xl font-bold text-stone-800">{users.length}</p>
          <p className="text-xs text-stone-500 mt-1">Total Users</p>
        </div>
        <div className="rounded-xl border border-sky-200/40 bg-white/50 p-4">
          <p className="text-2xl font-bold text-stone-800">
            {users.filter((u) => u.role === "admin").length}
          </p>
          <p className="text-xs text-stone-500 mt-1">Admins</p>
        </div>
        <div className="rounded-xl border border-sky-200/40 bg-white/50 p-4">
          <p className="text-2xl font-bold text-stone-800">
            {users.filter((u) => u.emailVerified).length}
          </p>
          <p className="text-xs text-stone-500 mt-1">Verified Emails</p>
        </div>
        <div className="rounded-xl border border-sky-200/40 bg-white/50 p-4">
          <p className="text-2xl font-bold text-stone-800">
            {users.filter((u) => u._count.orders > 0).length}
          </p>
          <p className="text-xs text-stone-500 mt-1">With Orders</p>
        </div>
      </div>

      <UserManagementTable users={serialized} />
    </div>
  );
}
