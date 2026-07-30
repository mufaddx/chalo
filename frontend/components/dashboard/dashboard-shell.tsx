import DashboardSidebar from "./sidebar";

// Mobile nav for account pages now lives entirely in the top Navbar's
// unified menu (site links + account links in one place) — this shell no
// longer needs its own hamburger/drawer, just the desktop sidebar.
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="mb-4 font-display text-lg font-semibold text-ink lg:hidden">My Account</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden rounded-[var(--radius-lg)] border border-line bg-white lg:block">
          <div className="sticky top-24">
            <DashboardSidebar />
          </div>
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
