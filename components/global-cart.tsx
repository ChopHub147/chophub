"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = { quantity: number };
const cartStorageKey = "chophub-cart";

export default function GlobalCart() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const stored = window.localStorage.getItem(cartStorageKey);
      if (!stored) {
        setCount(0);
        return;
      }

      try {
        const cart = JSON.parse(stored) as CartItem[];
        setCount(Array.isArray(cart) ? cart.reduce((total, item) => total + (item.quantity || 0), 0) : 0);
      } catch {
        setCount(0);
      }
    };

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("chophub-cart-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("chophub-cart-updated", refresh);
    };
  }, []);

  return (
    <Link
      href="/cooked-food#cart"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-green-800"
      aria-label={`Open cart with ${count} items`}
    >
      Cart{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
