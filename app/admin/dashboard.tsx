"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-green-50 text-gray-900">
      <header className="border-b border-green-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              ChopHub Admin
            </p>
            <h1 className="text-2xl font-bold text-green-900">Operations dashboard</h1>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
          >
            Sign out
          </button>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Signed in as {adminEmail}</p>
          <h2 className="mt-1 text-2xl font-bold text-green-900">ChopHub-managed menu</h2>
          <p className="mt-2 text-gray-600">
            Vendor assignments are kept internal. Customers continue to see one unified
            ChopHub menu and ordering experience.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["16", "Menu items"],
            ["1", "Owner account"],
            ["0", "Vendor logins"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-green-700">{value}</p>
              <p className="mt-1 text-sm text-gray-600">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-green-900">Next management tools</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Meals & prices", "Availability", "Orders"].map((item) => (
              <div key={item} className="rounded-xl border border-green-100 p-4">
                <p className="font-semibold text-green-900">{item}</p>
                <p className="mt-1 text-sm text-gray-600">Coming next in the admin workspace.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
