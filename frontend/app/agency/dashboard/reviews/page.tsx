"use client";

import { useState } from "react";
import { Eye, EyeOff, Send } from "lucide-react";
import { agencyReviews as initial, type AgencyReview } from "@/lib/agency-dashboard-data";
import StarRating from "@/components/shared/star-rating";
import { cn } from "@/lib/utils";

export default function AgencyReviewsPage() {
  const [reviews, setReviews] = useState<AgencyReview[]>(initial);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const submitReply = (id: string) => {
    const text = replyDrafts[id]?.trim();
    if (!text) return;
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: text } : r)));
    setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Reviews</h1>
      <p className="mt-1 text-sm text-slate">Reply publicly, or hide reviews that violate guidelines (still visible to Voyagr admin).</p>

      <div className="mt-5 flex flex-col gap-4">
        {reviews.map((r) => (
          <div key={r.id} className={cn("rounded-[var(--radius-lg)] border bg-white p-5", r.hidden ? "border-line opacity-60" : "border-line")}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[14.5px] font-semibold text-ink">{r.author}</p>
                <p className="text-[12px] text-slate">{r.tourTitle} &middot; {r.date}</p>
                <StarRating rating={r.rating} size={13} className="mt-1.5" />
              </div>
              <button
                onClick={() => setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, hidden: !x.hidden } : x)))}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-ink hover:border-ink"
              >
                {r.hidden ? <><Eye size={12} /> Unhide</> : <><EyeOff size={12} /> Hide</>}
              </button>
            </div>

            <p className="mt-3 text-[14px] leading-relaxed text-ink/85">{r.text}</p>

            {r.reply ? (
              <div className="mt-3 rounded-xl bg-paper-soft p-3.5">
                <span className="text-[11px] font-semibold text-teal">Your reply</span>
                <p className="mt-1 text-[13px] text-ink/75">{r.reply}</p>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <input
                  value={replyDrafts[r.id] ?? ""}
                  onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  placeholder="Write a public reply..."
                  className="flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
                />
                <button
                  onClick={() => submitReply(r.id)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-teal"
                >
                  <Send size={13} /> Reply
                </button>
              </div>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="rounded-[var(--radius-lg)] border border-line bg-white py-16 text-center text-sm text-slate">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}
