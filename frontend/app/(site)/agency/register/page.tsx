"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, UploadCloud } from "lucide-react";
import { registerAgency, uploadVerificationDocument } from "@/lib/api/registration";

const DOCUMENT_TYPES = [
  { value: "gst_certificate", label: "GST certificate" },
  { value: "pan_card", label: "PAN card" },
  { value: "trade_license", label: "Trade license" },
  { value: "other", label: "Other" },
] as const;

interface FormState {
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  agencyName: string;
  phone: string;
  officeAddress: string;
  city: string;
  yearsExperience: string;
  documentType: (typeof DOCUMENT_TYPES)[number]["value"];
}

const INITIAL: FormState = {
  ownerName: "",
  ownerEmail: "",
  ownerPassword: "",
  agencyName: "",
  phone: "",
  officeAddress: "",
  city: "",
  yearsExperience: "",
  documentType: "gst_certificate",
};

export default function AgencyRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [document, setDocument] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) {
      setError("Please attach your verification document.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const documentPath = await uploadVerificationDocument(document);
      await registerAgency({
        owner_name: form.ownerName,
        owner_email: form.ownerEmail,
        owner_password: form.ownerPassword,
        agency_name: form.agencyName,
        phone: form.phone,
        office_address: form.officeAddress,
        city: form.city,
        years_experience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
        document_type: form.documentType,
        document_path: documentPath,
      });
      setSubmitted(true);
    } catch (err) {
      const e = err as Error & { errors?: Record<string, string[]> };
      setError(e.message || "Something went wrong — please try again.");
      if (e.errors) setFieldErrors(e.errors);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-[var(--radius-lg)] border border-line bg-white py-16 text-center">
          <CheckCircle2 size={44} className="text-teal" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Registration submitted</h1>
          <p className="mt-2 px-6 text-sm text-slate">
            Our team will review your documents and get back to you within 2-3 business days. You can sign in once
            your agency is approved.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-xl">
        <span className="mb-2 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-gold-deep">For agencies</span>
        <h1 className="font-display text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">List your agency</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate">
          Submit your details and a verification document — every agency is reviewed by our team before going live.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 flex max-w-2xl flex-col gap-6">
        <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
          <h2 className="font-display text-base font-semibold text-ink">Owner account</h2>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
              Your name
              <input
                required
                value={form.ownerName}
                onChange={(e) => set("ownerName", e.target.value)}
                className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
              />
              {fieldErrors.owner_name && <span className="text-[12px] text-danger">{fieldErrors.owner_name[0]}</span>}
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
                Email address
                <input
                  required
                  type="email"
                  value={form.ownerEmail}
                  onChange={(e) => set("ownerEmail", e.target.value)}
                  className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                />
                {fieldErrors.owner_email && <span className="text-[12px] text-danger">{fieldErrors.owner_email[0]}</span>}
              </label>
              <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
                Password
                <input
                  required
                  type="password"
                  minLength={8}
                  value={form.ownerPassword}
                  onChange={(e) => set("ownerPassword", e.target.value)}
                  className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                />
                {fieldErrors.owner_password && <span className="text-[12px] text-danger">{fieldErrors.owner_password[0]}</span>}
              </label>
            </div>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
              Phone number
              <input
                required
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
              />
              {fieldErrors.phone && <span className="text-[12px] text-danger">{fieldErrors.phone[0]}</span>}
            </label>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
          <h2 className="font-display text-base font-semibold text-ink">Agency details</h2>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
              Agency name
              <input
                required
                value={form.agencyName}
                onChange={(e) => set("agencyName", e.target.value)}
                className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
              />
              {fieldErrors.agency_name && <span className="text-[12px] text-danger">{fieldErrors.agency_name[0]}</span>}
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
              Office address
              <input
                required
                value={form.officeAddress}
                onChange={(e) => set("officeAddress", e.target.value)}
                className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
              />
              {fieldErrors.office_address && <span className="text-[12px] text-danger">{fieldErrors.office_address[0]}</span>}
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
                City
                <input
                  required
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                />
                {fieldErrors.city && <span className="text-[12px] text-danger">{fieldErrors.city[0]}</span>}
              </label>
              <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
                Years of experience
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.yearsExperience}
                  onChange={(e) => set("yearsExperience", e.target.value)}
                  className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
          <h2 className="font-display text-base font-semibold text-ink">Verification document</h2>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
              Document type
              <select
                value={form.documentType}
                onChange={(e) => set("documentType", e.target.value as FormState["documentType"])}
                className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
              >
                {DOCUMENT_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong px-4 py-8 text-center text-slate hover:border-ink hover:text-ink">
              <UploadCloud size={22} />
              <span className="text-sm font-medium">{document ? document.name : "Click to upload (PDF, JPG, or PNG)"}</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setDocument(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </section>

        {error && (
          <p className="rounded-xl border border-gold/30 bg-gold-pale px-4 py-2.5 text-[12.5px] text-gold-deep">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-teal disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit for review"}
          </button>
          <span className="text-xs text-slate">Reviewed by our team before going live.</span>
        </div>
      </form>
    </div>
  );
}
