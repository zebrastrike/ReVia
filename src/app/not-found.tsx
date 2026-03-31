import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-neutral-900">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-neutral-900">Page Not Found</h2>
      <p className="mt-3 max-w-md text-neutral-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-neutral-100 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200"
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-500"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
