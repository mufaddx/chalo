"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import type { ApiUser } from "@/lib/api/types";

const DASHBOARD_BY_ROLE: Record<ApiUser["role"], string> = {
  customer: "/dashboard",
  agency: "/agency/dashboard",
  admin: "/admin/dashboard",
};

/**
 * Gates a dashboard section behind login + role.
 *
 * Important honesty note: this is a *client-side* guard. The token lives in
 * localStorage, which Next.js middleware (server-side, no localStorage
 * access) can't read — a real server-enforced gate would need to switch to
 * a cookie-based session. What actually stops an unauthorized person from
 * seeing real data either way is the backend: every protected endpoint here
 * requires a valid Sanctum token and the right role via `role:agency` /
 * `role:admin` middleware, and every page in this app already falls back to
 * clearly-labelled demo data if a fetch comes back unauthenticated. This
 * component's job is just the UX layer on top: don't show the dashboard
 * shell at all to someone who shouldn't be here, and send them somewhere
 * useful instead of a dead end.
 */
export default function RequireAuth({
  allowedRoles,
  children,
}: {
  allowedRoles: ApiUser["role"][];
  children: React.ReactNode;
}) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "guest") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.replace(DASHBOARD_BY_ROLE[user.role]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user, pathname]);

  const allowed = status === "authenticated" && user && allowedRoles.includes(user.role);

  if (!allowed) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <span className="grid h-11 w-11 animate-pulse place-items-center rounded-full bg-ink text-gold">
          <Compass size={20} />
        </span>
        <p className="text-sm text-slate">
          {status === "loading" ? "Checking your session…" : "Redirecting…"}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
