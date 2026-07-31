import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, BedDouble, Check, ChevronRight, Download, MapPin, MessageCircle, Phone, ShieldCheck, Utensils,
} from "lucide-react";
import { bookings } from "@/lib/dashboard-data";
import { formatINR } from "@/lib/utils";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/dashboard/status-badge";
import CancelRequestButton from "@/components/dashboard/cancel-request-button";

export function generateStaticParams() {
  return bookings.map((b) => ({ id: b.id }));
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = bookings.find((b) => b.id === id);
  if (!booking) notFound();

  const { tour } = booking;

  return (
    <div>
      <Link href="/dashboard/bookings" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink">
        <ArrowLeft size={14} /> Back to my bookings
      </Link>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{tour.title}</h1>
          <p className="mt-1 text-sm text-slate">Booking {booking.bookingNumber} &middot; Booked on {booking.bookingDate}</p>
        </div>
        <div className="flex gap-2">
          <BookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="relative h-56 w-full overflow-hidden rounded-[var(--radius-lg)]">
            <Image src={tour.image} alt={tour.title} fill className="object-cover" />
          </div>

          {/* Tour info */}
          <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
            <h2 className="font-display text-base font-semibold text-ink">Tour information</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <span className="text-[11px] text-slate">Duration</span>
                <p className="text-sm font-medium text-ink">{tour.duration}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate">Travel date</span>
                <p className="text-sm font-medium text-ink">{booking.travelDate}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate">Travellers</span>
                <p className="text-sm font-medium text-ink">{booking.travellers}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate">Hotel rating</span>
                <p className="text-sm font-medium text-ink">{tour.hotelRating}★</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink/80">
              <span className="inline-flex items-center gap-1.5"><Utensils size={14} className="text-teal" /> {tour.mealsIncluded ? "Meals included" : "Meals not included"}</span>
              <span className="inline-flex items-center gap-1.5"><BedDouble size={14} className="text-teal" /> {tour.hotelRating}-star hotels</span>
            </div>
          </section>

          {/* Pickup / drop */}
          <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
            <h2 className="font-display text-base font-semibold text-ink">Pickup &amp; drop</h2>
            <div className="mt-3 flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-teal" />
                <div>
                  <span className="text-[11px] text-slate">Pickup point</span>
                  <p className="text-ink/85">{booking.pickupPoint}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold-deep" />
                <div>
                  <span className="text-[11px] text-slate">Drop point</span>
                  <p className="text-ink/85">{booking.dropPoint}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
            <h2 className="font-display text-base font-semibold text-ink">Booking timeline</h2>
            <div className="mt-4 flex flex-col gap-4">
              {booking.timeline.map((step, i) => (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${step.done ? "bg-teal text-white" : "bg-paper-dim text-slate-soft"}`}>
                      {step.done && <Check size={12} />}
                    </span>
                    {i !== booking.timeline.length - 1 && <span className="mt-1 w-px flex-1 border-l-2 border-dashed border-line-strong" />}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-medium ${step.done ? "text-ink" : "text-slate"}`}>{step.label}</p>
                    <p className="text-[12px] text-slate">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cancellation policy */}
          <section className="rounded-[var(--radius-lg)] border border-line bg-paper-soft p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
              <ShieldCheck size={16} className="text-teal" /> Cancellation policy
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink/75">
              {tour.freeCancellation
                ? "Free cancellation up to 48 hours before departure for a full refund. Cancellations within 48 hours are non-refundable."
                : "This tour has a strict cancellation policy. Cancellations made 15+ days before departure receive a 50% refund."}
            </p>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
            <h2 className="font-display text-base font-semibold text-ink">Documents</h2>
            <div className="mt-3 flex flex-col gap-2">
              {[
                ["Invoice", "PDF"],
                ["Payment receipt", "PDF"],
                ["Travel voucher", "PDF"],
              ].map(([label, type]) => (
                <button key={label} className="flex items-center justify-between rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink hover:border-ink">
                  <span>{label}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate"><Download size={13} /> {type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
            <h2 className="font-display text-base font-semibold text-ink">Amount paid</h2>
            <p className="mt-2 font-mono text-2xl font-semibold text-ink">{formatINR(booking.totalAmount)}</p>
            <p className="text-[12px] text-slate">for {booking.travellers} traveller{booking.travellers > 1 ? "s" : ""}</p>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
            <h2 className="font-display text-base font-semibold text-ink">Agency contact</h2>
            <Link href={`/agencies/${tour.agency.slug}`} className="mt-3 flex items-center gap-2.5">
              <span className="relative h-9 w-9 overflow-hidden rounded-full bg-paper-dim">
                <Image src={tour.agency.logo} alt={tour.agency.name} fill className="object-cover" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-ink">{tour.agency.name}</span>
                <span className="block text-[12px] text-slate">{tour.agency.city}</span>
              </span>
              <ChevronRight size={16} className="text-slate" />
            </Link>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={`tel:${tour.agency.phone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line py-2.5 text-xs font-medium text-ink hover:border-teal">
                <Phone size={13} className="text-teal" /> Call
              </a>
              <a href={`https://wa.me/910000000000`} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line py-2.5 text-xs font-medium text-ink hover:border-teal">
                <MessageCircle size={13} className="text-teal" /> WhatsApp
              </a>
            </div>
          </div>

          <CancelRequestButton booking={booking} />
        </div>
      </div>
    </div>
  );
}
