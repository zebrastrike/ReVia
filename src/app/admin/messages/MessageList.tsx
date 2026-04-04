"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessageList({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  async function toggleRead(id: string, read: boolean) {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
  }

  async function deleteMessage(id: string) {
    await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  const filtered = filter === "unread" ? messages.filter((m) => !m.read) : messages;

  return (
    <>
      <div className="flex gap-2 mb-4">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              filter === f ? "bg-sky-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {f === "all" ? "All" : "Unread"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white/50 border border-sky-200/40 rounded-2xl p-12 text-center">
          <Mail className="mx-auto h-10 w-10 text-stone-300 mb-3" />
          <p className="text-stone-500 text-sm">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => {
            const isExpanded = expanded === msg.id;
            return (
              <div
                key={msg.id}
                className={`bg-white/50 border rounded-xl overflow-hidden transition-colors ${
                  msg.read ? "border-sky-200/40" : "border-sky-400/50 bg-sky-50/30"
                }`}
              >
                <button
                  onClick={() => {
                    setExpanded(isExpanded ? null : msg.id);
                    if (!msg.read) toggleRead(msg.id, true);
                  }}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  <div className="shrink-0">
                    {msg.read ? (
                      <MailOpen size={16} className="text-stone-400" />
                    ) : (
                      <Mail size={16} className="text-sky-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${msg.read ? "text-stone-600" : "font-semibold text-stone-800"}`}>
                        {msg.subject}
                      </p>
                      {!msg.read && (
                        <span className="shrink-0 rounded-full bg-sky-500 w-2 h-2" />
                      )}
                    </div>
                    <p className="text-xs text-stone-400 truncate mt-0.5">
                      {msg.name} &lt;{msg.email}&gt;
                    </p>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  {isExpanded ? <ChevronUp size={14} className="text-stone-400" /> : <ChevronDown size={14} className="text-stone-400" />}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 border-t border-sky-100/60">
                    <div className="flex items-center gap-4 py-3 text-xs text-stone-500">
                      <span>From: <strong className="text-stone-700">{msg.name}</strong></span>
                      <span>{msg.email}</span>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-sky-100/60">
                      <button
                        onClick={() => toggleRead(msg.id, !msg.read)}
                        className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors"
                      >
                        {msg.read ? <Mail size={13} /> : <MailOpen size={13} />}
                        Mark as {msg.read ? "unread" : "read"}
                      </button>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                        className="flex items-center gap-1.5 text-xs text-sky-500 hover:text-sky-600 transition-colors"
                      >
                        Reply
                      </a>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors ml-auto"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
