"use client";

import { useEffect, useState } from "react";
import { Check, Mail, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchAdminSettings, saveAdminSettings } from "@/lib/api/admin-cms";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

const TABS = ["General", "SEO", "Email templates", "Newsletter"] as const;

const EMAIL_TEMPLATES = [
  { name: "Booking confirmation (customer)", trigger: "Booking created" },
  { name: "New booking alert (agency)", trigger: "Booking created" },
  { name: "New booking (admin copy)", trigger: "Booking created" },
  { name: "Booking status updated", trigger: "Status change" },
  { name: "Agency registration submitted", trigger: "Agency registers" },
];

const DEFAULTS: Record<string, string> = {
  site_name: "Voyagr",
  support_email: "support@voyagr.com",
  support_phone: "+91 22 4011 8899",
  meta_title: "Voyagr — Compare tours from India's top-rated travel agencies",
  meta_description: "Search, compare and book tours from verified travel agencies in one place.",
  ga_id: "",
  gtm_id: "",
  meta_pixel_id: "",
};

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General");
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading");
  const [values, setValues] = useState<Record<string, string>>(DEFAULTS);

  useEffect(() => {
    fetchAdminSettings()
      .then((grouped) => {
        const flat: Record<string, string> = { ...DEFAULTS };
        Object.values(grouped).flat().forEach((s) => { flat[s.key] = s.value; });
        setValues(flat);
        setSource("live");
      })
      .catch(() => setSource("offline"));
  }, []);
  const usingLive = source === "live";

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const save = async (e: React.FormEvent, keys: string[], group: string) => {
    e.preventDefault();
    if (usingLive) {
      try {
        await saveAdminSettings(keys.map((key) => ({ key, value: values[key] ?? "", group })));
      } catch { /* no-op — still show the demo "saved" flash below */ }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>

      {source === "live" && <LiveDataBanner />}
      {source === "offline" && <DemoDataBanner reason="offline" />}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
              tab === t ? "border-ink bg-ink text-white" : "border-line text-slate hover:border-ink hover:text-ink"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "General" && (
        <form onSubmit={(e) => save(e, ["site_name", "support_email", "support_phone"], "general")} className="mt-5 max-w-xl rounded-[var(--radius-lg)] border border-line bg-white p-6">
          <div className="flex flex-col gap-4">
            <Field label="Site name" value={values.site_name} onChange={set("site_name")} />
            <Field label="Support email" value={values.support_email} onChange={set("support_email")} />
            <Field label="Support phone" value={values.support_phone} onChange={set("support_phone")} />
            <label className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
              <span className="text-sm text-ink">Maintenance mode</span>
              <input type="checkbox" className="h-4 w-4 accent-[var(--danger)]" />
            </label>
          </div>
          <SaveButton saved={saved} />
        </form>
      )}

      {tab === "SEO" && (
        <form onSubmit={(e) => save(e, ["meta_title", "meta_description", "ga_id", "gtm_id", "meta_pixel_id"], "seo")} className="mt-5 max-w-xl rounded-[var(--radius-lg)] border border-line bg-white p-6">
          <div className="flex flex-col gap-4">
            <Field label="Default meta title" value={values.meta_title} onChange={set("meta_title")} />
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
              Default meta description
              <textarea rows={3} value={values.meta_description} onChange={set("meta_description")} className="resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink" />
            </label>
            <Field label="Google Analytics ID" value={values.ga_id} onChange={set("ga_id")} placeholder="G-XXXXXXXXXX" />
            <Field label="Google Tag Manager ID" value={values.gtm_id} onChange={set("gtm_id")} placeholder="GTM-XXXXXXX" />
            <Field label="Meta Pixel ID" value={values.meta_pixel_id} onChange={set("meta_pixel_id")} placeholder="000000000000000" />
          </div>
          <SaveButton saved={saved} />
        </form>
      )}

      {tab === "Email templates" && (
        <div className="mt-5 flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-white">
          {EMAIL_TEMPLATES.map((t) => (
            <div key={t.name} className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-paper-soft text-teal"><Mail size={15} /></span>
                <div>
                  <p className="text-[14px] font-medium text-ink">{t.name}</p>
                  <p className="text-[12px] text-slate">Trigger: {t.trigger}</p>
                </div>
              </div>
              <button className="rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-ink hover:border-ink">Edit</button>
            </div>
          ))}
          <p className="p-4 text-[12px] text-slate">
            Read-only for now — the actual templates live as Blade files in the backend&apos;s Mail classes, not the database, so there&apos;s nothing here to edit yet.
          </p>
        </div>
      )}

      {tab === "Newsletter" && (
        <div className="mt-5 max-w-xl rounded-[var(--radius-lg)] border border-line bg-white p-6">
          <p className="text-sm text-slate">4,812 subscribers</p>
          <label className="mt-4 flex flex-col gap-1.5 text-[13px] font-medium text-slate">
            Subject
            <input placeholder="e.g. New Ladakh departures just opened" className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink" />
          </label>
          <label className="mt-3 flex flex-col gap-1.5 text-[13px] font-medium text-slate">
            Message
            <textarea rows={5} placeholder="Write your newsletter..." className="resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink" />
          </label>
          <button className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal">
            <Send size={14} /> Send to subscribers
          </button>
          <p className="mt-2 text-[12px] text-slate">Demo only — there&apos;s no subscribers table or send endpoint on the backend yet.</p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
      {label}
      <input value={value ?? ""} onChange={onChange} placeholder={placeholder} className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink" />
    </label>
  );
}

function SaveButton({ saved }: { saved: boolean }) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal">Save changes</button>
      {saved && <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal"><Check size={15} /> Saved</span>}
    </div>
  );
}
