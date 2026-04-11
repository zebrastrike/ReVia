import { prisma } from "@/lib/prisma";
import { MessageCircle, Mail, Package, Clock } from "lucide-react";
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.chatLead.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  const withEmail = leads.filter((l) => l.email);
  const topProducts = new Map<string, number>();
  for (const lead of leads) {
    const products: string[] = JSON.parse(lead.productsAsked || "[]");
    for (const p of products) {
      topProducts.set(p, (topProducts.get(p) ?? 0) + 1);
    }
  }
  const sortedProducts = Array.from(topProducts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Chat Leads</h1>
        <p className="text-sm text-neutral-500 mt-1">Conversations from the research assistant bot</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <MessageCircle className="h-5 w-5 text-sky-500 mb-2" />
          <p className="text-2xl font-bold text-neutral-900">{leads.length}</p>
          <p className="text-xs text-neutral-500">Total Conversations</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <Mail className="h-5 w-5 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-neutral-900">{withEmail.length}</p>
          <p className="text-xs text-neutral-500">Emails Captured</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <Package className="h-5 w-5 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-neutral-900">{topProducts.size}</p>
          <p className="text-xs text-neutral-500">Products Discussed</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <Clock className="h-5 w-5 text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-neutral-900">
            {leads.length > 0 ? Math.round(leads.reduce((s, l) => s + l.messageCount, 0) / leads.length) : 0}
          </p>
          <p className="text-xs text-neutral-500">Avg Messages/Chat</p>
        </div>
      </div>

      {/* Top Products Asked About */}
      {sortedProducts.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider mb-3">Most Asked-About Products</h2>
          <div className="flex flex-wrap gap-2">
            {sortedProducts.map(([product, count]) => (
              <span key={product} className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/50 px-3 py-1 text-xs font-medium text-sky-700">
                {product}
                <span className="rounded-full bg-sky-200 px-1.5 py-0.5 text-[10px] font-bold text-sky-800">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Conversations */}
      <div className="space-y-3">
        {leads.length === 0 ? (
          <p className="text-neutral-400 text-sm py-12 text-center bg-white rounded-2xl border border-neutral-200">No chat conversations yet.</p>
        ) : (
          leads.map((lead) => {
            const products: string[] = JSON.parse(lead.productsAsked || "[]");
            const msgs: Array<{ role: string; content: string }> = JSON.parse(lead.messages || "[]");
            const firstMsg = msgs.find((m) => m.role === "user")?.content ?? "";

            return (
              <div key={lead.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-800 line-clamp-1">
                      {firstMsg || "No message"}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                      <span>{lead.messageCount} messages</span>
                      <span>{new Date(lead.updatedAt).toLocaleString()}</span>
                      {lead.ip && <span className="font-mono">{lead.ip.slice(0, 15)}</span>}
                    </div>
                  </div>
                  {lead.email && (
                    <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {lead.email}
                    </span>
                  )}
                </div>
                {products.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {products.map((p) => (
                      <span key={p} className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
