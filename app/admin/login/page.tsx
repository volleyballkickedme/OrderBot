import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl mb-1">🍞</div>
          <h1 className="text-xl font-semibold text-amber-900">Simply Sourdough</h1>
          <p className="text-sm text-stone-500 mt-1">Admin Portal</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
