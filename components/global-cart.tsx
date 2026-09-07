"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = { quantity: number };
const cartStorageKey = "chophub-cart";

export default function GlobalCart() {
  const pathname = usePathname();
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

  if (pathname === "/cooked-food") {
    return null;
  }

  return (
    <Link
      href="/cooked-food#cart"
      className="fixed right-4 top-4 z-50 rounded-full bg-white p-3 text-green-800 shadow-md ring-1 ring-green-100 transition hover:bg-green-50"
      aria-label={`Open cart with ${count} items`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">{count}</span>}
    </Link>
  );
}
