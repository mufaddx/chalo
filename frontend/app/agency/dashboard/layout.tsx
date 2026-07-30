import AgencyDashboardShell from "@/components/agency-dashboard/dashboard-shell";
import RequireAuth from "@/components/auth/require-auth";

export default function AgencyDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth allowedRoles={["agency"]}>
      <AgencyDashboardShell>{children}</AgencyDashboardShell>
    </RequireAuth>
  );
}
