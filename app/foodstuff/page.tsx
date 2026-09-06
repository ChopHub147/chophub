"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  pack: string;
  price: number;
  description: string;
  icon: string;
  available: boolean;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const cartStorageKey = "chophub-cart";
const categories = ["All", "Grains & Staples", "Flours & Baking", "Cooking Oils", "Canned & Packaged", "Seasonings", "Beverages", "Snacks", "Household"];

const products: Product[] = [
  { id: "foodstuff-garri-1kg", name: "Garri", category: "Grains & Staples", pack: "1 kg", price: 1800, description: "Crispy cassava flakes for drinks and meals.", icon: "🌾", available: true },
  { id: "foodstuff-rice-5kg", name: "Long-grain rice", category: "Grains & Staples", pack: "5 kg bag", price: 12500, description: "Everyday rice for family meals.", icon: "🍚", available: true },
  { id: "foodstuff-beans-1kg", name: "Black-eyed beans", category: "Grains & Staples", pack: "1 kg", price: 2800, description: "Clean, sorted beans for soups and staples.", icon: "🫘", available: true },
  { id: "foodstuff-wheat-1kg", name: "Wheat flour", category: "Flours & Baking", pack: "1 kg", price: 2200, description: "For baking, pastries, and home cooking.", icon: "🥣", available: true },
  { id: "foodstuff-sugar-1kg", name: "White sugar", category: "Flours & Baking", pack: "1 kg", price: 2200, description: "Fine sugar for drinks and baking.", icon: "🍬", available: true },
  { id: "foodstuff-palm-oil-1l", name: "Palm oil", category: "Cooking Oils", pack: "1 litre", price: 3500, description: "Rich red palm oil for traditional cooking.", icon: "🫗", available: true },
  { id: "foodstuff-tomato-400g", name: "Tomato paste", category: "Canned & Packaged", pack: "400 g tin", price: 1800, description: "Convenient tomato base for sauces and stews.", icon: "🥫", available: true },
  { id: "foodstuff-sardine-155g", name: "Sardines", category: "Canned & Packaged", pack: "155 g tin", price: 2500, description: "Shelf-stable fish for quick meals.", icon: "🐟", available: true },
  { id: "foodstuff-stock-cubes", name: "Stock cubes", category: "Seasonings", pack: "1 pack", price: 1200, description: "Seasoning cubes for soups, rice, and stews.", icon: "🧂", available: true },
  { id: "foodstuff-bottled-water", name: "Bottled water", category: "Beverages", pack: "75 cl bottle", price: 500, description: "Chilled bottled water for your home or office.", icon: "💧", available: true },
  { id: "foodstuff-biscuits", name: "Assorted biscuits", category: "Snacks", pack: "1 pack", price: 1500, description: "A convenient snack for the household.", icon: "🍪", available: true },
  { id: "foodstuff-detergent", name: "Laundry detergent", category: "Household", pack: "1 kg pack", price: 3500, description: "Household cleaning essential.", icon: "🧼", available: false },
];

export default function FoodstuffPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const filteredProducts = useMemo(
    () => selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory),
    [selectedCategory]
  );

  const addToCart = (product: Product) => {
    const stored = window.localStorage.getItem(cartStorageKey);
    const cart: CartItem[] = stored ? JSON.parse(stored) : [];
    const existing = cart.find((item) => item.id === product.id);
    const nextCart = existing
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { id: product.id, name: `${product.name} (${product.pack})`, price: product.price, quantity: 1, image: product.icon }];
    window.localStorage.setItem(cartStorageKey, JSON.stringify(nextCart));
    setCartCount(nextCart.reduce((total, item) => total + item.quantity, 0));
  };

  return (
    <main className="min-h-screen bg-amber-50 text-gray-900">
      <header className="border-b border-amber-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link href="/" className="text-xl font-extrabold text-green-800">ChopHub</Link>
          <Link href="/" className="text-sm font-semibold text-green-700 hover:text-green-900">Change section</Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">ChopHub Foodstuff</p>
          <h1 className="mt-3 text-4xl font-bold text-amber-950">Stock up for home</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-700">Packaged groceries and household essentials delivered with your ChopHub order.</p>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${selectedCategory === category ? "bg-amber-600 text-white" : "bg-white text-amber-900 hover:bg-amber-100"}`}>
              {category}
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className={`rounded-2xl border border-amber-100 bg-white p-4 shadow-sm ${product.available ? "" : "opacity-70"}`}>
              <div className="flex h-24 items-center justify-center rounded-xl bg-amber-50 text-5xl">{product.icon}</div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-700">{product.category}</p>
              <h2 className="mt-1 font-bold text-amber-950">{product.name}</h2>
              <p className="mt-1 text-xs text-gray-500">{product.pack}</p>
              <p className="mt-2 text-sm text-gray-600">{product.description}</p>
              {!product.available && <p className="mt-2 text-xs font-semibold text-red-600">Currently unavailable</p>}
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="font-bold text-amber-800">₦{product.price.toLocaleString()}</span>
                <button type="button" disabled={!product.available} onClick={() => addToCart(product)} className="rounded-full bg-amber-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500">
                  {product.available ? "Add" : "Unavailable"}
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">{cartCount > 0 ? `${cartCount} item${cartCount === 1 ? "" : "s"} added to your ChopHub cart.` : "Select products to add them to your ChopHub cart."}</p>
          <Link href="/cooked-food#cart" className="mt-4 inline-block rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">Continue to checkout</Link>
        </div>
      </section>
    </main>
  );
}
