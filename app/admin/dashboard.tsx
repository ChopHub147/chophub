"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Meal = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
};

type Order = {
  id: number;
  customer_name: string;
  customer_phone: string;
  delivery_area: string;
  subtotal: number;
  status: string;
  created_at: string;
};

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"menu" | "availability" | "orders">("menu");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  const [mealError, setMealError] = useState("");
  const [savingMealId, setSavingMealId] = useState<number | null>(null);
  const [pendingAvailability, setPendingAvailability] = useState<Record<number, boolean>>({});
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetch("/api/admin/meals")
        .then(async (response) => {
          if (!response.ok) throw new Error("Could not load meals");
          return response.json() as Promise<Meal[]>;
        })
        .then(setMeals)
        .catch(() => setMealError("Meals could not be loaded. Check that Supabase has been seeded."))
        .finally(() => setIsLoadingMeals(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    fetch("/api/orders")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load orders");
        return response.json() as Promise<Order[]>;
      })
      .then(setOrders)
      .catch(() => undefined);
  }, []);

  const saveAvailability = async (meal: Meal) => {
    const available = pendingAvailability[meal.id] ?? meal.available;
    setSavingMealId(meal.id);
    setMealError("");
    const response = await fetch("/api/admin/meals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: meal.id, available }),
    });

    if (!response.ok) {
      setMealError("That availability change could not be saved.");
    } else {
      setMeals((current) =>
        current.map((item) => (item.id === meal.id ? { ...item, available } : item))
      );
      setPendingAvailability((current) => {
        const next = { ...current };
        delete next[meal.id];
        return next;
      });
    }
    setSavingMealId(null);
  };

  const updateMeal = async (meal: Meal) => {
    setSavingMealId(meal.id);
    setMealError("");
    const response = await fetch("/api/admin/meals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meal),
    });

    if (!response.ok) {
      setMealError("That meal update could not be saved.");
    }
    setSavingMealId(null);
  };

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
            [String(meals.length), "Menu items"],
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
          <div className="flex flex-wrap gap-2 border-b border-green-100 pb-4">
            {[
              ["menu", "Meals & prices"],
              ["availability", "Availability"],
              ["orders", "Orders"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveSection(value as typeof activeSection)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  activeSection === value
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-800 hover:bg-green-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {activeSection === "menu" && (
            <div className="pt-5">
              <h2 className="text-xl font-bold text-green-900">Meals & prices</h2>
              <p className="mt-1 text-sm text-gray-600">
                Edit the customer-facing meal details here. Changes are saved in Supabase.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {meals.map((meal) => (
                  <div key={meal.id} className="rounded-xl border border-green-100 p-4">
                    <div className="grid gap-2">
                      <input className="rounded-lg border border-green-200 px-3 py-2 font-medium" value={meal.name} onChange={(event) => setMeals((current) => current.map((item) => item.id === meal.id ? { ...item, name: event.target.value } : item))} />
                      <textarea className="rounded-lg border border-green-200 px-3 py-2 text-sm" value={meal.description} onChange={(event) => setMeals((current) => current.map((item) => item.id === meal.id ? { ...item, description: event.target.value } : item))} />
                      <div className="grid grid-cols-2 gap-2">
                        <label className="text-xs font-semibold text-gray-600">Price (₦)<input type="number" min="0" className="mt-1 w-full rounded-lg border border-green-200 px-3 py-2" value={meal.price} onChange={(event) => setMeals((current) => current.map((item) => item.id === meal.id ? { ...item, price: Number(event.target.value) } : item))} /></label>
                        <select className="rounded-lg border border-green-200 px-3 py-2" value={meal.category} onChange={(event) => setMeals((current) => current.map((item) => item.id === meal.id ? { ...item, category: event.target.value } : item))}>
                          <option value="soup-swallow">Soup and Swallow</option>
                          <option value="meat">Meat</option>
                          <option value="rice">Rice</option>
                          <option value="dessert">Dessert</option>
                        </select>
                      </div>
                      <button type="button" onClick={() => updateMeal(meal)} disabled={savingMealId === meal.id} className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        {savingMealId === meal.id ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === "availability" && (
            <div className="pt-5">
              <h2 className="text-xl font-bold text-green-900">Availability</h2>
              <p className="mt-1 text-sm text-gray-600">
                Toggle an item off when it is temporarily unavailable. This setting is
                saved in Supabase and applies across devices.
              </p>
              {isLoadingMeals && <p className="mt-4 text-sm text-gray-600">Loading meals...</p>}
              {mealError && <p className="mt-4 text-sm text-red-600">{mealError}</p>}
              <div className="mt-4 space-y-2">
                {meals.map((meal) => {
                  return (
                    <div key={meal.id} className="flex items-center justify-between rounded-xl border border-green-100 p-3">
                      <span className="font-medium text-green-900">{meal.name}</span>
                      <div className="flex items-center gap-2">
                      <select
                         aria-label={`Availability for ${meal.name}`}
                         value={String(pendingAvailability[meal.id] ?? meal.available)}
                         onChange={(event) =>
                           setPendingAvailability((current) => ({
                             ...current,
                             [meal.id]: event.target.value === "true",
                           }))
                         }
                         className="rounded-lg border border-green-200 px-2 py-1.5 text-xs font-semibold"
                      >
                         <option value="true">Available</option>
                         <option value="false">Unavailable</option>
                      </select>
                      <button
                         type="button"
                         onClick={() => saveAvailability(meal)}
                         disabled={savingMealId === meal.id || pendingAvailability[meal.id] === undefined}
                         className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      >
                         {savingMealId === meal.id ? "Saving..." : "Save"}
                      </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeSection === "orders" && (
            <div className="pt-5">
              <h2 className="text-xl font-bold text-green-900">Orders</h2>
              <p className="mt-1 text-gray-600">
                Orders currently arrive through WhatsApp. This workspace will show and
                organize them here after order storage is connected.
              </p>
              <div className="mt-4 space-y-2">
                {orders.length === 0 && <p className="text-sm text-gray-500">No stored orders yet.</p>}
                {orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-green-100 p-4">
                    <div className="flex flex-wrap justify-between gap-2">
                      <p className="font-semibold text-green-900">Order #{order.id}</p>
                      <span className="text-sm text-gray-500">{order.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{order.customer_name} · {order.customer_phone} · {order.delivery_area}</p>
                    <p className="mt-1 font-semibold text-green-700">₦{Number(order.subtotal).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <a
                href="https://wa.me/2348081688937"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
              >
                Open ChopHub WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
