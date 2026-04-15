"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Gift,
  User,
  ArrowRight,
  ArrowLeft,
  Ticket,
  Clock,
  PartyPopper,
  Users,
  Truck,
  FileText,
  Loader2,
  Check,
  Pencil,
} from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  variantLabel: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  tracking: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  items: OrderItem[];
}

interface UserData {
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

interface AccountTabsProps {
  user: UserData;
  orders: Order[];
  totalSpent: number;
}

const tabs = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "profile", label: "Profile", icon: User },
] as const;

type TabId = (typeof tabs)[number]["id"];

const statusColors: Record<string, string> = {
  pending_payment: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
  expired: "bg-neutral-100 text-neutral-500",
};

const paymentMethodLabels: Record<string, string> = {
  zelle: "Zelle",
  wire: "Wire / ACH",
  bitcoin: "Bitcoin",
};

export default function AccountTabs({ user, orders, totalSpent }: AccountTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("orders");

  return (
    <div>
      <div className="mb-8 flex gap-1 rounded-2xl border border-sky-200/40 bg-white/80 p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
              activeTab === tab.id ? "text-stone-800" : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-sky-50 border border-sky-200/50"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <tab.icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "orders" && <OrdersTab orders={orders} totalSpent={totalSpent} />}
          {activeTab === "rewards" && <RewardsTab />}
          {activeTab === "profile" && <ProfileTab user={user} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  Orders Tab                                                       */
/* ══════════════════════════════════════════════════════════════════ */

function OrdersTab({ orders, totalSpent }: { orders: Order[]; totalSpent: number }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-stone-900">Order History</h2>
        {orders.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <span><span className="font-semibold text-stone-700">{orders.length}</span> order{orders.length !== 1 ? "s" : ""}</span>
            <span><span className="font-semibold text-stone-700">${(totalSpent / 100).toFixed(2)}</span> total</span>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-10 w-10 text-stone-300 mb-3" />
          <p className="text-stone-500 mb-4">No orders yet</p>
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500">
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="w-full text-left rounded-xl border border-sky-100 bg-sky-50/30 p-4 transition-colors hover:bg-sky-50/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-sky-600 font-mono">
                    {order.invoiceNumber || `#${order.id.slice(-8).toUpperCase()}`}
                  </p>
                  <p className="text-xs text-stone-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    <span className="mx-1.5">·</span>
                    {paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-stone-800">${(order.total / 100).toFixed(2)}</p>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusColors[order.status] ?? "bg-neutral-100 text-neutral-500"}`}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-stone-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                {order.tracking && (
                  <span className="flex items-center gap-1 text-xs text-purple-600">
                    <Truck className="h-3 w-3" /> Tracking available
                  </span>
                )}
                <ArrowRight className="h-3.5 w-3.5 text-stone-300" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Order Detail / Invoice View ── */
function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </button>

      <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5 text-sky-500" />
              <h2 className="text-lg font-bold text-stone-900">Invoice {order.invoiceNumber || `#${order.id.slice(-8).toUpperCase()}`}</h2>
            </div>
            <p className="text-xs text-stone-400">
              {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] ?? "bg-neutral-100 text-neutral-500"}`}>
            {order.status.replace("_", " ")}
          </span>
        </div>

        {/* Payment & Shipping Info */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl bg-sky-50/50 border border-sky-100 p-4">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Payment</p>
            <p className="text-sm text-stone-800">{paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod}</p>
            <p className={`text-xs font-medium mt-1 ${order.paymentStatus === "confirmed" ? "text-emerald-600" : order.paymentStatus === "awaiting" ? "text-amber-600" : "text-red-500"}`}>
              {order.paymentStatus === "confirmed" ? "Paid" : order.paymentStatus === "awaiting" ? "Awaiting payment" : "Failed"}
            </p>
          </div>
          <div className="rounded-xl bg-sky-50/50 border border-sky-100 p-4">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Ship To</p>
            <p className="text-sm text-stone-800">{order.address}</p>
            <p className="text-sm text-stone-600">{order.city}, {order.state} {order.zip}</p>
          </div>
        </div>

        {/* Tracking */}
        {order.tracking && (
          <div className="rounded-xl bg-purple-50 border border-purple-200/60 p-4 mb-6">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-purple-600" />
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Tracking Number</p>
            </div>
            <p className="text-sm font-mono font-semibold text-purple-900 mt-1">{order.tracking}</p>
          </div>
        )}

        {/* Items Table */}
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b border-sky-100">
              <th className="text-left py-2 text-xs font-medium text-stone-500">Product</th>
              <th className="text-right py-2 text-xs font-medium text-stone-500">Price</th>
              <th className="text-right py-2 text-xs font-medium text-stone-500">Qty</th>
              <th className="text-right py-2 text-xs font-medium text-stone-500">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-sky-50">
                <td className="py-2.5">
                  <p className="font-medium text-stone-800">{item.productName}</p>
                  <p className="text-xs text-stone-400">{item.variantLabel}</p>
                </td>
                <td className="py-2.5 text-right text-stone-600">${(item.price / 100).toFixed(2)}</td>
                <td className="py-2.5 text-right text-stone-600">{item.quantity}</td>
                <td className="py-2.5 text-right font-medium text-stone-800">${((item.price * item.quantity) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-sky-200">
              <td colSpan={3} className="py-3 text-right font-semibold text-stone-700">Total</td>
              <td className="py-3 text-right text-lg font-bold text-stone-900">${(order.total / 100).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <p className="text-[10px] text-stone-400 text-center">
          All sales are final. No refunds or returns. Questions? Email orders@revialife.com
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  Rewards Tab                                                      */
/* ══════════════════════════════════════════════════════════════════ */

function RewardsTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">ReVia Rewards</h2>
        <p className="text-sm text-stone-500 mt-1">
          Every $50 you spend earns you an entry into our monthly drawing for store credit prizes.
        </p>
      </div>
      <MonthlyDrawing />
      <div className="rounded-2xl border border-sky-200/40 bg-gradient-to-br from-sky-50/80 to-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Refer a Colleague</h3>
            <p className="text-xs text-stone-500 mt-1">
              Share ReVia with a fellow researcher and you both earn <strong className="text-stone-700">$25 in store credit</strong> when they place their first order.
            </p>
            <p className="text-xs text-stone-400 mt-2 italic">Referral program coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthlyDrawing() {
  const [drawing, setDrawing] = useState<{
    month: string; userEntries: number; totalParticipants: number;
    totalEntries: number; daysRemaining: number; drawingCompleted: boolean;
    userWon: { prize: string; couponCode: string } | null;
    entryAmount: number; prizes: number[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/drawing").then(r => r.ok ? r.json() : null).then(d => { if (d) setDrawing(d); }).catch(() => {});
  }, []);

  if (!drawing) return null;
  const monthLabel = new Date(drawing.month + "-15").toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-white p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400">
          <Ticket className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-stone-800">Monthly Drawing</h3>
          <p className="text-xs text-stone-500 mt-0.5">{monthLabel}</p>
        </div>
      </div>

      {drawing.userWon ? (
        <div className="rounded-xl bg-green-50 border border-green-200/60 p-5 text-center mb-4">
          <PartyPopper className="mx-auto h-8 w-8 text-green-500 mb-2" />
          <p className="text-lg font-bold text-green-700">You Won!</p>
          <p className="text-sm text-green-600 mt-1">{drawing.userWon.prize}</p>
          <div className="mt-3 rounded-lg bg-white border border-green-200 px-4 py-2 inline-block">
            <p className="text-xs text-stone-400">Your coupon code</p>
            <p className="text-base font-mono font-bold text-green-700 tracking-wide">{drawing.userWon.couponCode}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl bg-amber-50/60 border border-amber-200/40 p-3 text-center">
            <Ticket className="mx-auto h-4 w-4 text-amber-500 mb-1" />
            <p className="text-xl font-bold text-stone-800">{drawing.userEntries}</p>
            <p className="text-[10px] text-stone-400">Your Entries</p>
          </div>
          <div className="rounded-xl bg-amber-50/60 border border-amber-200/40 p-3 text-center">
            <Users className="mx-auto h-4 w-4 text-amber-500 mb-1" />
            <p className="text-xl font-bold text-stone-800">{drawing.totalParticipants}</p>
            <p className="text-[10px] text-stone-400">Participants</p>
          </div>
          <div className="rounded-xl bg-amber-50/60 border border-amber-200/40 p-3 text-center">
            <Clock className="mx-auto h-4 w-4 text-amber-500 mb-1" />
            <p className="text-xl font-bold text-stone-800">{drawing.daysRemaining}</p>
            <p className="text-[10px] text-stone-400">Days Left</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Prizes</p>
        {[
          { place: "1st", amount: drawing.prizes[0], color: "text-amber-600" },
          { place: "2nd", amount: drawing.prizes[1], color: "text-stone-500" },
          { place: "3rd", amount: drawing.prizes[2], color: "text-orange-700" },
        ].map((p) => (
          <div key={p.place} className="flex items-center justify-between rounded-lg bg-white/60 border border-amber-100/60 px-3 py-2">
            <span className={`text-sm font-semibold ${p.color}`}>{p.place} Place</span>
            <span className="text-xs font-medium text-stone-600">${(p.amount / 100).toFixed(0)} Store Credit</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  Profile Tab (editable)                                           */
/* ══════════════════════════════════════════════════════════════════ */

function ProfileTab({ user }: { user: UserData }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
  });

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const body: Record<string, string> = {};
      if (form.name !== user.name) body.name = form.name;
      if (form.email !== user.email) body.email = form.email;
      if (form.newPassword) {
        body.currentPassword = form.currentPassword;
        body.newPassword = form.newPassword;
      }

      if (Object.keys(body).length === 0) {
        setEditing(false);
        return;
      }

      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setMessage({ type: "success", text: "Profile updated!" });
      setEditing(false);
      setForm(f => ({ ...f, currentPassword: "", newPassword: "" }));
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-sky-200/60 bg-sky-50/30 px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20";

  return (
    <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-stone-900">Profile</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-500 transition">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {message.text}
        </div>
      )}

      {editing ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <hr className="border-sky-100" />
          <p className="text-xs text-stone-500">Change password (leave blank to keep current)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">Current Password</label>
              <input type="password" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-500">New Password</label>
              <input type="password" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email, currentPassword: "", newPassword: "" }); }} className="rounded-xl border border-sky-200 px-5 py-2 text-sm text-stone-600 hover:bg-sky-50 transition">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60 transition">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-stone-400">Name</p>
            <p className="text-sm font-medium text-stone-800">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400">Email</p>
            <p className="text-sm font-medium text-stone-800">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400">Member Since</p>
            <p className="text-sm font-medium text-stone-800">
              {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
