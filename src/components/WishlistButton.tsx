"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistButton({ productId }: { productId: string }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if item is in wishlist
    fetch("/api/wishlist")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.items) {
          const found = data.items.some(
            (item: { productId: string }) => item.productId === productId
          );
          setInWishlist(found);
        }
      })
      .catch(() => {});
  }, [productId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      if (inWishlist) {
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          setInWishlist(false);
        }
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.ok || res.status === 409) {
          setInWishlist(true);
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="group/heart rounded-full bg-black/50 p-2 backdrop-blur-sm transition-colors hover:bg-black/70"
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          inWishlist
            ? "fill-red-500 text-red-500"
            : "text-white/70 group-hover/heart:text-red-400"
        }`}
      />
    </button>
  );
}
