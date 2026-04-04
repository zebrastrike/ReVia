import { prisma } from "@/lib/prisma";
import MessageList from "./MessageList";
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Messages</h1>
          <p className="text-sm text-stone-500 mt-1">
            {messages.filter((m) => !m.read).length} unread · {messages.length} total
          </p>
        </div>
      </div>
      <MessageList
        initialMessages={messages.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          message: m.message,
          read: m.read,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
