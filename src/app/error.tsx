"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-white">Something went wrong</h1>
      <p className="mt-3 max-w-md text-gray-400">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-red-500/10 p-4 text-left text-xs text-red-400">
          {error.message}
        </pre>
      )}
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
