"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Compass, WifiOff } from "lucide-react";
import { ApiError, isNetworkError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";

const DASHBOARD_BY_ROLE: Record<string, string> = {
  agency: "/agency/dashboard",
  admin: "/admin/dashboard",
  customer: "/dashboard",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; offline: boolean } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password, remember);
      // Prefer sending them back where they came from — but only if it
      // actually belongs to their role; RequireAuth would just bounce them
      // again otherwise, so there's no point routing through a dead end.
      const home = DASHBOARD_BY_ROLE[user.role] ?? "/dashboard";
      router.push(next && next.startsWith(home) ? next : home);
    } catch (err) {
      if (err instanceof ApiError) {
        setError({ message: err.message, offline: isNetworkError(err) || err.status === 0 });
      } else {
        setError({ message: "Something went wrong. Please try again.", offline: false });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-gold">
            <Compass size={20} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Log in to Voyagr</h1>
          <p className="mt-1 text-sm text-slate">Access your bookings, wishlist and saved travellers.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink"
          />
          <label className="flex items-center gap-2 text-[13px] text-ink/75">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[var(--ink)]" />
            Remember me
          </label>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/5 p-3 text-[13px] text-danger">
              {error.offline ? <WifiOff size={15} className="mt-0.5 shrink-0" /> : <AlertCircle size={15} className="mt-0.5 shrink-0" />}
              <span>
                {error.offline
                  ? "Can't reach the Voyagr API. Make sure the backend is running (composer install && php artisan serve) and NEXT_PUBLIC_API_URL points at it."
                  : error.message}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-full bg-ink py-3 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate">
          New to Voyagr?{" "}
          <Link href="/register" className="font-medium text-ink hover:text-teal">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-page py-24 text-center text-sm text-slate">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
