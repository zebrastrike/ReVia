"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart } from "lucide-react";

export default function RemoveWishlistButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setRemoving(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={removing}
      className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
    >
      <Heart className="h-3.5 w-3.5 fill-red-400" />
      {removing ? "Removing..." : "Remove from Wishlist"}
    </button>
  );
}
