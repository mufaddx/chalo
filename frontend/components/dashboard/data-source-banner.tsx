import { CheckCircle2, Info, WifiOff } from "lucide-react";
import Link from "next/link";

export function LiveDataBanner() {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl border border-teal/25 bg-teal-soft px-4 py-2.5 text-[13px] text-teal">
      <CheckCircle2 size={15} className="shrink-0" />
      Showing your real bookings from the Voyagr API.
    </div>
  );
}

export function DemoDataBanner({ reason }: { reason: "guest" | "offline" }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl border border-gold/30 bg-gold-pale px-4 py-2.5 text-[13px] text-gold-deep">
      {reason === "offline" ? <WifiOff size={15} className="shrink-0" /> : <Info size={15} className="shrink-0" />}
      {reason === "offline" ? (
        <span>Can&apos;t reach the Voyagr API right now — showing sample data instead.</span>
      ) : (
        <span>
          Showing sample data.{" "}
          <Link href="/login" className="font-medium underline underline-offset-2">
            Log in
          </Link>{" "}
          to see your real bookings.
        </span>
      )}
    </div>
  );
}
