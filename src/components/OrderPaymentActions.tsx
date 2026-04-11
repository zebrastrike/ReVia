"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";

export default function OrderPaymentActions({
  orderId,
  paymentMethod,
  invoiceNumber,
}: {
  orderId: string;
  paymentMethod: string;
  invoiceNumber: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const methodLabel = paymentMethod === "zelle" ? "Zelle" : "Wire/ACH";

  const handleConfirm = async () => {
    if (!confirm(`Confirm ${methodLabel} payment received for invoice ${invoiceNumber}?`)) return;
    setConfirming(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "processing",
          paymentStatus: "confirmed",
        }),
      });

      if (!res.ok) throw new Error("Failed to confirm payment");
      setMessage({ type: "success", text: "Payment confirmed! Order moved to processing." });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setConfirming(false);
    }
  };

  const handleReject = async () => {
    if (!confirm(`Reject payment for invoice ${invoiceNumber}? This will cancel the order.`)) return;
    setRejecting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "cancelled",
          paymentStatus: "failed",
        }),
      });

      if (!res.ok) throw new Error("Failed to reject payment");
      setMessage({ type: "success", text: "Payment rejected. Order cancelled." });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-amber-600" />
        <h2 className="text-sm font-bold text-amber-800">Payment Pending — {methodLabel}</h2>
      </div>
      <p className="text-xs text-amber-700 mb-4">
        Check your Chase bank account for a {methodLabel} payment with memo/note containing invoice <span className="font-mono font-bold">{invoiceNumber}</span>.
        Once verified, confirm the payment below.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={handleConfirm}
          disabled={confirming || rejecting}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60 transition"
        >
          {confirming ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
          Confirm Payment Received
        </button>
        <button
          onClick={handleReject}
          disabled={confirming || rejecting}
          className="flex items-center gap-2 rounded-xl bg-white border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition"
        >
          {rejecting ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
          Reject / Cancel
        </button>
      </div>

      {message && (
        <div className={`mt-3 rounded-lg px-4 py-2 text-sm ${message.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
