import Link from "next/link";
import { Compass } from "lucide-react";
import { FacebookGlyph, InstagramGlyph, XGlyph, YoutubeGlyph } from "@/components/shared/social-icons";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "All tours", href: "/search" },
      { label: "Destinations", href: "/search" },
      { label: "Travel agencies", href: "/search" },
      { label: "Last-minute deals", href: "/search" },
      { label: "Travel blog", href: "/#blog" },
    ],
  },
  {
    title: "For travellers",
    links: [
      { label: "My bookings", href: "/dashboard" },
      { label: "Wishlist", href: "/dashboard" },
      { label: "Compare tours", href: "/dashboard" },
      { label: "Help centre", href: "/support" },
      { label: "Cancellation policy", href: "/support" },
    ],
  },
  {
    title: "For agencies",
    links: [
      { label: "List your agency", href: "/agency/register" },
      { label: "Agency dashboard", href: "/agency/dashboard" },
      { label: "Verification process", href: "/agency/register" },
      { label: "Success stories", href: "/#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Voyagr", href: "/#" },
      { label: "Careers", href: "/#" },
      { label: "Press", href: "/#" },
      { label: "Contact us", href: "/support" },
      { label: "Terms & privacy", href: "/#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white/70">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-ink">
              <Compass size={18} />
            </span>
            <span className="font-display text-[20px] font-semibold text-white">Voyagr</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            One search across India&apos;s verified travel agencies — transparent pricing,
            real itineraries, and a single booking policy no matter who you book with.
          </p>
          <div className="mt-6 flex gap-3">
            {[InstagramGlyph, FacebookGlyph, XGlyph, YoutubeGlyph].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Voyagr Technologies Pvt. Ltd. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/#" className="hover:text-gold">Privacy policy</Link>
            <Link href="/#" className="hover:text-gold">Terms of service</Link>
            <Link href="/#" className="hover:text-gold">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
