import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Ticket, Users, ShoppingCart, DollarSign, Percent, Calendar, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const paymentStatusColors: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700",
  awaiting: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-600",
};

export default async function AdminCouponDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) return notFound();

  const orders = await prisma.order.findMany({
    where: { couponId: id },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Aggregate unique customers
  const customerMap = new Map<string, { name: string; email: string; orders: number; spent: number; discount: number }>();
  for (const o of orders) {
    const key = o.user?.email || o.email;
    const existing = customerMap.get(key);
    if (existing) {
      existing.orders += 1;
      existing.spent += o.total;
      existing.discount += o.couponDiscount ?? 0;
    } else {
      customerMap.set(key, {
        email: key,
        name: o.user?.name || o.name || "—",
        orders: 1,
        spent: o.total,
        discount: o.couponDiscount ?? 0,
      });
    }
  }
  const customers = Array.from(customerMap.values()).sort((a, b) => b.spent - a.spent);

  const totalDiscountGiven = orders.reduce((s, o) => s + (o.couponDiscount ?? 0), 0);
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const hasBreakdownGap = orders.some((o) => o.couponDiscount == null);

  const valueLabel = coupon.type === "percentage" ? `${coupon.value}%` : `$${(coupon.value / 100).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <Link href="/admin/coupons" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to promo codes
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Ticket className="h-5 w-5 text-sky-500" />
              <h1 className="text-2xl font-bold text-neutral-900 font-mono">{coupon.code}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${coupon.active ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-400"}`}>
                {coupon.active ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              {coupon.type === "percentage" ? "Percentage off" : "Fixed amount off"}
              {coupon.minOrder > 0 && <> · Min order ${(coupon.minOrder / 100).toFixed(2)}</>}
              {coupon.expiresAt && (
                <> · Expires {new Date(coupon.expiresAt).toLocaleDateString()}</>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-400 uppercase tracking-wider">Discount</p>
            <p className="text-3xl font-bold text-neutral-900 flex items-center gap-1">
              {coupon.type === "percentage" ? (
                <>{coupon.value}<Percent className="h-5 w-5 text-neutral-400" /></>
              ) : (
                valueLabel
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <Stat label="Redemptions" value={String(coupon.usedCount)} sub={coupon.maxUses > 0 ? `of ${coupon.maxUses}` : "unlimited"} icon={<Ticket className="h-4 w-4 text-sky-500" />} />
          <Stat label="Customers" value={String(customers.length)} icon={<Users className="h-4 w-4 text-emerald-500" />} />
          <Stat label="Discount Given" value={`$${(totalDiscountGiven / 100).toFixed(2)}`} icon={<DollarSign className="h-4 w-4 text-amber-500" />} />
          <Stat label="Revenue" value={`$${(totalRevenue / 100).toFixed(2)}`} icon={<DollarSign className="h-4 w-4 text-purple-500" />} />
        </div>

        {hasBreakdownGap && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              Some orders below predate per-order discount tracking. The Discount Given total only counts orders placed after that change shipped — earlier redemptions show "—" in the table.
            </p>
          </div>
        )}
      </div>

      {/* Customers */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 mb-4">
          <Users className="h-5 w-5 text-neutral-400" /> Customers <span className="text-sm font-normal text-neutral-400">({customers.length})</span>
        </h2>
        {customers.length === 0 ? (
          <p className="text-sm text-neutral-400 py-6 text-center">No redemptions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wider text-neutral-400">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium text-right">Orders</th>
                  <th className="py-2 pr-4 font-medium text-right">Discount</th>
                  <th className="py-2 font-medium text-right">Spent</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.email} className="border-b border-neutral-100 last:border-0">
                    <td className="py-2.5 pr-4 text-neutral-800">{c.name}</td>
                    <td className="py-2.5 pr-4 text-neutral-500">{c.email}</td>
                    <td className="py-2.5 pr-4 text-neutral-800 text-right">{c.orders}</td>
                    <td className="py-2.5 pr-4 text-sky-600 text-right">{c.discount > 0 ? `−$${(c.discount / 100).toFixed(2)}` : <span className="text-neutral-300">—</span>}</td>
                    <td className="py-2.5 text-right text-neutral-800">${(c.spent / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Orders */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 mb-4">
          <ShoppingCart className="h-5 w-5 text-neutral-400" /> Orders <span className="text-sm font-normal text-neutral-400">({orders.length})</span>
        </h2>
        {orders.length === 0 ? (
          <p className="text-sm text-neutral-400 py-6 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wider text-neutral-400">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Invoice</th>
                  <th className="py-2 pr-4 font-medium">Customer</th>
                  <th className="py-2 pr-4 font-medium">Payment</th>
                  <th className="py-2 pr-4 font-medium text-right">Subtotal</th>
                  <th className="py-2 pr-4 font-medium text-right">Discount</th>
                  <th className="py-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-neutral-100 last:border-0">
                    <td className="py-2.5 pr-4 text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-neutral-300" />
                        {o.createdAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs text-sky-600 hover:text-sky-500">{o.invoiceNumber}</Link>
                    </td>
                    <td className="py-2.5 pr-4 text-neutral-700">
                      {o.user?.name || o.name}<br />
                      <span className="text-xs text-neutral-400">{o.user?.email || o.email}</span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs rounded-full px-2 py-0.5 ${paymentStatusColors[o.paymentStatus] ?? "bg-neutral-100 text-neutral-500"}`}>{o.paymentStatus}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-right text-neutral-700">
                      {o.subtotal != null ? `$${(o.subtotal / 100).toFixed(2)}` : <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="py-2.5 pr-4 text-right text-sky-600">
                      {o.couponDiscount != null && o.couponDiscount > 0 ? `−$${(o.couponDiscount / 100).toFixed(2)}` : <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="py-2.5 text-right text-neutral-800 font-medium">${(o.total / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-3">
      <div className="flex items-center justify-between mb-1">
        {icon}
      </div>
      <p className="text-lg font-bold text-neutral-900">{value}</p>
      <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
        {label}
        {sub && <span className="ml-1 normal-case text-neutral-400">· {sub}</span>}
      </p>
    </div>
  );
}
