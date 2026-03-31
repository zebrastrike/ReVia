import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-neutral-900">My Account</h1>

      {/* User Info Card */}
      <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-neutral-500">Name</p>
            <p className="text-neutral-900">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Email</p>
            <p className="text-neutral-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Member Since</p>
            <p className="text-neutral-900">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Role</p>
            <p className="capitalize text-neutral-900">{user.role}</p>
          </div>
        </div>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>

      {/* Order History */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-neutral-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-neutral-100 bg-neutral-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-900">
                      ${order.total.toFixed(2)}
                    </p>
                    <span className="inline-block rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium capitalize text-sky-600">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm text-neutral-500">
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
