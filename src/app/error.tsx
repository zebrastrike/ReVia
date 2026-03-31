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
      <h1 className="text-4xl font-bold text-neutral-900">Something went wrong</h1>
      <p className="mt-3 max-w-md text-neutral-500">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-red-50 border border-red-200 p-4 text-left text-xs text-red-600">
          {error.message}
        </pre>
      )}
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-500"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg bg-neutral-100 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
