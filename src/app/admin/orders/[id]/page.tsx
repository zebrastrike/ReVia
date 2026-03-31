import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderStatusForm from "@/components/OrderStatusForm";
export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-sky-500/20 text-sky-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-stone-800/50 hover:text-stone-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            Order{" "}
            <span className="font-mono text-sky-400">
              {order.id.slice(0, 8)}...
            </span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Placed on {order.createdAt.toLocaleDateString()} at{" "}
            {order.createdAt.toLocaleTimeString()}
          </p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${statusColors[order.status] ?? "bg-gray-500/20 text-stone-500"}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-stone-800/50 mb-4">
            Customer Details
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-stone-500">Name</span>
              <p className="text-stone-800">{order.name}</p>
            </div>
            <div>
              <span className="text-stone-500">Email</span>
              <p className="text-stone-800">{order.email}</p>
            </div>
            {order.user && (
              <div>
                <span className="text-stone-500">Account</span>
                <p className="text-sky-400 text-xs">Registered User</p>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-stone-800/50 mb-4">
            Shipping Address
          </h2>
          <div className="text-sm text-stone-800/80 space-y-1">
            <p>{order.name}</p>
            <p>{order.address}</p>
            <p>
              {order.city}, {order.state} {order.zip}
            </p>
            <p>{order.country}</p>
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-stone-800/50 mb-4">
            Tracking Info
          </h2>
          {order.tracking ? (
            <p className="text-stone-800 font-mono text-sm">{order.tracking}</p>
          ) : (
            <p className="text-stone-800/30 text-sm">No tracking number yet</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-sky-200/40">
          <h2 className="text-sm font-medium text-stone-800/50">Order Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stone-500 border-b border-sky-200/40 bg-white/500">
                <th className="text-left px-6 py-3 font-medium">Product</th>
                <th className="text-left px-6 py-3 font-medium">Variant</th>
                <th className="text-right px-6 py-3 font-medium">Price</th>
                <th className="text-right px-6 py-3 font-medium">Qty</th>
                <th className="text-right px-6 py-3 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-sky-100/40 hover:bg-white/50 transition-colors"
                >
                  <td className="px-6 py-4 text-stone-800">{item.productName}</td>
                  <td className="px-6 py-4 text-stone-500">
                    {item.variantLabel}
                  </td>
                  <td className="px-6 py-4 text-stone-500 text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-stone-500 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-stone-800 font-medium text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-sky-200/40">
                <td
                  colSpan={4}
                  className="px-6 py-4 text-right text-stone-800/50 font-medium"
                >
                  Total
                </td>
                <td className="px-6 py-4 text-right text-stone-800 text-lg font-bold">
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Status Update Form */}
      <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6">
        <h2 className="text-sm font-medium text-stone-800/50 mb-4">
          Update Status
        </h2>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
