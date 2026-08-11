import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-2)]">
      <AdminHeader />
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
