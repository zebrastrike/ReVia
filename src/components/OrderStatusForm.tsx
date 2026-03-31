"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const statuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const body: Record<string, string> = { status };
      if (status === "shipped" && tracking.trim()) {
        body.trackingNumber = tracking.trim();
      }

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update order");
      }

      setFeedback({ type: "success", message: "Order status updated successfully" });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-stone-800/50 mb-2">
            New Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-white/50 border border-sky-200/40 rounded-xl px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:border-sky-500/50 transition-colors capitalize"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-white capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>

        {status === "shipped" && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-stone-800/50 mb-2">
              Tracking Number
            </label>
            <input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full bg-white/50 border border-sky-200/40 rounded-xl px-4 py-2.5 text-stone-800 text-sm placeholder:text-stone-800/20 focus:outline-none focus:border-sky-500/50 transition-colors"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || status === currentStatus}
          className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-stone-800 text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Update
        </button>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
            feedback.type === "success"
              ? "bg-sky-100 text-sky-400 border border-sky-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {feedback.message}
        </div>
      )}
    </form>
  );
}
