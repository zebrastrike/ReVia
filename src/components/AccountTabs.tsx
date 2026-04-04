"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Gift,
  User,
  ArrowRight,
  Star,
  Trophy,
  TrendingUp,
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

  const rewardPoints = Math.floor(totalSpent);

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
            <RewardsTab points={rewardPoints} orderCount={orders.length} />
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
function RewardsTab({ points, orderCount }: { points: number; orderCount: number }) {
  const tier =
    points >= 1000 ? "Gold" : points >= 500 ? "Silver" : "Bronze";
  const tierColor =
    tier === "Gold"
      ? "text-amber-600 bg-amber-50 border-amber-200/50"
      : tier === "Silver"
        ? "text-stone-500 bg-stone-50 border-stone-200/50"
        : "text-orange-700 bg-orange-50 border-orange-200/50";
  const nextTier = tier === "Gold" ? null : tier === "Silver" ? "Gold" : "Silver";
  const nextTierAt = tier === "Silver" ? 1000 : 500;
  const progress = nextTier ? Math.min((points / nextTierAt) * 100, 100) : 100;

  return (
    <div className="space-y-6">
      {/* Points overview */}
      <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">ReVia Rewards</h2>
            <p className="text-sm text-stone-500 mt-1">Earn 1 point for every $1 spent</p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${tierColor}`}>
            <Trophy className="h-4 w-4" />
            {tier} Member
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-sky-50/60 border border-sky-200/40 p-4 text-center">
            <Star className="mx-auto h-5 w-5 text-sky-500 mb-2" />
            <p className="text-2xl font-bold text-stone-800">{points.toLocaleString()}</p>
            <p className="text-xs text-stone-400 mt-1">Total Points</p>
          </div>
          <div className="rounded-xl bg-sky-50/60 border border-sky-200/40 p-4 text-center">
            <Package className="mx-auto h-5 w-5 text-sky-500 mb-2" />
            <p className="text-2xl font-bold text-stone-800">{orderCount}</p>
            <p className="text-xs text-stone-400 mt-1">Orders</p>
          </div>
          <div className="rounded-xl bg-sky-50/60 border border-sky-200/40 p-4 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-sky-500 mb-2" />
            <p className="text-2xl font-bold text-stone-800">${points.toLocaleString()}</p>
            <p className="text-xs text-stone-400 mt-1">Lifetime Spent</p>
          </div>
        </div>
      </div>

      {/* Tier progress */}
      {nextTier && (
        <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-800 mb-3">
            Progress to {nextTier}
          </h3>
          <div className="h-3 rounded-full bg-sky-100 overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full bg-sky-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-stone-400">
            {points.toLocaleString()} / {nextTierAt.toLocaleString()} points —{" "}
            <span className="font-medium text-stone-600">
              ${(nextTierAt - points).toLocaleString()} away
            </span>
          </p>
        </div>
      )}

      {/* How it works */}
      <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-800 mb-4">How It Works</h3>
        <div className="space-y-3">
          {[
            { tier: "Bronze", range: "0 – 499 pts", perk: "Earn 1 pt per $1 spent" },
            { tier: "Silver", range: "500 – 999 pts", perk: "5% off every order" },
            { tier: "Gold", range: "1,000+ pts", perk: "10% off + free shipping" },
          ].map((t) => (
            <div
              key={t.tier}
              className="flex items-center justify-between rounded-xl bg-sky-50/40 border border-sky-100/60 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-stone-700">{t.tier}</p>
                <p className="text-xs text-stone-400">{t.range}</p>
              </div>
              <p className="text-xs font-medium text-stone-600">{t.perk}</p>
            </div>
          ))}
        </div>
      </div>
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
