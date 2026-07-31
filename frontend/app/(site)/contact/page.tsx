"use client";

import { useState } from "react";
import { Clock, MapPin, Send } from "lucide-react";
import { submitContactForm } from "@/lib/api/contact";
import { ApiError } from "@/lib/api/client";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await submitContactForm({ name, email, subject, message });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't send your message — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-xl">
        <span className="mb-2 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-gold-deep">Get in touch</span>
        <h1 className="font-display text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">Contact us</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate">
          Questions about a booking, a partnership, or anything else — send a message and we&apos;ll get back to you.
          For booking or payment issues on an existing trip, signing in and raising a ticket from your dashboard gets a faster reply.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          {submitted ? (
            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-8 text-center">
              <h2 className="font-display text-xl font-semibold text-ink">Message sent</h2>
              <p className="mt-2 text-sm text-slate">Thanks — we&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
                  Your name
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
                  Email address
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
                Subject
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
                Message
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
                />
              </label>
              {error && <p className="text-[13px] text-danger">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-teal disabled:opacity-60"
              >
                <Send size={15} /> {submitting ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-[var(--radius-lg)] border border-line bg-paper-soft p-5">
            <h3 className="font-display text-base font-semibold text-ink">Response time</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <span className="flex items-center gap-2.5 text-ink/80"><Clock size={15} className="text-teal" /> Usually within 1–2 business days</span>
              <span className="flex items-center gap-2.5 text-ink/80"><MapPin size={15} className="text-teal" /> Based in India</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
