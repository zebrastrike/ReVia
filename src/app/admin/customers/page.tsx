import { prisma } from "@/lib/prisma";
import AdminCustomerTable from "@/components/AdminCustomerTable";
export const dynamic = "force-dynamic";

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
        <h1 className="text-2xl font-bold text-stone-800">Customers</h1>
        <p className="text-sm text-stone-500">
          {users.length} user{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      <AdminCustomerTable
        customers={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt.toISOString(),
          orderCount: u._count.orders,
        }))}
      />
    </div>
  );
}
