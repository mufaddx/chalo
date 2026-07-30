import DashboardShell from "@/components/dashboard/dashboard-shell";
import RequireAuth from "@/components/auth/require-auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth allowedRoles={["customer"]}>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  );
}
