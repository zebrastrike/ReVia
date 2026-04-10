"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Copy,
  Check,
  Clock,
  ExternalLink,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Bitcoin,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CryptoPaymentData {
  id: string;
  status: string;
  currency: string;
  amountBtc: number;
  amountUsd: number;
  exchangeRate: number;
  walletAddress: string;
  paymentUri: string;
  qrCode: string;
  expiresAt: string;
  invoiceNumber: string;
  txHash?: string;
  amountReceived?: number;
  orderStatus?: string;
}

interface CryptoPaymentProps {
  orderId: string;
  onPaymentConfirmed?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CryptoPayment({
  orderId,
  onPaymentConfirmed,
}: CryptoPaymentProps) {
  const [payment, setPayment] = useState<CryptoPaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"address" | "amount" | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Create or fetch payment ──
  const initPayment = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/crypto/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create payment");
      setPayment(data.payment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // ── Poll payment status ──
  const checkStatus = useCallback(async () => {
    if (!payment?.id) return;

    try {
      const res = await fetch(`/api/crypto/payment-status/${payment.id}`);
      const data = await res.json();

      if (data.payment) {
        setPayment((prev) => (prev ? { ...prev, ...data.payment } : prev));

        if (data.payment.status === "confirmed") {
          // Stop polling
          if (pollRef.current) clearInterval(pollRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
          onPaymentConfirmed?.();
        }

        if (data.payment.status === "expired") {
          if (pollRef.current) clearInterval(pollRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }
    } catch {
      // Silently fail — will retry on next poll
    }
  }, [payment?.id, onPaymentConfirmed]);

  // ── Initialize on mount ──
  useEffect(() => {
    initPayment();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initPayment]);

  // ── Start polling after payment created ──
  useEffect(() => {
    if (!payment?.id || payment.status === "confirmed" || payment.status === "expired") return;

    pollRef.current = setInterval(checkStatus, 8000); // poll every 8s
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [payment?.id, payment?.status, checkStatus]);

  // ── Countdown timer ──
  useEffect(() => {
    if (!payment?.expiresAt) return;

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(payment.expiresAt).getTime() - Date.now()) / 1000)
      );
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [payment?.expiresAt]);

  // ── Copy to clipboard ──
  const copyToClipboard = async (text: string, type: "address" | "amount") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  // ── Format countdown ──
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-stone-500">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500 mb-4" />
        <p className="text-sm">Generating Bitcoin payment...</p>
        <p className="text-xs text-stone-400 mt-1">Fetching current BTC rate from Kraken</p>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-amber-500 mb-4" />
        <p className="text-sm text-stone-700 font-medium">{error}</p>
        <button
          onClick={initPayment}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!payment) return null;

  /* ── Confirmed state ── */
  if (payment.status === "confirmed") {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Payment Confirmed!</h2>
        <p className="mt-2 text-sm text-stone-500">
          We received <span className="font-mono font-semibold text-stone-700">{payment.amountReceived || payment.amountBtc} BTC</span>
        </p>
        {payment.txHash && (
          <p className="mt-1 text-xs text-stone-400 font-mono break-all max-w-sm">
            TX: {payment.txHash}
          </p>
        )}
        <p className="mt-4 text-sm text-stone-500">
          Invoice <span className="font-semibold text-sky-600">{payment.invoiceNumber}</span> is now being processed.
        </p>
      </div>
    );
  }

  /* ── Expired state ── */
  if (payment.status === "expired" || timeLeft <= 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Payment Expired</h2>
        <p className="mt-2 text-sm text-stone-500">
          The 30-minute payment window has closed.
        </p>
        <p className="mt-1 text-xs text-stone-400">
          If you already sent payment, contact us at orders@revialife.com with your invoice number.
        </p>
        <button
          onClick={initPayment}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition"
        >
          <RefreshCw className="h-4 w-4" />
          Generate New Payment
        </button>
      </div>
    );
  }

  /* ── Active payment — main UI ── */
  const isUrgent = timeLeft < 300; // under 5 min

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 mb-4">
          <Clock className={`h-4 w-4 ${isUrgent ? "text-red-500" : "text-amber-500"}`} />
          <span className={`text-sm font-mono font-semibold ${isUrgent ? "text-red-600" : "text-amber-700"}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-amber-600">remaining</span>
        </div>
        <h2 className="text-lg font-bold text-stone-900">
          Send Bitcoin to Complete Payment
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Invoice: <span className="font-mono font-semibold text-sky-600">{payment.invoiceNumber}</span>
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="rounded-2xl border-2 border-sky-200 bg-white p-4 shadow-sm">
          {payment.qrCode && (
            <img
              src={payment.qrCode}
              alt="Bitcoin payment QR code"
              width={250}
              height={250}
              className="rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="rounded-xl border border-sky-200/60 bg-sky-50/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider font-medium">Send exactly</p>
            <p className="text-2xl font-bold font-mono text-stone-900 mt-0.5">
              {payment.amountBtc.toFixed(8)} <span className="text-sm text-stone-500">BTC</span>
            </p>
            <p className="text-xs text-stone-400">
              ≈ ${(payment.amountUsd / 100).toFixed(2)} USD @ ${payment.exchangeRate.toLocaleString()}/BTC
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(payment.amountBtc.toFixed(8), "amount")}
            className="flex items-center gap-1.5 rounded-lg bg-white border border-sky-200 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-sky-50 transition"
          >
            {copied === "amount" ? (
              <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy</>
            )}
          </button>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="rounded-xl border border-sky-200/60 bg-sky-50/50 p-4 space-y-2">
        <p className="text-xs text-stone-500 uppercase tracking-wider font-medium">To address</p>
        <div className="flex items-center gap-2">
          <p className="flex-1 text-sm font-mono text-stone-800 break-all leading-relaxed">
            {payment.walletAddress}
          </p>
          <button
            onClick={() => copyToClipboard(payment.walletAddress, "address")}
            className="shrink-0 flex items-center gap-1.5 rounded-lg bg-white border border-sky-200 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-sky-50 transition"
          >
            {copied === "address" ? (
              <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy</>
            )}
          </button>
        </div>
      </div>

      {/* Open in wallet button */}
      <a
        href={payment.paymentUri}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F7931A] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#e8851a] transition shadow-md"
      >
        <Bitcoin className="h-5 w-5" />
        Open in Wallet App
        <ExternalLink className="h-3.5 w-3.5" />
      </a>

      {/* Status indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
        <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        Waiting for payment — checking every 8 seconds
      </div>

      {/* Info */}
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2">
        <p className="text-xs font-medium text-stone-600">Important:</p>
        <ul className="text-xs text-stone-500 space-y-1 list-disc list-inside">
          <li>Send the <strong>exact</strong> BTC amount shown above</li>
          <li>Payment must be received within {formatTime(timeLeft)}</li>
          <li>Sending the wrong amount may delay processing</li>
          <li>You can use any Bitcoin wallet — not just Kraken</li>
          <li>1 confirmation required (~10 minutes after sending)</li>
        </ul>
      </div>
    </div>
  );
}
