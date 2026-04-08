"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Gift,
  User,
  ArrowRight,
  Ticket,
  Clock,
  PartyPopper,
  Users,
} from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  variantLabel: string;
  quantity: number;
}

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
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

export default function AccountTabs({ user, orders, totalSpent }: AccountTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("orders");

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-8 flex gap-1 rounded-2xl border border-sky-200/40 bg-white/80 p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "text-stone-800"
                : "text-stone-400 hover:text-stone-600"
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

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "orders" && (
            <OrdersTab orders={orders} totalSpent={totalSpent} />
          )}
          {activeTab === "rewards" && (
            <RewardsTab />
          )}
          {activeTab === "profile" && <ProfileTab user={user} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Orders Tab ── */
function OrdersTab({ orders, totalSpent }: { orders: Order[]; totalSpent: number }) {
  return (
    <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-stone-900">Order History</h2>
        {orders.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <span>
              <span className="font-semibold text-stone-700">{orders.length}</span> order
              {orders.length !== 1 ? "s" : ""}
            </span>
            <span>
              <span className="font-semibold text-stone-700">${totalSpent.toFixed(2)}</span> total
            </span>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-10 w-10 text-stone-300 mb-3" />
          <p className="text-stone-500 mb-4">No orders yet</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-sky-100 bg-sky-50/30 p-4 transition-colors hover:bg-sky-50/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-stone-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-stone-800">
                    ${order.total.toFixed(2)}
                  </p>
                  <span className="inline-block rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide capitalize text-sky-600">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {order.items.map((item) => (
                  <p key={item.id} className="text-xs text-stone-500">
                    {item.productName} — {item.variantLabel} &times; {item.quantity}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Rewards Tab ── */
function RewardsTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">ReVia Rewards</h2>
        <p className="text-sm text-stone-500 mt-1">
          Every $50 you spend earns you an entry into our monthly drawing for store credit prizes.
          The more you order, the better your odds.
        </p>
      </div>

      {/* Monthly Drawing */}
      <MonthlyDrawing />

      {/* Referral */}
      <div className="rounded-2xl border border-sky-200/40 bg-gradient-to-br from-sky-50/80 to-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Refer a Colleague</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Share ReVia with a fellow researcher and you both earn <strong className="text-stone-700">$25 in store credit</strong> when they place their first order. No limit on referrals.
            </p>
            <p className="text-xs text-stone-400 mt-2 italic">Referral program coming soon.</p>
          </div>
        </div>
      </div>

      {/* Fine print */}
      <p className="text-[10px] text-stone-400 text-center leading-relaxed">
        Drawing held at the end of each month. Winners notified via email with a unique coupon code.
        ReVia reserves the right to modify the rewards program at any time.
      </p>
    </div>
  );
}

/* ── Monthly Drawing ── */
function MonthlyDrawing() {
  const [drawing, setDrawing] = useState<{
    month: string;
    userEntries: number;
    totalParticipants: number;
    totalEntries: number;
    daysRemaining: number;
    drawingCompleted: boolean;
    userWon: { prize: string; couponCode: string } | null;
    entryAmount: number;
    prizes: number[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/drawing")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data) setDrawing(data); })
      .catch(() => {});
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
          <p className="text-xs text-stone-400 mt-2">Apply at checkout. Expires in 90 days.</p>
        </div>
      ) : drawing.drawingCompleted ? (
        <div className="rounded-xl bg-stone-50 border border-stone-200/60 p-4 text-center mb-4">
          <p className="text-sm text-stone-500">This month&apos;s drawing has been completed.</p>
          <p className="text-xs text-stone-400 mt-1">Keep ordering to earn entries for next month!</p>
        </div>
      ) : (
        <>
          {/* Countdown & entries */}
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
        </>
      )}

      {/* Prizes */}
      <div className="space-y-2 mb-4">
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

      <p className="text-[10px] text-stone-400 leading-relaxed">
        Every ${(drawing.entryAmount / 100).toFixed(0)} spent = 1 entry. More entries = better odds. Drawing held at the end of each month.
        Winners receive a unique coupon code via email. No purchase necessary to claim prize.
      </p>
    </div>
  );
}

/* ── Profile Tab ── */
function ProfileTab({ user }: { user: UserData }) {
  return (
    <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-stone-900">Profile</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-xs text-stone-400">First Name</p>
          <p className="text-sm font-medium text-stone-800">{user.name.split(" ")[0]}</p>
        </div>
        <div>
          <p className="text-xs text-stone-400">Last Name</p>
          <p className="text-sm font-medium text-stone-800">{user.name.split(" ").slice(1).join(" ") || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-stone-400">Email</p>
          <p className="text-sm font-medium text-stone-800">{user.email}</p>
        </div>
        <div>
          <p className="text-xs text-stone-400">Member Since</p>
          <p className="text-sm font-medium text-stone-800">
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {user.role === "admin" && (
          <div>
            <p className="text-xs text-stone-400">Role</p>
            <p className="text-sm font-medium text-stone-800 capitalize">{user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
}
