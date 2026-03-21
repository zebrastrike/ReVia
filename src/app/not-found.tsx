import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-white">Page Not Found</h2>
      <p className="mt-3 max-w-md text-gray-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
