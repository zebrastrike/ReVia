"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, Trash2, Loader2, Download, CheckCircle } from "lucide-react";

export default function CoaUpload({
  productId,
  productName,
  currentCoaUrl,
}: {
  productId: string;
  productName: string;
  currentCoaUrl: string | null;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "png", "jpg", "jpeg"].includes(ext)) {
      setMessage({ type: "error", text: "Only PDF, PNG, or JPG files accepted" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", productId);

      const res = await fetch("/api/admin/coa", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage({ type: "success", text: "COA uploaded!" });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Remove COA for ${productName}?`)) return;

    setRemoving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/coa", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to remove");
      setMessage({ type: "success", text: "COA removed" });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-sky-500" />
        <h2 className="text-base font-semibold text-neutral-900">Certificate of Analysis (COA)</h2>
      </div>

      {message && (
        <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {message.text}
        </div>
      )}

      {currentCoaUrl ? (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-emerald-800">COA uploaded</p>
              <p className="text-xs text-emerald-600 font-mono">{currentCoaUrl}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={currentCoaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-white border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition"
            >
              <Download className="h-3.5 w-3.5" /> View PDF
            </a>
            <button
              onClick={handleRemove}
              disabled={removing}
              className="flex items-center gap-1.5 rounded-lg bg-white border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
            >
              {removing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 p-6 text-center">
          <FileText className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-500 mb-3">No COA uploaded for this product</p>
          <label className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition cursor-pointer">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload COA PDF"}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-neutral-400 mt-2">PDF, PNG, or JPG — max 10MB</p>
        </div>
      )}
    </div>
  );
}
