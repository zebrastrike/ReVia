import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import type { Metadata } from "next";

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">My Account</h1>

      {/* User Info Card */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="mb-4 text-lg font-semibold text-white">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="text-white">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-white">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Member Since</p>
            <p className="text-white">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Role</p>
            <p className="capitalize text-white">{user.role}</p>
          </div>
        </div>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>

      {/* Order History */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="mb-4 text-lg font-semibold text-white">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-white/5 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-400">
                      ${order.total.toFixed(2)}
                    </p>
                    <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-emerald-400">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm text-gray-400">
                      {item.productName} - {item.variantLabel} x{item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
