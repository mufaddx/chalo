import AdminShell from "@/components/admin-dashboard/dashboard-shell";
import RequireAuth from "@/components/auth/require-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
