import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-900">Simply Sourdough</span>
            <span className="text-stone-400">·</span>
            <span className="text-sm text-stone-500 font-medium">Admin</span>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
