import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-sm text-white/40">
          {users.length} user{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        {users.length === 0 ? (
          <p className="text-white/40 text-sm py-12 text-center">
            No customers yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-6 py-4 font-medium">Name</th>
                  <th className="text-left px-6 py-4 font-medium">Email</th>
                  <th className="text-left px-6 py-4 font-medium">Role</th>
                  <th className="text-left px-6 py-4 font-medium">
                    Registered
                  </th>
                  <th className="text-left px-6 py-4 font-medium">Orders</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/50">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/50">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {user._count.orders}
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
