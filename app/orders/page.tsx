"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  created_at: string;
  subtotal: number;
  status: string;
  delivery_area: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customers/orders")
      .then(async (response) => {
        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as { error?: string };
          setError(data.error || "Please sign in to view your orders");
          return;
        }
        setOrders((await response.json()) as Order[]);
      })
      .catch(() => setError("Could not load order history"));
  }, []);

  return (
    <main className="min-h-screen bg-[#fffefe] px-5 py-10 pb-24 text-[#10231b] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-semibold text-[#07833f]">← Back to Home</Link>
        <h1 className="mt-4 text-3xl font-black tracking-tight">Order History</h1>

        {error && (
          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 text-center">
            <p className="text-sm text-[#53625d]">{error}</p>
            <Link href="/account" className="mt-4 inline-flex rounded-full bg-[#07833f] px-6 py-3 text-sm font-bold text-white">Sign In</Link>
          </div>
        )}

        {orders && orders.length === 0 && !error && (
          <p className="mt-6 text-sm text-[#53625d]">You have no orders yet.</p>
        )}

        {orders && orders.length > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-bold">Order #{order.id}</p>
                  <span className="rounded-full bg-[#f0f9f1] px-3 py-1 text-xs font-bold uppercase text-[#07833f]">{order.status}</span>
                </div>
                <p className="mt-1 text-sm text-[#53625d]">{new Date(order.created_at).toLocaleString()}</p>
                <p className="mt-1 text-sm text-[#53625d]">Delivery area: {order.delivery_area}</p>
                <p className="mt-2 font-bold">₦{Number(order.subtotal).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
