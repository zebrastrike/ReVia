"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function FeaturedToggle({
  productId,
  initialFeatured,
}: {
  productId: string;
  initialFeatured: boolean;
}) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      });
      if (res.ok) setFeatured(!featured);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
      title={featured ? "Remove from featured carousel" : "Add to featured carousel"}
    >
      <Star
        size={18}
        className={
          featured
            ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
            : "text-stone-300 hover:text-yellow-300"
        }
      />
    </button>
  );
}
