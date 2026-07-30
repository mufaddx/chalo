import Link from "next/link";

const SECTIONS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Search tours", href: "/search" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "My Bookings", href: "/dashboard/bookings" },
      { label: "Wishlist", href: "/dashboard/wishlist" },
      { label: "Compare tours", href: "/dashboard/compare" },
      { label: "Profile", href: "/dashboard/profile" },
    ],
  },
  {
    title: "For agencies",
    links: [
      { label: "List your agency", href: "/agency/register" },
      { label: "Agency dashboard", href: "/agency/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Voyagr", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Support", href: "/support" },
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="container-page py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Sitemap</h1>
      <p className="mt-2 text-sm text-slate">Every page on Voyagr, in one place.</p>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-sm font-semibold text-ink">{section.title}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
