"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { verifyPayment } from "@/lib/api/payments";
import { ApiError, isNetworkError } from "@/lib/api/client";

// SabPaisa redirects here after checkout. Its query params are not trusted —
// the backend always re-confirms via the Transaction Enquiry API. A UPI
// payment can take a few seconds to settle after the redirect fires, so a
// "still processing" result gets a few bounded retries before giving up.
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 3000;

export default function PaymentReturnPage() {
  const params = useParams<{ id: string }>();
  const bookingId = Number(params.id);
  const [state, setState] = useState<"checking" | "paid" | "failed" | "pending" | "error">("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = async (attempt: number) => {
      try {
        const result = await verifyPayment(bookingId);

        if (cancelled) return;

        if (result.payment_status === "paid") {
          setState("paid");
        } else if (result.message === "Payment failed.") {
          setState("failed");
        } else if (attempt < MAX_ATTEMPTS) {
          setTimeout(() => check(attempt + 1), RETRY_DELAY_MS);
        } else {
          setState("pending");
        }
      } catch (err) {
        if (cancelled) return;
        setState("error");
        setError(
          err instanceof ApiError
            ? isNetworkError(err)
              ? "Can't reach the payment service right now."
              : err.message
            : "Something went wrong while confirming your payment."
        );
      }
    };

    check(1);

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      {state === "checking" && (
        <>
          <Loader2 size={40} className="animate-spin text-slate" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Confirming your payment...</h1>
          <p className="mt-2 text-sm text-slate">This only takes a moment.</p>
        </>
      )}
      {state === "paid" && (
        <>
          <CheckCircle2 size={44} className="text-teal" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Payment received</h1>
          <p className="mt-2 text-sm text-slate">Your booking is now paid. A confirmation has been sent to your email.</p>
        </>
      )}
      {state === "failed" && (
        <>
          <XCircle size={44} className="text-danger" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Payment failed</h1>
          <p className="mt-2 text-sm text-slate">Your payment didn&apos;t go through. You can try again from My Bookings.</p>
        </>
      )}
      {state === "pending" && (
        <>
          <AlertCircle size={44} className="text-gold-deep" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Still processing</h1>
          <p className="mt-2 text-sm text-slate">We haven&apos;t received a final status yet. Check My Bookings shortly — it&apos;ll update automatically.</p>
        </>
      )}
      {state === "error" && (
        <>
          <AlertCircle size={44} className="text-danger" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Couldn&apos;t confirm payment</h1>
          <p className="mt-2 text-sm text-slate">{error}</p>
        </>
      )}

      <Link href="/dashboard/bookings" className="mt-6 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">
        Go to My Bookings
      </Link>
    </div>
  );
}
