import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import AccountTabs from "@/components/AccountTabs";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account | ReVia",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const serializedOrders = orders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    total: o.total,
    status: o.status,
    items: o.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      variantLabel: item.variantLabel,
      quantity: item.quantity,
    })),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Welcome header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-stone-500 text-sm">
            Manage your orders, rewards, and profile.
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* ── Tabbed sections ── */}
      <AccountTabs
        user={{
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          role: user.role,
        }}
        orders={serializedOrders}
        totalSpent={totalSpent}
      />
    </div>
  );
}
