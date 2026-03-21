import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderStatusForm from "@/components/OrderStatusForm";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
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
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Order{" "}
            <span className="font-mono text-emerald-400">
              {order.id.slice(0, 8)}...
            </span>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Placed on {order.createdAt.toLocaleDateString()} at{" "}
            {order.createdAt.toLocaleTimeString()}
          </p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${statusColors[order.status] ?? "bg-gray-500/20 text-gray-400"}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-white/50 mb-4">
            Customer Details
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-white/40">Name</span>
              <p className="text-white">{order.name}</p>
            </div>
            <div>
              <span className="text-white/40">Email</span>
              <p className="text-white">{order.email}</p>
            </div>
            {order.user && (
              <div>
                <span className="text-white/40">Account</span>
                <p className="text-emerald-400 text-xs">Registered User</p>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-white/50 mb-4">
            Shipping Address
          </h2>
          <div className="text-sm text-white/80 space-y-1">
            <p>{order.name}</p>
            <p>{order.address}</p>
            <p>
              {order.city}, {order.state} {order.zip}
            </p>
            <p>{order.country}</p>
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-white/50 mb-4">
            Tracking Info
          </h2>
          {order.tracking ? (
            <p className="text-white font-mono text-sm">{order.tracking}</p>
          ) : (
            <p className="text-white/30 text-sm">No tracking number yet</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-medium text-white/50">Order Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 border-b border-white/10 bg-white/[0.02]">
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
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white">{item.productName}</td>
                  <td className="px-6 py-4 text-white/60">
                    {item.variantLabel}
                  </td>
                  <td className="px-6 py-4 text-white/60 text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-white/60 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-white font-medium text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10">
                <td
                  colSpan={4}
                  className="px-6 py-4 text-right text-white/50 font-medium"
                >
                  Total
                </td>
                <td className="px-6 py-4 text-right text-white text-lg font-bold">
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Status Update Form */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-medium text-white/50 mb-4">
          Update Status
        </h2>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
