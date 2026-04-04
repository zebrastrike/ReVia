import { prisma } from "@/lib/prisma";
import NewsletterTable from "./NewsletterTable";
export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const subscribers = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Newsletter Subscribers</h1>
          <p className="text-sm text-stone-500 mt-1">{subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <NewsletterTable
        subscribers={subscribers.map((s) => ({
          id: s.id,
          email: s.email,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
