"use client";

import { useState } from "react";
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";
import { createPaymentOrder } from "@/lib/api/payments";
import { ApiError, isNetworkError } from "@/lib/api/client";

export default function PayNowButton({
  bookingId,
  className,
}: {
  bookingId: number;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    setStatus("loading");
    setError(null);

    try {
      const order = await createPaymentOrder(bookingId);

      // SabPaisa's checkout is a hosted page, not an in-page widget — send
      // the whole browser there and let the return page (which the backend
      // set as SabPaisa's returnUrl) pick verification back up.
      window.location.href = order.checkout_url;
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        setError(isNetworkError(err) ? "Can't reach the payment service right now." : err.message);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }
  };

  return (
    <div>
      <button
        onClick={pay}
        disabled={status === "loading"}
        className={className ?? "inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink hover:bg-gold-deep disabled:opacity-60"}
      >
        {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
        {status === "loading" ? "Opening payment..." : "Pay now"}
      </button>
      {error && (
        <p className="mt-2 flex items-start gap-1.5 text-[12.5px] text-danger">
          <AlertCircle size={13} className="mt-0.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
