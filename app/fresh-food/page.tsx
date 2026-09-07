"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FreshProduct = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  description: string;
  icon: string;
  stock: "In stock" | "Limited" | "Unavailable";
};

type CartItem = { id: string; name: string; price: number; quantity: number; image: string };
const cartStorageKey = "chophub-cart";
const categories = ["All", "Fruits", "Vegetables & Greens", "Meat & Poultry", "Fish & Seafood", "Eggs & Dairy"];

const products: FreshProduct[] = [
  { id: "fresh-bananas", name: "Bananas", category: "Fruits", unit: "1 bunch", price: 2500, description: "Ripe, sweet bananas for home or office.", icon: "🍌", stock: "In stock" },
  { id: "fresh-oranges", name: "Oranges", category: "Fruits", unit: "1 dozen", price: 3500, description: "Juicy seasonal oranges.", icon: "🍊", stock: "In stock" },
  { id: "fresh-pawpaw", name: "Pawpaw", category: "Fruits", unit: "1 piece", price: 2500, description: "Fresh ripe pawpaw selected for you.", icon: "🥭", stock: "Limited" },
  { id: "fresh-tomatoes", name: "Tomatoes", category: "Vegetables & Greens", unit: "1 kg", price: 3500, description: "Fresh tomatoes for sauces, stews, and salads.", icon: "🍅", stock: "In stock" },
  { id: "fresh-onions", name: "Onions", category: "Vegetables & Greens", unit: "1 kg", price: 2800, description: "Crisp onions for everyday cooking.", icon: "🧅", stock: "In stock" },
  { id: "fresh-ugu", name: "Ugu leaves", category: "Vegetables & Greens", unit: "1 bunch", price: 1200, description: "Fresh fluted pumpkin leaves for soups.", icon: "🌿", stock: "In stock" },
  { id: "fresh-plantain", name: "Plantain", category: "Vegetables & Greens", unit: "1 kg", price: 3000, description: "Green or ripe plantain for frying and cooking.", icon: "🍌", stock: "In stock" },
  { id: "fresh-chicken", name: "Chicken", category: "Meat & Poultry", unit: "1 kg", price: 6500, description: "Cleaned chicken prepared for cooking.", icon: "🍗", stock: "Limited" },
  { id: "fresh-beef", name: "Beef", category: "Meat & Poultry", unit: "1 kg", price: 8500, description: "Fresh beef cuts for soups and stews.", icon: "🥩", stock: "In stock" },
  { id: "fresh-catfish", name: "Catfish", category: "Fish & Seafood", unit: "1 kg", price: 7500, description: "Fresh catfish cleaned to order.", icon: "🐟", stock: "In stock" },
  { id: "fresh-mackerel", name: "Mackerel", category: "Fish & Seafood", unit: "1 kg", price: 6500, description: "Fresh or frozen mackerel for family meals.", icon: "🐠", stock: "Limited" },
  { id: "fresh-eggs", name: "Chicken eggs", category: "Eggs & Dairy", unit: "1 crate", price: 5500, description: "Fresh eggs for breakfast and baking.", icon: "🥚", stock: "In stock" },
];

export default function FreshFoodPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const filteredProducts = useMemo(() => selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory), [selectedCategory]);

  const addToCart = (product: FreshProduct) => {
    const stored = window.localStorage.getItem(cartStorageKey);
    const cart: CartItem[] = stored ? JSON.parse(stored) : [];
    const existing = cart.find((item) => item.id === product.id);
    const nextCart = existing
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { id: product.id, name: `${product.name} (${product.unit})`, price: product.price, quantity: 1, image: product.icon }];
    window.localStorage.setItem(cartStorageKey, JSON.stringify(nextCart));
    window.dispatchEvent(new Event("chophub-cart-updated"));
    setCartCount(nextCart.reduce((total, item) => total + item.quantity, 0));
  };

  return (
    <main className="min-h-screen bg-emerald-50 text-gray-900">
      <header className="border-b border-emerald-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link href="/" className="text-xl font-extrabold text-green-800">ChopHub</Link>
          <Link href="/" className="text-sm font-semibold text-green-700 hover:text-green-900">Change section</Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">ChopHub Fresh Food</p>
          <h1 className="mt-3 text-4xl font-bold text-emerald-950">Fresh for your kitchen</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-700">Fruits, vegetables, meat, fish, and other fresh ingredients delivered to you.</p>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${selectedCategory === category ? "bg-emerald-600 text-white" : "bg-white text-emerald-900 hover:bg-emerald-100"}`}>
              {category}
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className={`rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm ${product.stock === "Unavailable" ? "opacity-70" : ""}`}>
              <div className="flex h-24 items-center justify-center rounded-xl bg-emerald-50 text-5xl">{product.icon}</div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-700">{product.category}</p>
              <h2 className="mt-1 font-bold text-emerald-950">{product.name}</h2>
              <p className="mt-1 text-xs text-gray-500">Price per {product.unit}</p>
              <p className="mt-2 text-xs text-gray-600">{product.description}</p>
              <p className={`mt-2 text-xs font-semibold ${product.stock === "In stock" ? "text-emerald-600" : product.stock === "Limited" ? "text-amber-600" : "text-red-600"}`}>{product.stock}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="font-bold text-emerald-800">₦{product.price.toLocaleString()}</span>
                <button type="button" disabled={product.stock === "Unavailable"} onClick={() => addToCart(product)} className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500">
                  {product.stock === "Unavailable" ? "Unavailable" : "Add"}
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">{cartCount > 0 ? `${cartCount} item${cartCount === 1 ? "" : "s"} added to your ChopHub cart.` : "Select fresh products to add them to your ChopHub cart."}</p>
          <Link href="/cooked-food#cart" className="mt-4 inline-block rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">Continue to checkout</Link>
        </div>
      </section>
    </main>
  );
}
