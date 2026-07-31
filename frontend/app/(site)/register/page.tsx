"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Compass, WifiOff } from "lucide-react";
import { ApiError, isNetworkError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; offline: boolean } | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(form.name, form.email, form.password, form.confirm, form.phone || undefined);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        const firstFieldError = err.errors ? Object.values(err.errors)[0]?.[0] : undefined;
        setError({ message: firstFieldError ?? err.message, offline: isNetworkError(err) || err.status === 0 });
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
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-slate">Takes less than a minute.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3">
          <input required placeholder="Full name" value={form.name} onChange={set("name")} className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <input required type="email" placeholder="Email address" value={form.email} onChange={set("email")} className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <input required type="password" minLength={8} placeholder="Password (min. 8 characters)" value={form.password} onChange={set("password")} className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />
          <input required type="password" minLength={8} placeholder="Confirm password" value={form.confirm} onChange={set("confirm")} className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:border-ink" />

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/5 p-3 text-[13px] text-danger">
              {error.offline ? <WifiOff size={15} className="mt-0.5 shrink-0" /> : <AlertCircle size={15} className="mt-0.5 shrink-0" />}
              <span>
                {error.offline
                  ? "Can't reach the Voyagr API. Make sure the backend is running and NEXT_PUBLIC_API_URL points at it."
                  : error.message}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-full bg-gold py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink hover:text-teal">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
