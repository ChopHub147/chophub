"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FreshProduct = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  description: string;
  icon: string;
  stock: "In stock" | "Limited" | "Unavailable";
  vendors?: string[];
};

type CartItem = { id: string; name: string; price: number; quantity: number; image: string };
const cartStorageKey = "chophub-cart";
const categories = ["All", "Fruits", "Roots & Tubers", "Leafy Greens", "Peppers", "Onions & Aromatics", "Tomatoes", "Salad Vegetables", "Fresh Vegetables", "Plantain & Cooking Banana", "Fresh Herbs", "Nigerian Local Greens", "Meat & Poultry", "Fish & Seafood", "Eggs & Dairy"];

const products: FreshProduct[] = [
  { id: "fresh-bananas", name: "Bananas", category: "Fruits", unit: "1 bunch", price: 2500, description: "Ripe, sweet bananas for home or office.", icon: "🍌", stock: "In stock" },
  { id: "fresh-oranges", name: "Oranges", category: "Fruits", unit: "1 dozen", price: 3500, description: "Juicy seasonal oranges.", icon: "🍊", stock: "In stock" },
  { id: "fresh-pawpaw", name: "Pawpaw", category: "Fruits", unit: "1 piece", price: 2500, description: "Fresh ripe pawpaw selected for you.", icon: "🥭", stock: "Limited" },
  { id: "fresh-mango", name: "Mango", category: "Fruits", unit: "1 kg", price: 2200, description: "Sweet, juicy seasonal tropical fruit, best fresh or blended.", icon: "🥭", stock: "In stock" },
  { id: "fresh-pineapple", name: "Pineapple", category: "Fruits", unit: "1 piece", price: 2000, description: "Sweet-tart tropical fruit, great fresh or for juice.", icon: "🍍", stock: "In stock" },
  { id: "fresh-watermelon", name: "Watermelon", category: "Fruits", unit: "1 piece", price: 3500, description: "Large, juicy, hydrating fruit popular in the hot season.", icon: "🍉", stock: "In stock" },
  { id: "fresh-agbalumo", name: "African Star Apple (Agbalumo / Udara)", category: "Fruits", unit: "1 basket", price: 2500, description: "Seasonal orange-skinned fruit with sweet-tart pulp and chewy skin.", icon: "🟠", stock: "In stock" },
  { id: "fresh-ube", name: "African Pear (Ube)", category: "Fruits", unit: "1 basket", price: 2800, description: "Soft, oily fruit usually softened in hot water or roasted before eating.", icon: "🟤", stock: "In stock" },
  { id: "fresh-guava", name: "Guava", category: "Fruits", unit: "1 kg", price: 2000, description: "Fragrant, slightly grainy fruit with pink or white flesh, rich in vitamin C.", icon: "🍈", stock: "In stock" },
  { id: "fresh-soursop", name: "Soursop", category: "Fruits", unit: "1 piece", price: 3000, description: "Large, spiky green fruit with creamy, tangy-sweet flesh, great for juices and smoothies.", icon: "🥝", stock: "In stock" },
  { id: "fresh-coconut", name: "Coconut", category: "Fruits", unit: "1 piece", price: 1500, description: "Hard-shelled tropical fruit with refreshing water and rich white flesh.", icon: "🥥", stock: "In stock" },
  { id: "fresh-icheku", name: "Velvet Tamarind (Icheku / Awin)", category: "Fruits", unit: "1 pack", price: 1000, description: "Small, dark, sticky-sweet fruit sold in packs; a popular snack.", icon: "🟤", stock: "In stock" },
  { id: "fresh-tigernut", name: "Tiger Nut (Aya / Ofio)", category: "Fruits", unit: "1 pack", price: 1200, description: "Small, chewy, nut-like tuber with a sweet taste, popular for snacks and drinks.", icon: "🌰", stock: "In stock" },
  { id: "fresh-cashew-apple", name: "Cashew Apple", category: "Fruits", unit: "1 pack", price: 1500, description: "Juicy, tart-sweet fruit attached to the cashew nut; highly seasonal.", icon: "🍎", stock: "In stock" },
  { id: "fresh-lime", name: "Lime", category: "Fruits", unit: "1 pack", price: 1000, description: "Small, very sour citrus used for drinks, seasoning, and freshness.", icon: "🍋", stock: "In stock" },
  { id: "fresh-tangerine", name: "Tangerine / Mandarin", category: "Fruits", unit: "1 dozen", price: 3000, description: "Easy-to-peel sweet citrus, often preferred over regular oranges.", icon: "🍊", stock: "In stock" },
  { id: "fresh-grapefruit", name: "Grapefruit", category: "Fruits", unit: "1 kg", price: 2500, description: "Larger citrus with a bittersweet taste, available in white and red varieties.", icon: "🍊", stock: "In stock" },
  { id: "fresh-avocado", name: "Avocado", category: "Fruits", unit: "1 kg", price: 3000, description: "Creamy, nutrient-dense fruit (also called \"pear\"), popular for smoothies and spreads.", icon: "🥑", stock: "In stock" },
  { id: "fresh-breadfruit", name: "Breadfruit", category: "Fruits", unit: "1 piece", price: 2500, description: "Large, starchy fruit usually cooked; more common in certain regions.", icon: "🟤", stock: "In stock" },
  { id: "fresh-apple", name: "Apple (Red / Green)", category: "Fruits", unit: "1 kg", price: 3500, description: "Crisp, imported fruit available in most urban markets and stores.", icon: "🍎", stock: "In stock" },
  { id: "fresh-grapes", name: "Grapes", category: "Fruits", unit: "1 pack", price: 4000, description: "Sweet or slightly tart clusters, usually imported and sold in packs.", icon: "🍇", stock: "In stock" },
  { id: "fresh-strawberry", name: "Strawberry", category: "Fruits", unit: "1 pack", price: 3500, description: "Soft, sweet red berries sold in small packs (mostly imported or greenhouse-grown).", icon: "🍓", stock: "In stock" },
  { id: "fresh-kiwi", name: "Kiwi", category: "Fruits", unit: "1 pack", price: 3000, description: "Fuzzy-skinned fruit with bright green, tangy flesh.", icon: "🥝", stock: "In stock" },
  { id: "fresh-pomegranate", name: "Pomegranate", category: "Fruits", unit: "1 piece", price: 4500, description: "Seedy fruit with juicy, sweet-tart arils; often sold as a premium item.", icon: "🟣", stock: "In stock" },
  { id: "fresh-lemon", name: "Lemon", category: "Fruits", unit: "1 pack", price: 2000, description: "Sour citrus, usually imported; used mainly for drinks and cooking.", icon: "🍋", stock: "In stock" },
  { id: "fresh-plum", name: "Plum", category: "Fruits", unit: "1 pack", price: 3500, description: "Soft, sweet stone fruit available seasonally in better markets.", icon: "🟣", stock: "In stock" },
  { id: "fresh-tomatoes", name: "Tomatoes", category: "Tomatoes", unit: "1 kg", price: 3500, description: "Fresh tomatoes for sauces, stews, and salads.", icon: "🍅", stock: "In stock" },
  { id: "fresh-cherry-tomatoes", name: "Cherry Tomatoes", category: "Tomatoes", unit: "1 pack", price: 2500, description: "Small, sweet tomatoes for salads and snacking.", icon: "🍅", stock: "In stock" },
  { id: "fresh-onions", name: "Onions", category: "Onions & Aromatics", unit: "1 kg", price: 2800, description: "Crisp onions for everyday cooking.", icon: "🧅", stock: "In stock" },
  { id: "fresh-red-onion", name: "Red Onion", category: "Onions & Aromatics", unit: "1 kg", price: 3000, description: "Sharp, colourful onion for salads and stews.", icon: "🧅", stock: "In stock" },
  { id: "fresh-spring-onion", name: "Spring Onion", category: "Onions & Aromatics", unit: "1 bunch", price: 800, description: "Mild, fresh onion greens for garnish and stir-fry.", icon: "🧅", stock: "In stock" },
  { id: "fresh-shallots", name: "Shallots", category: "Onions & Aromatics", unit: "1 pack", price: 1500, description: "Small, mild onions with a delicate flavour.", icon: "🧅", stock: "In stock" },
  { id: "fresh-ginger", name: "Fresh Ginger", category: "Onions & Aromatics", unit: "1 kg", price: 2000, description: "Aromatic root for seasoning, drinks, and cooking.", icon: "🫚", stock: "In stock" },
  { id: "fresh-garlic", name: "Fresh Garlic", category: "Onions & Aromatics", unit: "1 kg", price: 2500, description: "Everyday aromatic used in most Nigerian dishes.", icon: "🧄", stock: "In stock" },
  { id: "fresh-ugu", name: "Ugu Leaves (Ugwu)", category: "Nigerian Local Greens", unit: "1 bunch", price: 1200, description: "Fresh fluted pumpkin leaves for soups.", icon: "🌿", stock: "In stock" },
  { id: "fresh-waterleaf", name: "Waterleaf", category: "Nigerian Local Greens", unit: "1 bunch", price: 1000, description: "Soft, leafy green used in soups and stews.", icon: "🌿", stock: "In stock" },
  { id: "fresh-bitterleaf", name: "Bitter Leaf", category: "Nigerian Local Greens", unit: "1 bunch", price: 1200, description: "Traditional bitter leaf, washed or unwashed, for soup.", icon: "🌿", stock: "In stock" },
  { id: "fresh-ewedu", name: "Ewedu", category: "Nigerian Local Greens", unit: "1 bunch", price: 1000, description: "Jute leaves for the classic ewedu soup.", icon: "🌿", stock: "In stock" },
  { id: "fresh-uziza", name: "Uziza Leaves", category: "Nigerian Local Greens", unit: "1 bunch", price: 1000, description: "Peppery leaves used to season soups.", icon: "🌿", stock: "In stock" },
  { id: "fresh-oha-leaves", name: "Oha Leaves", category: "Nigerian Local Greens", unit: "1 bunch", price: 1500, description: "Traditional leaves for Oha soup.", icon: "🌿", stock: "In stock" },
  { id: "fresh-afang-leaves", name: "Afang Leaves", category: "Nigerian Local Greens", unit: "1 bunch", price: 2000, description: "Shredded afang leaves for Afang soup.", icon: "🌿", stock: "In stock" },
  { id: "fresh-plantain", name: "Ripe Plantain", category: "Plantain & Cooking Banana", unit: "1 kg", price: 3000, description: "Sweet ripe plantain for frying and cooking.", icon: "🍌", stock: "In stock" },
  { id: "fresh-unripe-plantain", name: "Unripe Plantain", category: "Plantain & Cooking Banana", unit: "1 kg", price: 2800, description: "Firm, green plantain for boiling and porridge.", icon: "🍌", stock: "In stock" },
  { id: "fresh-cooking-banana", name: "Cooking Banana", category: "Plantain & Cooking Banana", unit: "1 kg", price: 2000, description: "Starchy banana variety used for cooking.", icon: "🍌", stock: "In stock" },
  { id: "fresh-carrot", name: "Carrots", category: "Roots & Tubers", unit: "1 kg", price: 1500, description: "Crisp, sweet carrots for cooking and salads.", icon: "🥕", stock: "In stock" },
  { id: "fresh-beetroot", name: "Beetroot", category: "Roots & Tubers", unit: "1 kg", price: 2000, description: "Earthy root vegetable for salads and juice.", icon: "🥔", stock: "In stock" },
  { id: "fresh-radish", name: "Radish", category: "Roots & Tubers", unit: "1 kg", price: 1500, description: "Crunchy, peppery root for salads.", icon: "🥔", stock: "In stock" },
  { id: "fresh-turnip", name: "Turnip", category: "Roots & Tubers", unit: "1 kg", price: 1500, description: "Mild root vegetable for soups and stews.", icon: "🥔", stock: "In stock" },
  { id: "fresh-sweet-potato", name: "Sweet Potato", category: "Roots & Tubers", unit: "1 kg", price: 1800, description: "Naturally sweet tuber, boiled, fried, or roasted.", icon: "🍠", stock: "In stock" },
  { id: "fresh-green-cabbage", name: "Green Cabbage", category: "Leafy Greens", unit: "1 piece", price: 1200, description: "Crisp cabbage for salads, stir-fry, and stews.", icon: "🥬", stock: "In stock" },
  { id: "fresh-red-cabbage", name: "Red Cabbage", category: "Leafy Greens", unit: "1 piece", price: 1500, description: "Colourful cabbage for salads and slaw.", icon: "🥬", stock: "In stock" },
  { id: "fresh-spinach", name: "Spinach", category: "Leafy Greens", unit: "1 bunch", price: 1200, description: "Tender spinach leaves for soups and side dishes.", icon: "🥬", stock: "In stock" },
  { id: "fresh-green-bell-pepper", name: "Green Bell Pepper", category: "Peppers", unit: "1 kg", price: 2000, description: "Mild, crisp pepper for stews and stir-fry.", icon: "🫑", stock: "In stock" },
  { id: "fresh-red-bell-pepper", name: "Red Bell Pepper", category: "Peppers", unit: "1 kg", price: 2500, description: "Sweet, colourful pepper for sauces and stews.", icon: "🫑", stock: "In stock" },
  { id: "fresh-yellow-bell-pepper", name: "Yellow Bell Pepper", category: "Peppers", unit: "1 kg", price: 2500, description: "Bright, sweet pepper for cooking and salads.", icon: "🫑", stock: "In stock" },
  { id: "fresh-scotch-bonnet", name: "Scotch Bonnet (Ata Rodo)", category: "Peppers", unit: "1 kg", price: 3000, description: "Hot pepper essential for Nigerian stews and sauces.", icon: "🌶️", stock: "In stock" },
  { id: "fresh-chili-pepper", name: "Fresh Chili Pepper", category: "Peppers", unit: "1 kg", price: 2500, description: "Small, spicy peppers for seasoning.", icon: "🌶️", stock: "In stock" },
  { id: "fresh-tatashe", name: "Tatashe", category: "Peppers", unit: "1 kg", price: 2500, description: "Sweet red pepper used as the base for stews.", icon: "🌶️", stock: "In stock" },
  { id: "fresh-cucumber", name: "Cucumber", category: "Salad Vegetables", unit: "1 kg", price: 1500, description: "Cool, crisp cucumber for salads and snacking.", icon: "🥒", stock: "In stock" },
  { id: "fresh-lettuce", name: "Lettuce", category: "Salad Vegetables", unit: "1 piece", price: 1500, description: "Fresh, crisp lettuce for salads and sandwiches.", icon: "🥬", stock: "In stock" },
  { id: "fresh-garden-egg", name: "Garden Egg (Eggplant)", category: "Fresh Vegetables", unit: "1 kg", price: 1800, description: "Traditional garden egg for snacking or sauce.", icon: "🍆", stock: "In stock" },
  { id: "fresh-okra", name: "Okra", category: "Fresh Vegetables", unit: "1 kg", price: 2000, description: "Fresh okra for soups and stews.", icon: "🫛", stock: "In stock" },
  { id: "fresh-green-beans", name: "Green Beans", category: "Fresh Vegetables", unit: "1 kg", price: 2000, description: "Crisp green beans for stir-fry and sides.", icon: "🫛", stock: "In stock" },
  { id: "fresh-peas", name: "Peas", category: "Fresh Vegetables", unit: "1 kg", price: 2500, description: "Sweet, tender peas for rice and stews.", icon: "🫛", stock: "In stock" },
  { id: "fresh-zucchini", name: "Zucchini", category: "Fresh Vegetables", unit: "1 kg", price: 2500, description: "Mild summer squash for grilling and stews.", icon: "🥒", stock: "In stock" },
  { id: "fresh-broccoli", name: "Broccoli", category: "Fresh Vegetables", unit: "1 kg", price: 3000, description: "Nutrient-rich vegetable for steaming and stir-fry.", icon: "🥦", stock: "In stock" },
  { id: "fresh-cauliflower", name: "Cauliflower", category: "Fresh Vegetables", unit: "1 piece", price: 2500, description: "Versatile vegetable for rice, soups, and roasting.", icon: "🥦", stock: "In stock" },
  { id: "fresh-sweet-corn", name: "Sweet Corn", category: "Fresh Vegetables", unit: "1 pack", price: 1500, description: "Sweet corn for boiling, roasting, or salads.", icon: "🌽", stock: "In stock" },
  { id: "fresh-parsley", name: "Parsley", category: "Fresh Herbs", unit: "1 bunch", price: 1000, description: "Fresh herb for garnish and seasoning.", icon: "🌿", stock: "In stock" },
  { id: "fresh-coriander", name: "Coriander / Cilantro", category: "Fresh Herbs", unit: "1 bunch", price: 1000, description: "Fragrant herb for garnish and sauces.", icon: "🌿", stock: "In stock" },
  { id: "fresh-mint", name: "Mint", category: "Fresh Herbs", unit: "1 bunch", price: 1000, description: "Refreshing herb for drinks and garnish.", icon: "🌿", stock: "In stock" },
  { id: "fresh-basil", name: "Basil", category: "Fresh Herbs", unit: "1 bunch", price: 1000, description: "Aromatic herb for cooking and garnish.", icon: "🌿", stock: "In stock" },
  { id: "fresh-rosemary", name: "Rosemary", category: "Fresh Herbs", unit: "1 bunch", price: 1000, description: "Fragrant herb for roasts and seasoning.", icon: "🌿", stock: "In stock" },
  { id: "fresh-celery", name: "Celery", category: "Fresh Herbs", unit: "1 bunch", price: 1200, description: "Crisp stalks for soups, juice, and seasoning.", icon: "🌿", stock: "In stock" },
  { id: "fresh-scent-leaf", name: "Scent Leaf", category: "Fresh Herbs", unit: "1 bunch", price: 1000, description: "Aromatic Nigerian herb used in soups and pepper soup.", icon: "🌿", stock: "In stock" },
  { id: "fresh-chicken", name: "Chicken", category: "Meat & Poultry", unit: "1 kg", price: 6500, description: "Cleaned chicken prepared for cooking.", icon: "🍗", stock: "Limited" },
  { id: "fresh-beef", name: "Beef", category: "Meat & Poultry", unit: "1 kg", price: 8500, description: "Fresh beef cuts for soups and stews.", icon: "🥩", stock: "In stock" },
  { id: "fresh-catfish", name: "Catfish", category: "Fish & Seafood", unit: "1 kg", price: 7500, description: "Fresh catfish cleaned to order.", icon: "🐟", stock: "In stock" },
  { id: "fresh-mackerel", name: "Mackerel", category: "Fish & Seafood", unit: "1 kg", price: 6500, description: "Fresh or frozen mackerel for family meals.", icon: "🐠", stock: "Limited" },
  { id: "fresh-eggs", name: "Chicken eggs", category: "Eggs & Dairy", unit: "1 crate", price: 5500, description: "Fresh eggs for breakfast and baking.", icon: "🥚", stock: "In stock" },
];

export default function FreshFoodPage() {
  const [catalogProducts, setCatalogProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [vendorNames, setVendorNames] = useState<Record<string, string[]>>({});
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return catalogProducts.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = !query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [catalogProducts, searchQuery, selectedCategory]);

  useEffect(() => {
    fetch("/api/products?section=fresh-food")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load Fresh Food products");
        return response.json();
      })
      .then((databaseProducts: Array<Record<string, unknown>>) => {
        if (databaseProducts.length > 0) {
          setCatalogProducts(databaseProducts.map((product) => ({
            id: String(product.id),
            name: String(product.name),
            category: String(product.category),
            unit: String(product.unit),
            price: Number(product.price),
            description: String(product.description),
            icon: String(product.image || "🥬"),
            stock: product.stock_status === "limited" ? "Limited" : product.stock_status === "unavailable" ? "Unavailable" : "In stock",
          })));
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    fetch("/api/catalog-vendors")
      .then((response) => response.ok ? response.json() : [])
      .then((assignments: Array<{ itemId: string; vendor: string }>) => setVendorNames(assignments.reduce<Record<string, string[]>>((current, assignment) => ({ ...current, [assignment.itemId]: [...(current[assignment.itemId] || []), assignment.vendor] }), {})))
      .catch(() => undefined);
  }, []);

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
    setAddedProductId(product.id);
    window.setTimeout(() => setAddedProductId(null), 1600);
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
        <form onSubmit={(event) => event.preventDefault()} className="mx-auto mt-8 flex max-w-2xl gap-2 rounded-2xl border border-emerald-100 bg-white p-2 shadow-sm">
          <label htmlFor="fresh-food-search" className="sr-only">Search fresh food</label>
          <span className="flex items-center px-2 text-xl text-emerald-700" aria-hidden="true">⌕</span>
          <input id="fresh-food-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search fresh food..." className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none" />
          <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Search</button>
        </form>
        <div className="mt-8">
          <button type="button" onClick={() => setShowCategories((open) => !open)} aria-expanded={showCategories} className="flex w-full items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-left text-sm font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50">
            <span>{selectedCategory === "All" ? "Browse fresh food categories" : selectedCategory}</span>
            <span aria-hidden="true">{showCategories ? "⌃" : "⌄"}</span>
          </button>
          {showCategories && <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <button key={category} type="button" onClick={() => { setSelectedCategory(category); setShowCategories(false); }} className={`rounded-xl px-3 py-2 text-left text-sm font-semibold ${selectedCategory === category ? "bg-emerald-600 text-white" : "text-emerald-900 hover:bg-emerald-50"}`}>
                {category}
              </button>
            ))}
          </div>}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className={`rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm ${product.stock === "Unavailable" ? "opacity-70" : ""}`}>
              <div className="flex h-24 items-center justify-center rounded-xl bg-emerald-50 text-5xl">{product.icon}</div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-700">{product.category}</p>
              <h2 className="mt-1 font-bold text-emerald-950">{product.name}</h2>
              <p className="mt-1 text-xs text-gray-500">Price per {product.unit}</p>
              <p className="mt-2 text-xs text-gray-600">{product.description}</p>
              {vendorNames[product.id]?.length > 0 && <p className="mt-2 text-xs font-semibold text-emerald-800">Sold by: {vendorNames[product.id].join(", ")}</p>}
              <p className={`mt-2 text-xs font-semibold ${product.stock === "In stock" ? "text-emerald-600" : product.stock === "Limited" ? "text-amber-600" : "text-red-600"}`}>{product.stock}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="font-bold text-emerald-800">₦{product.price.toLocaleString()}</span>
                <button type="button" disabled={product.stock === "Unavailable"} onClick={() => addToCart(product)} className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500">
                  {product.stock === "Unavailable" ? "Unavailable" : addedProductId === product.id ? "Added ✓" : "Add"}
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
