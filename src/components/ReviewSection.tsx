"use client";

import { useState, useEffect } from "react";
import { Star, BadgeCheck } from "lucide-react";

interface ReviewData {
  id: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
  user: { name: string };
}

function StarRating({
  rating,
  interactive = false,
  onRate,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`h-4 w-4 ${
              i <= (hovered || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-neutral-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch reviews
    fetch(`/api/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews ?? []);
        setAverageRating(data.averageRating ?? 0);
        setCount(data.count ?? 0);
      })
      .catch(() => {});

    // Check if logged in
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!title.trim() || !body.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, body }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit review");
        return;
      }

      const data = await res.json();
      setReviews((prev) => [data.review, ...prev]);
      setCount((prev) => prev + 1);
      setAverageRating(
        (prev) => (prev * (count) + rating) / (count + 1)
      );
      setShowForm(false);
      setRating(0);
      setTitle("");
      setBody("");
    } catch {
      setError("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-xl font-bold text-neutral-900">Customer Reviews</h2>

      {/* Average Rating Summary */}
      <div className="mt-4 flex items-center gap-3">
        <StarRating rating={Math.round(averageRating)} />
        <span className="text-sm text-neutral-500">
          {averageRating.toFixed(1)} out of 5 ({count}{" "}
          {count === 1 ? "review" : "reviews"})
        </span>
      </div>

      {/* Write a Review Button */}
      {isLoggedIn && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-6 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-500"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">
            Write a Review
          </h3>

          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          <div className="mb-4">
            <label className="mb-1 block text-sm text-neutral-500">Rating</label>
            <StarRating rating={rating} interactive onRate={setRating} />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm text-neutral-500">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summary of your review"
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-sky-500"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm text-neutral-500">Review</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your experience with this product"
              rows={4}
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-500 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-neutral-500">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs font-medium text-sky-600">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <h4 className="mt-1 text-sm font-semibold text-neutral-900">
                    {review.title}
                  </h4>
                </div>
                <span className="text-xs text-neutral-400">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {review.body}
              </p>
              <p className="mt-2 text-xs text-neutral-400">
                by {review.user.name}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
