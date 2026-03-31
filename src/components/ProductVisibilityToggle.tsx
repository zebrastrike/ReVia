"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ProductVisibilityToggle({
  productId,
  initialActive,
}: {
  productId: string;
  initialActive: boolean;
}) {
  const [active, setActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (res.ok) setActive((prev) => !prev);
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      title={active ? "Click to hide" : "Click to show"}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all disabled:opacity-60 ${
        active
          ? "bg-sky-50 text-stone-600 hover:bg-sky-100"
          : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
      }`}
    >
      {active ? <Eye size={13} /> : <EyeOff size={13} />}
      {active ? "Live" : "Hidden"}
    </button>
  );
}
