"use client";

import { useState, useEffect } from "react";
import { Ticket, Trophy, Loader2, Users, Hash, Gift, Settings } from "lucide-react";
import DrawingSettingsEditor from "@/components/DrawingSettingsEditor";

interface DrawingEntry {
  id: string;
  userId: string;
  month: string;
  entries: number;
  userName: string;
  userEmail: string;
}

interface Winner {
  userId: string;
  name: string;
  email: string;
  prize: string;
  amount: number;
  couponCode: string;
}

interface DrawingData {
  month: string;
  entries: DrawingEntry[];
  totalEntries: number;
  totalParticipants: number;
  result: { winners: Winner[]; drawnAt: string; totalEntries: number } | null;
}

interface DrawingSettings {
  drawingEntryAmount: number;
  drawingPrize1: number;
  drawingPrize2: number;
  drawingPrize3: number;
}

export default function AdminDrawingPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.toISOString().slice(0, 7));
  const [data, setData] = useState<DrawingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [settings, setSettings] = useState<DrawingSettings>({ drawingEntryAmount: 5000, drawingPrize1: 10000, drawingPrize2: 5000, drawingPrize3: 2500 });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => { if (d) setSettings(d); })
      .catch(() => {});
  }, []);

  const prizePool = (settings.drawingPrize1 + settings.drawingPrize2 + settings.drawingPrize3) / 100;

  const fetchData = (m: string) => {
    setLoading(true);
    fetch(`/api/admin/drawing?month=${m}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => { if (d) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(month); }, [month]);

  const handleDraw = async () => {
    if (!confirm(`Run the drawing for ${monthLabel}? This cannot be undone.`)) return;
    setDrawing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/drawing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setMessage({ type: "success", text: result.message });
      fetchData(month);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to run drawing" });
    } finally {
      setDrawing(false);
    }
  };

  const monthLabel = new Date(month + "-15").toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Generate month options (last 6 months + current)
  const monthOptions: string[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthOptions.push(d.toISOString().slice(0, 7));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ticket className="h-6 w-6 text-amber-500" />
          <h1 className="text-2xl font-bold text-stone-800">Monthly Drawing</h1>
        </div>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-sky-200/40 bg-white/50 px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-500/50"
        >
          {monthOptions.map((m) => (
            <option key={m} value={m}>
              {new Date(m + "-15").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-600"}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
        </div>
      ) : data ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-sky-200/40 bg-white/50 p-4">
              <Users className="h-5 w-5 text-sky-500 mb-2" />
              <p className="text-2xl font-bold text-stone-800">{data.totalParticipants}</p>
              <p className="text-xs text-stone-500">Participants</p>
            </div>
            <div className="rounded-xl border border-sky-200/40 bg-white/50 p-4">
              <Hash className="h-5 w-5 text-sky-500 mb-2" />
              <p className="text-2xl font-bold text-stone-800">{data.totalEntries}</p>
              <p className="text-xs text-stone-500">Total Entries</p>
            </div>
            <div className="rounded-xl border border-sky-200/40 bg-white/50 p-4">
              <Gift className="h-5 w-5 text-sky-500 mb-2" />
              <p className="text-2xl font-bold text-stone-800">${prizePool}</p>
              <p className="text-xs text-stone-500">Prize Pool</p>
            </div>
            <div className="rounded-xl border border-sky-200/40 bg-white/50 p-4">
              <Trophy className="h-5 w-5 text-sky-500 mb-2" />
              <p className="text-2xl font-bold text-stone-800">{data.result ? "Drawn" : "Pending"}</p>
              <p className="text-xs text-stone-500">Status</p>
            </div>
          </div>

          {/* Winners (if drawn) */}
          {data.result && (
            <div className="rounded-2xl border border-green-200/60 bg-green-50/50 p-6">
              <h2 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Winners — {monthLabel}
              </h2>
              <div className="space-y-3">
                {data.result.winners.map((w, i) => (
                  <div key={w.couponCode} className="flex items-center justify-between rounded-xl bg-white border border-green-200/50 p-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white text-sm ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-stone-400" : "bg-orange-400"}`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-800">{w.name}</p>
                        <p className="text-xs text-stone-400">{w.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-700">{w.prize}</p>
                      <p className="text-xs font-mono text-stone-500">{w.couponCode}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-400">
                Drawn on {new Date(data.result.drawnAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} from {data.result.totalEntries} total entries.
              </p>
            </div>
          )}

          {/* Run Drawing button */}
          {!data.result && data.totalEntries > 0 && (
            <button
              onClick={handleDraw}
              disabled={drawing}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              {drawing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trophy className="h-4 w-4" />
              )}
              {drawing ? "Drawing..." : `Run Drawing for ${monthLabel}`}
            </button>
          )}

          {!data.result && data.totalEntries === 0 && (
            <div className="rounded-xl border border-stone-200/40 bg-stone-50/50 p-6 text-center">
              <p className="text-sm text-stone-500">No entries yet for {monthLabel}.</p>
              <p className="text-xs text-stone-400 mt-1">Entries are earned automatically when customers place orders ($50 = 1 entry).</p>
            </div>
          )}

          {/* Entries table */}
          {data.entries.length > 0 && (
            <div className="rounded-2xl border border-sky-200/40 bg-white/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-sky-100">
                <h3 className="text-sm font-semibold text-stone-800">Entries — {monthLabel}</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sky-100 text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-500">Customer</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-500">Email</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Entries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100/50">
                  {data.entries.map((e) => (
                    <tr key={e.id} className="hover:bg-sky-50/30">
                      <td className="px-4 py-2.5 font-medium text-stone-700">{e.userName}</td>
                      <td className="px-4 py-2.5 text-stone-400">{e.userEmail}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-stone-800">{e.entries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}

      {/* Drawing Settings */}
      <div className="rounded-2xl border border-sky-200/40 bg-white/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-sky-500" />
          <h2 className="text-lg font-semibold text-stone-800">Drawing Settings</h2>
        </div>
        <p className="text-sm text-stone-500 mb-4">
          Configure how much customers need to spend for entries and the prize amounts for each winner.
        </p>
        <DrawingSettingsEditor
          entryAmount={settings.drawingEntryAmount}
          prize1={settings.drawingPrize1}
          prize2={settings.drawingPrize2}
          prize3={settings.drawingPrize3}
        />
      </div>
    </div>
  );
}
