import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderStatusForm from "@/components/OrderStatusForm";
import OrderPaymentActions from "@/components/OrderPaymentActions";
import ShipOrderButton from "@/components/ShipOrderButton";
export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  pending_payment: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
  expired: "bg-neutral-100 text-neutral-500",
  on_hold: "bg-orange-100 text-orange-700",
};

const paymentMethodLabels: Record<string, string> = {
  zelle: "Zelle",
  wire: "Wire / ACH Transfer",
  bitcoin: "Bitcoin (Kraken)",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true, cryptoPayment: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Invoice <span className="font-mono text-sky-600">{order.invoiceNumber || order.id.slice(0, 8)}</span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {order.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at {order.createdAt.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors[order.status] ?? "bg-neutral-100 text-neutral-500"}`}>
            {order.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Customer</h2>
          <p className="text-sm font-medium text-neutral-900">{order.name}</p>
          <p className="text-sm text-neutral-500">{order.email}</p>
          {order.user && <span className="inline-block mt-1 text-[10px] bg-sky-50 text-sky-600 rounded px-1.5 py-0.5">Registered</span>}
        </div>

        {/* Shipping Address */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Ship To</h2>
          <div className="text-sm text-neutral-700 space-y-0.5">
            <p className="font-medium">{order.name}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.state} {order.zip}</p>
            <p>{order.country}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Payment</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Method</span>
              <span className="font-medium text-neutral-900">{paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Status</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                order.paymentStatus === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                order.paymentStatus === "awaiting" ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-600"
              }`}>{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Total</span>
              <span className="font-bold text-neutral-900">${(order.total / 100).toFixed(2)}</span>
            </div>
            {order.cryptoPayment && (
              <>
                <hr className="border-neutral-100" />
                <div className="flex justify-between">
                  <span className="text-neutral-500">BTC Amount</span>
                  <span className="font-mono text-xs text-neutral-700">{order.cryptoPayment.amountCrypto.toFixed(8)} BTC</span>
                </div>
                {order.cryptoPayment.txHash && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">TX Hash</span>
                    <span className="font-mono text-[10px] text-neutral-500 truncate max-w-32">{order.cryptoPayment.txHash}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Actions (confirm/reject for Zelle/Wire) */}
      {order.paymentStatus === "awaiting" && order.paymentMethod !== "bitcoin" && (
        <OrderPaymentActions orderId={order.id} paymentMethod={order.paymentMethod} invoiceNumber={order.invoiceNumber} />
      )}

      {/* Tracking / Shipping */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Shipping & Tracking</h2>
        {order.tracking ? (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-neutral-500">Tracking</p>
                <p className="font-mono text-sm font-semibold text-neutral-900">{order.tracking}</p>
              </div>
              {order.carrier && (
                <div>
                  <p className="text-xs text-neutral-500">Carrier</p>
                  <p className="text-sm text-neutral-800">{order.carrier} {order.serviceLevel}</p>
                </div>
              )}
              {order.labelUrl && (
                <div>
                  <a href={order.labelUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400 transition">
                    Download Label
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : order.paymentStatus === "confirmed" && order.status === "processing" ? (
          <ShipOrderButton orderId={order.id} invoiceNumber={order.invoiceNumber} hasEasypostKey={!!process.env.EASYPOST_API_KEY || !!process.env.EASYPOST_API_TEST_KEY} />
        ) : (
          <p className="text-sm text-neutral-400">
            {order.paymentStatus !== "confirmed" ? "Payment must be confirmed before shipping." : "Set status to \"processing\" to enable shipping."}
          </p>
        )}
      </div>

      {/* Order Items */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Items ({order.items.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100">
              <th className="text-left px-5 py-3 font-medium text-neutral-500">Product</th>
              <th className="text-left px-5 py-3 font-medium text-neutral-500">Variant</th>
              <th className="text-right px-5 py-3 font-medium text-neutral-500">Price</th>
              <th className="text-right px-5 py-3 font-medium text-neutral-500">Qty</th>
              <th className="text-right px-5 py-3 font-medium text-neutral-500">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-neutral-50">
                <td className="px-5 py-3 font-medium text-neutral-800">{item.productName}</td>
                <td className="px-5 py-3 text-neutral-500">{item.variantLabel}</td>
                <td className="px-5 py-3 text-neutral-500 text-right">${(item.price / 100).toFixed(2)}</td>
                <td className="px-5 py-3 text-neutral-500 text-right">{item.quantity}</td>
                <td className="px-5 py-3 text-neutral-800 font-medium text-right">${((item.price * item.quantity) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-neutral-200 bg-neutral-50">
              <td colSpan={4} className="px-5 py-3 text-right font-semibold text-neutral-700">Total</td>
              <td className="px-5 py-3 text-right text-lg font-bold text-neutral-900">${(order.total / 100).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Status Update */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Update Order Status</h2>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
