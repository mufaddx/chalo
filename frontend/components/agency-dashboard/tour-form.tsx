"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, ImagePlus, WifiOff, X } from "lucide-react";
import { categories as mockCategories, destinations as mockDestinations } from "@/lib/data";
import type { ItineraryDay, Tour, Transport } from "@/types";
import { cn } from "@/lib/utils";
import { fetchPublicCategories, fetchPublicDestinations, type PublicCategory, type PublicDestination } from "@/lib/api/taxonomy";
import { createAgencyTour } from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import EditableList from "./editable-list";
import ItineraryBuilder from "./itinerary-builder";

const TRANSPORT_OPTIONS: Transport[] = ["Flight", "Train", "Bus", "Cab"];

interface FormState {
  title: string;
  destination: string;
  price: number;
  originalPrice: number;
  nights: number;
  days: number;
  hotelRating: number;
  transport: Transport[];
  categories: string[];
  mealsIncluded: boolean;
  freeCancellation: boolean;
  instantConfirmation: boolean;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  cancellationPolicy: string;
  itinerary: ItineraryDay[];
  gallery: string[];
}

function toFormState(tour?: Tour): FormState {
  if (!tour) {
    return {
      title: "", destination: mockDestinations[0].name, price: 0, originalPrice: 0,
      nights: 3, days: 4, hotelRating: 4, transport: [], categories: [],
      mealsIncluded: false, freeCancellation: false, instantConfirmation: false,
      highlights: [], inclusions: [], exclusions: [], thingsToCarry: [],
      cancellationPolicy: "", itinerary: [], gallery: [],
    };
  }
  return {
    title: tour.title, destination: tour.destination, price: tour.price, originalPrice: tour.originalPrice,
    nights: tour.nights, days: tour.days, hotelRating: tour.hotelRating, transport: tour.transport,
    categories: tour.category as string[], mealsIncluded: tour.mealsIncluded,
    freeCancellation: tour.freeCancellation, instantConfirmation: tour.instantConfirmation,
    highlights: tour.highlights, inclusions: tour.inclusions, exclusions: tour.exclusions,
    thingsToCarry: tour.thingsToCarry, cancellationPolicy: "", itinerary: tour.itinerary, gallery: tour.gallery,
  };
}

export default function TourForm({ mode, tour }: { mode: "create" | "edit"; tour?: Tour }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(tour));
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liveNote, setLiveNote] = useState<string | null>(null);

  const [liveCategories, setLiveCategories] = useState<PublicCategory[] | null>(null);
  const [liveDestinations, setLiveDestinations] = useState<PublicDestination[] | null>(null);

  useEffect(() => {
    Promise.all([fetchPublicCategories(), fetchPublicDestinations()])
      .then(([cats, dests]) => {
        setLiveCategories(cats);
        setLiveDestinations(dests);
      })
      .catch(() => {
        setLiveCategories(null);
        setLiveDestinations(null);
      });
  }, []);

  const usingLiveTaxonomy = liveCategories !== null && liveDestinations !== null;
  const categoryOptions = usingLiveTaxonomy ? liveCategories! : mockCategories.map((c) => ({ id: c.slug, name: c.label as string, slug: c.slug, icon: c.icon }));
  const destinationOptions = usingLiveTaxonomy ? liveDestinations! : mockDestinations.map((d) => ({ id: d.name, name: d.name, slug: d.name, country: d.country }));

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const toggleFromArray = <T,>(arr: T[], value: T) => (arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Editing an existing tour still submits as a mock confirmation — doing
    // this for real needs the edit page to load the live tour by slug via
    // an agency-scoped endpoint that doesn't exist yet (only the list does).
    // Creating a brand new tour has no such dependency, so that path is real.
    if (mode === "create" && usingLiveTaxonomy) {
      setSubmitting(true);
      try {
        const destination = liveDestinations!.find((d) => d.name === form.destination);
        const categoryIds = liveCategories!.filter((c) => form.categories.includes(c.name)).map((c) => c.id);

        await createAgencyTour({
          destination_id: destination?.id ?? liveDestinations![0].id,
          title: form.title,
          price: form.price,
          original_price: form.originalPrice,
          duration_nights: form.nights,
          duration_days: form.days,
          hotel_rating: form.hotelRating,
          transport: form.transport,
          meals_included: form.mealsIncluded,
          free_cancellation: form.freeCancellation,
          instant_confirmation: form.instantConfirmation,
          highlights: form.highlights,
          inclusions: form.inclusions,
          exclusions: form.exclusions,
          things_to_carry: form.thingsToCarry,
          cancellation_policy: form.cancellationPolicy || undefined,
          category_ids: categoryIds.length ? categoryIds : [liveCategories![0].id],
          itinerary: form.itinerary.map((d) => ({ day_number: d.day, title: d.title, description: d.description })),
        });
        setSubmitted(true);
      } catch (err) {
        setLiveNote(
          err instanceof ApiError
            ? `Submitted locally only — the API rejected it: ${err.message}`
            : "Submitted locally only — couldn't reach the API."
        );
        setSubmitted(true);
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-line bg-white py-16 text-center">
        <CheckCircle2 size={44} className="text-teal" />
        <h2 className="mt-4 font-display text-xl font-semibold text-ink">
          {mode === "create" ? "Tour submitted for approval" : "Changes submitted for approval"}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate">
          Per platform policy, every {mode === "create" ? "new tour" : "edit to a published tour"} is reviewed
          by the Voyagr team before it goes live. This usually takes under 24 hours.
        </p>
        {liveNote && (
          <div className="mt-3 flex max-w-sm items-start gap-2 rounded-xl border border-gold/30 bg-gold-pale p-3 text-left text-[12.5px] text-gold-deep">
            <WifiOff size={14} className="mt-0.5 shrink-0" /> <span>{liveNote}</span>
          </div>
        )}
        <button
          onClick={() => router.push("/agency/dashboard/tours")}
          className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal"
        >
          Back to my tours
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      {mode === "create" && !usingLiveTaxonomy && (
        <p className="rounded-xl border border-gold/30 bg-gold-pale px-4 py-2.5 text-[12.5px] text-gold-deep">
          Can&apos;t reach the Voyagr API right now, so submitting this will only show a local confirmation — nothing will actually be saved.
        </p>
      )}
      {/* Basic info */}
      <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <h2 className="font-display text-base font-semibold text-ink">Basic information</h2>
        <div className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
            Tour title
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Ladakh: Monasteries & High Mountain Passes"
              className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
              Destination
              <select
                value={form.destination}
                onChange={(e) => set("destination", e.target.value)}
                className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
              >
                {destinationOptions.map((d) => <option key={d.slug}>{d.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
              Nights
              <input type="number" min={0} max={60} required value={form.nights} onChange={(e) => set("nights", Number(e.target.value))} className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
              Days
              <input type="number" min={1} max={61} required value={form.days} onChange={(e) => set("days", Number(e.target.value))} className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
            </label>
          </div>

          <div>
            <label className="text-[13px] font-medium text-slate">Categories</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categoryOptions.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => set("categories", toggleFromArray(form.categories, c.name))}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    form.categories.includes(c.name) ? "border-ink bg-ink text-white" : "border-line text-slate hover:border-ink hover:text-ink"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & logistics */}
      <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <h2 className="font-display text-base font-semibold text-ink">Pricing &amp; logistics</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
            Price per person (₹)
            <input type="number" min={0} required value={form.price} onChange={(e) => set("price", Number(e.target.value))} className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
            Original price (₹)
            <input type="number" min={0} required value={form.originalPrice} onChange={(e) => set("originalPrice", Number(e.target.value))} className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate">
            Hotel rating
            <select value={form.hotelRating} onChange={(e) => set("hotelRating", Number(e.target.value))} className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-ink">
              {[3, 4, 5].map((r) => <option key={r} value={r}>{r} star</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <label className="text-[13px] font-medium text-slate">Transport</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {TRANSPORT_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("transport", toggleFromArray(form.transport, t))}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  form.transport.includes(t) ? "border-ink bg-ink text-white" : "border-line text-slate hover:border-ink hover:text-ink"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-5">
          {([
            ["mealsIncluded", "Meals included"],
            ["freeCancellation", "Free cancellation"],
            ["instantConfirmation", "Instant confirmation"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-ink/85">
              <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="h-4 w-4 accent-[var(--ink)]" />
              {label}
            </label>
          ))}
        </div>
      </section>

      {/* Media */}
      <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <h2 className="font-display text-base font-semibold text-ink">Photos &amp; video</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {form.gallery.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
              <Image src={src} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => set("gallery", form.gallery.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("gallery", [...form.gallery, `https://picsum.photos/seed/upload-${Date.now()}/600/600`])}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line-strong text-slate hover:border-ink hover:text-ink"
          >
            <ImagePlus size={18} />
            <span className="text-[11px] font-medium">Upload</span>
          </button>
        </div>
      </section>

      {/* Itinerary */}
      <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <h2 className="font-display text-base font-semibold text-ink">Day-wise itinerary</h2>
        <div className="mt-4">
          <ItineraryBuilder days={form.itinerary} onChange={(d) => set("itinerary", d)} />
        </div>
      </section>

      {/* Lists */}
      <section className="grid grid-cols-1 gap-6 rounded-[var(--radius-lg)] border border-line bg-white p-5 sm:grid-cols-2">
        <EditableList label="Highlights" items={form.highlights} onChange={(v) => set("highlights", v)} placeholder="e.g. Sunset camel safari" />
        <EditableList label="Inclusions" items={form.inclusions} onChange={(v) => set("inclusions", v)} placeholder="e.g. Daily breakfast" />
        <EditableList label="Exclusions" items={form.exclusions} onChange={(v) => set("exclusions", v)} placeholder="e.g. Airfare" />
        <EditableList label="Things to carry" items={form.thingsToCarry} onChange={(v) => set("thingsToCarry", v)} placeholder="e.g. Sunscreen" />
      </section>

      <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        <label className="text-[13px] font-medium text-slate">Cancellation policy</label>
        <textarea
          value={form.cancellationPolicy}
          onChange={(e) => set("cancellationPolicy", e.target.value)}
          rows={3}
          placeholder="Describe your refund terms"
          className="mt-2 w-full resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
        />
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-teal disabled:opacity-60">
          {submitting ? "Submitting..." : mode === "create" ? "Submit for approval" : "Save changes"}
        </button>
        <span className="text-xs text-slate">
          {mode === "create" ? "New tours require admin approval before going live." : "Edits to live tours are re-reviewed before publishing."}
        </span>
      </div>
    </form>
  );
}
