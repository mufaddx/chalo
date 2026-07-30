"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell, CalendarCheck, Compass, Heart, LayoutGrid, LifeBuoy, LogOut, Menu, Scale, Search, Settings, User, Users, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";

const NAV_LINKS = [
  { label: "Explore Tours", href: "/search" },
  { label: "Destinations", href: "/search" },
  { label: "Travel Agencies", href: "/search" },
  { label: "Blog", href: "/#blog" },
];

// Mirrors components/dashboard/sidebar.tsx's NAV — the mobile menu shows
// these alongside the site links instead of the dashboard having its own
// separate hamburger/drawer, so there's only ever one mobile menu control.
const ACCOUNT_LINKS = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Compare Tours", href: "/dashboard/compare", icon: Scale },
  { label: "Travellers", href: "/dashboard/travellers", icon: Users },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, status, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "glass border-b border-line" : "bg-transparent"
      )}
    >
      <div className="container-page flex h-[72px] items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-ink lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-gold">
              <Compass size={18} />
            </span>
            <span className="font-display text-[20px] font-semibold tracking-tight text-ink">
              Voyagr
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14.5px] font-medium text-ink/80 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/search"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-paper-soft hover:text-ink"
          >
            <Search size={18} />
          </Link>
          <button
            aria-label="Wishlist"
            className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-paper-soft hover:text-ink"
          >
            <Heart size={18} />
          </button>
          <button
            aria-label="Compare"
            className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-paper-soft hover:text-ink"
          >
            <Scale size={18} />
          </button>
          <div className="mx-1 h-6 w-px bg-line" />
          {status === "authenticated" && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm font-medium text-ink hover:border-ink"
              >
                <User size={15} /> {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={() => logout()}
                aria-label="Log out"
                className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-paper-soft hover:text-ink"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm font-medium text-ink hover:border-ink"
            >
              <User size={15} /> Log in
            </Link>
          )}
          <Link
            href="/agency/register"
            className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal"
          >
            List your agency
          </Link>
        </div>
      </div>

      {open && (
        <div className="glass border-t border-line lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-paper-soft"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {status === "authenticated" && user && (
              <>
                <div className="my-2 h-px bg-line" />
                <span className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate">
                  My Account
                </span>
                {ACCOUNT_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-paper-soft"
                    onClick={() => setOpen(false)}
                  >
                    <link.icon size={17} className="text-slate" />
                    {link.label}
                  </Link>
                ))}
              </>
            )}

            <div className="mt-2 flex gap-2 px-3">
              {status === "authenticated" && user ? (
                <button onClick={handleLogout} className="flex-1 rounded-full bg-ink px-3 py-2.5 text-center text-sm font-medium text-white">
                  Log out
                </button>
              ) : (
                <>
                  <Link href="/login" className="flex-1 rounded-full border border-line px-3 py-2.5 text-center text-sm font-medium">
                    Log in
                  </Link>
                  <Link href="/agency/register" className="flex-1 rounded-full bg-ink px-3 py-2.5 text-center text-sm font-medium text-white">
                    List agency
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
