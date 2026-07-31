"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HelpCircle, MessageCircle, Plus, Send, X } from "lucide-react";
import { supportTickets as mockInitial, type SupportTicket } from "@/lib/dashboard-data";
import { fetchMyTickets, createTicket, replyToTicket, type ApiSupportTicket } from "@/lib/api/support";
import { cn } from "@/lib/utils";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-gold-pale text-gold-deep",
  in_progress: "bg-teal-soft text-teal",
  resolved: "bg-paper-dim text-ink/70",
  closed: "bg-paper-dim text-ink/70",
};

export default function SupportPage() {
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [liveTickets, setLiveTickets] = useState<ApiSupportTicket[]>([]);
  const [mockTickets, setMockTickets] = useState<SupportTicket[]>(mockInitial);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  const load = () => {
    fetchMyTickets()
      .then((res) => { setLiveTickets(res.data); setSource("live"); })
      .catch(() => setSource("offline"));
  };
  useEffect(() => { load(); }, []);
  const usingLive = source === "live";

  const activeLive = usingLive ? liveTickets.find((t) => t.id === activeId) : null;
  const activeMock = !usingLive ? mockTickets.find((t) => t.id === activeId) : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Support</h1>
          <p className="mt-1 text-sm text-slate">Raise a ticket, or browse the help centre for quick answers.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/support" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink hover:border-ink">
            <HelpCircle size={15} /> Help centre
          </Link>
          <button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal">
            <Plus size={15} /> Raise ticket
          </button>
        </div>
      </div>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-3">
          {(usingLive ? liveTickets : mockTickets).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={cn(
                "rounded-[var(--radius-lg)] border p-4 text-left transition-colors",
                activeId === t.id ? "border-ink bg-white" : "border-line bg-white hover:border-ink"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] font-medium text-ink">{t.subject}</p>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", STATUS_STYLES[t.status])}>
                  {t.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-slate">
                {t.category} &middot; opened {usingLive ? (t as ApiSupportTicket).created_at?.slice(0, 10) : (t as SupportTicket).createdAt}
              </p>
            </button>
          ))}
          {(usingLive ? liveTickets : mockTickets).length === 0 && (
            <p className="rounded-[var(--radius-lg)] border border-line bg-white p-6 text-center text-sm text-slate">No tickets yet.</p>
          )}
        </div>

        <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
          {activeLive ? (
            <LiveTicketThread
              ticket={activeLive}
              onReply={async (text) => {
                const reply = await replyToTicket(activeLive.id, text);
                setLiveTickets((prev) => prev.map((t) => t.id === activeLive.id ? { ...t, replies: [...(t.replies ?? []), reply] } : t));
              }}
            />
          ) : activeMock ? (
            <MockTicketThread
              ticket={activeMock}
              onReply={(text) =>
                setMockTickets((prev) => prev.map((t) => t.id === activeMock.id
                  ? { ...t, messages: [...t.messages, { author: "You", text, date: "Just now" }] }
                  : t))
              }
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center text-slate">
              <MessageCircle size={26} className="text-slate-soft" />
              <p className="mt-3 text-sm">Select a ticket to see the conversation.</p>
            </div>
          )}
        </div>
      </div>

      {newOpen && (
        <NewTicketModal
          onClose={() => setNewOpen(false)}
          onCreate={async (subject, category, message) => {
            if (usingLive) {
              try {
                const ticket = await createTicket({ subject, category: category.toLowerCase(), message });
                setLiveTickets((prev) => [{ ...ticket, replies: [] }, ...prev]);
                setActiveId(ticket.id);
              } catch { /* no-op */ }
            } else {
              const id = `tk${Date.now()}`;
              setMockTickets((prev) => [
                { id, subject, category, status: "open", priority: "medium", createdAt: "Today", messages: [{ author: "You", text: message, date: "Today" }] },
                ...prev,
              ]);
              setActiveId(id);
            }
            setNewOpen(false);
          }}
        />
      )}
    </div>
  );
}

function LiveTicketThread({ ticket, onReply }: { ticket: ApiSupportTicket; onReply: (text: string) => Promise<void> }) {
  const [text, setText] = useState("");
  return (
    <div className="flex h-full flex-col">
      <h2 className="font-display text-[15px] font-semibold text-ink">{ticket.subject}</h2>
      <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto">
        <div className="max-w-[85%] self-start rounded-2xl bg-paper-soft px-4 py-2.5 text-[13.5px] text-ink">
          <p>{ticket.message}</p>
          <p className="mt-1 text-[10.5px] text-slate">{ticket.user?.name ?? "You"} &middot; {ticket.created_at?.slice(0, 10)}</p>
        </div>
        {(ticket.replies ?? []).map((m, i) => {
          const isYou = m.user?.name === ticket.user?.name;
          return (
            <div key={i} className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px]", isYou ? "self-end bg-ink text-white" : "self-start bg-paper-soft text-ink")}>
              <p>{m.message}</p>
              <p className={cn("mt-1 text-[10.5px]", isYou ? "text-white/50" : "text-slate")}>{m.user?.name ?? "Support"} &middot; {m.created_at?.slice(0, 10)}</p>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!text.trim()) return;
          await onReply(text.trim());
          setText("");
        }}
        className="mt-4 flex gap-2"
      >
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-ink" />
        <button type="submit" aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white hover:bg-teal">
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}

function MockTicketThread({ ticket, onReply }: { ticket: SupportTicket; onReply: (text: string) => void }) {
  const [text, setText] = useState("");

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-display text-[15px] font-semibold text-ink">{ticket.subject}</h2>
      <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto">
        {ticket.messages.map((m, i) => (
          <div key={i} className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px]", m.author === "You" ? "self-end bg-ink text-white" : "self-start bg-paper-soft text-ink")}>
            <p>{m.text}</p>
            <p className={cn("mt-1 text-[10.5px]", m.author === "You" ? "text-white/50" : "text-slate")}>{m.author} &middot; {m.date}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          onReply(text.trim());
          setText("");
        }}
        className="mt-4 flex gap-2"
      >
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm focus:outline-none focus:border-ink" />
        <button type="submit" aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white hover:bg-teal">
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}

function NewTicketModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (subject: string, category: string, message: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-t-[var(--radius-lg)] bg-white p-6 sm:rounded-[var(--radius-lg)]">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate hover:text-ink" aria-label="Close">
          <X size={20} />
        </button>
        <h3 className="font-display text-lg font-semibold text-ink">Raise a support ticket</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            onCreate(String(form.get("subject")), String(form.get("category")), String(form.get("message")));
          }}
          className="mt-4 flex flex-col gap-3"
        >
          <input name="subject" required placeholder="Subject" className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <select name="category" required defaultValue="booking" className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink">
            <option value="booking">Booking</option>
            <option value="payment">Payment</option>
            <option value="agency">Agency</option>
            <option value="technical">Technical</option>
            <option value="other">Other</option>
          </select>
          <textarea name="message" required rows={4} placeholder="Describe the issue" className="resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <button type="submit" className="mt-1 w-full rounded-full bg-ink py-3 text-sm font-medium text-white hover:bg-teal">
            Submit ticket
          </button>
        </form>
      </div>
    </div>
  );
}
