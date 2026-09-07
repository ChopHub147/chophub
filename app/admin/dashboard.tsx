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
  status: OrderStatus;
  created_at: string;
};

const orderStatuses = [
  ["new", "New"],
  ["confirmed", "Confirmed"],
  ["preparing", "Preparing"],
  ["out_for_delivery", "Out for delivery"],
  ["delivered", "Delivered"],
  ["cancelled", "Cancelled"],
] as const;

type OrderStatus = (typeof orderStatuses)[number][0];

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  section: "foodstuff" | "fresh-food";
  unit: string;
  price: number;
  image: string;
  stock_status: "in_stock" | "limited" | "unavailable";
};

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"menu" | "availability" | "products" | "orders">("menu");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  const [mealError, setMealError] = useState("");
  const [savingMealId, setSavingMealId] = useState<number | null>(null);
  const [pendingAvailability, setPendingAvailability] = useState<Record<number, boolean>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({
    id: "", name: "", description: "", category: "", section: "foodstuff", unit: "",
    price: 0, image: "", stock_status: "in_stock",
  });

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
    fetch("/api/admin/products")
      .then(async (response) => {
        if (!response.ok) {
          const result = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(result.error || "Could not load products");
        }
        return response.json() as Promise<Product[]>;
      })
      .then(setProducts)
      .catch((error: unknown) => {
        const reason = error instanceof Error ? error.message : "";
        setProductError(`Products could not be loaded. ${reason} Run the catalog SQL in Supabase first.`);
      })
      .finally(() => setIsLoadingProducts(false));
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

  const saveProduct = async (product: Product) => {
    setSavingProductId(product.id);
    setProductError("");
    const response = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) setProductError("That product could not be saved.");
    else setProducts((current) => current.map((item) => item.id === product.id ? product : item));
    setSavingProductId(null);
  };

  const uploadProductImage = async (productId: string, file: File) => {
    if (!productId.trim()) {
      setProductError("Give the product a unique ID before uploading an image.");
      return;
    }
    setUploadingImageId(productId);
    setProductError("");
    const formData = new FormData();
    formData.append("productId", productId.trim());
    formData.append("file", file);
    const response = await fetch("/api/admin/product-image", { method: "POST", body: formData });
    if (!response.ok) {
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      setProductError(result.error || "That image could not be uploaded.");
    } else {
      const result = (await response.json()) as { url: string };
      setProducts((current) => current.map((item) => item.id === productId ? { ...item, image: result.url } : item));
      setNewProduct((current) => current.id === productId ? { ...current, image: result.url } : current);
    }
    setUploadingImageId(null);
  };

  const uploadMealImage = async (mealId: number, file: File) => {
    setUploadingImageId(`meal-${mealId}`);
    setMealError("");
    const formData = new FormData();
    formData.append("mealId", String(mealId));
    formData.append("file", file);
    const response = await fetch("/api/admin/meal-image", { method: "POST", body: formData });
    if (!response.ok) {
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      setMealError(result.error || "That meal image could not be uploaded.");
    } else {
      const result = (await response.json()) as { url: string };
      setMeals((current) => current.map((item) => item.id === mealId ? { ...item, image: result.url } : item));
    }
    setUploadingImageId(null);
  };

  const addProduct = async () => {
    if (!newProduct.id.trim()) {
      setProductError("Give the new product a unique ID before saving.");
      return;
    }
    setSavingProductId("new");
    setProductError("");
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProduct, id: newProduct.id.trim() }),
    });
    if (!response.ok) {
      setProductError("That product could not be added. Check that its ID is unique.");
    } else {
      const created = (await response.json()) as Product[];
      setProducts((current) => [...current, created[0] || { ...newProduct, id: newProduct.id.trim() }]);
      setNewProduct({ id: "", name: "", description: "", category: "", section: "foodstuff", unit: "", price: 0, image: "", stock_status: "in_stock" });
    }
    setSavingProductId(null);
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Remove this product from the catalog?")) return;
    const response = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) setProductError("That product could not be removed.");
    else setProducts((current) => current.filter((product) => product.id !== id));
  };

  const updateOrderStatus = async (order: Order, status: OrderStatus) => {
    const response = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status }),
    });
    if (!response.ok) return;
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item));
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
            [String(products.length), "Grocery products"],
            ["1", "Owner account"],
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
              ["products", "Foodstuff & Fresh Food"],
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
                      <input className="rounded-lg border border-green-200 px-3 py-2" value={meal.image} placeholder="Image URL or uploaded image" onChange={(event) => setMeals((current) => current.map((item) => item.id === meal.id ? { ...item, image: event.target.value } : item))} />
                      <label className="rounded-lg border border-dashed border-green-300 px-3 py-2 text-sm text-gray-600">
                          {uploadingImageId === `meal-${meal.id}` ? "Uploading image..." : "Upload meal image"}
                          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-1 block w-full text-xs" disabled={uploadingImageId === `meal-${meal.id}`} onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) void uploadMealImage(meal.id, file);
                          }} />
                      </label>
                      <button type="button" onClick={() => updateMeal(meal)} disabled={savingMealId === meal.id} className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                        {savingMealId === meal.id ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === "products" && (
            <div className="pt-5">
              <h2 className="text-xl font-bold text-green-900">Foodstuff & Fresh Food</h2>
              <p className="mt-1 text-sm text-gray-600">Add or update products, pricing, stock, and the image shown to customers. For images, paste a public image URL or an emoji.</p>
              {productError && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{productError}</p>}
              <div className="mt-4 rounded-xl border border-green-100 bg-green-50/50 p-4">
                <h3 className="font-semibold text-green-900">Add a product</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(["id", "name", "category", "unit", "image"] as const).map((field) => (
                    <input key={field} placeholder={field === "id" ? "Unique ID (e.g. fresh-mango)" : field[0].toUpperCase() + field.slice(1)} className="rounded-lg border border-green-200 px-3 py-2" value={newProduct[field]} onChange={(event) => setNewProduct({ ...newProduct, [field]: event.target.value })} />
                  ))}
                  <label className="rounded-lg border border-dashed border-green-300 px-3 py-2 text-sm text-gray-600">
                    {uploadingImageId === newProduct.id ? "Uploading image..." : "Upload product image"}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-1 block w-full text-xs" disabled={uploadingImageId === newProduct.id} onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadProductImage(newProduct.id, file);
                    }} />
                  </label>
                  <input placeholder="Price (₦)" type="number" min="0" className="rounded-lg border border-green-200 px-3 py-2" value={newProduct.price} onChange={(event) => setNewProduct({ ...newProduct, price: Number(event.target.value) })} />
                  <select className="rounded-lg border border-green-200 px-3 py-2" value={newProduct.section} onChange={(event) => setNewProduct({ ...newProduct, section: event.target.value as Product["section"] })}><option value="foodstuff">Foodstuff</option><option value="fresh-food">Fresh Food</option></select>
                  <select className="rounded-lg border border-green-200 px-3 py-2" value={newProduct.stock_status} onChange={(event) => setNewProduct({ ...newProduct, stock_status: event.target.value as Product["stock_status"] })}><option value="in_stock">In stock</option><option value="limited">Limited</option><option value="unavailable">Unavailable</option></select>
                  <textarea placeholder="Description" className="rounded-lg border border-green-200 px-3 py-2 sm:col-span-2" value={newProduct.description} onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })} />
                </div>
                <button type="button" onClick={addProduct} disabled={savingProductId === "new"} className="mt-3 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{savingProductId === "new" ? "Adding..." : "Add product"}</button>
              </div>
              {isLoadingProducts ? <p className="mt-4 text-sm text-gray-500">Loading products...</p> : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {products.map((product) => (
                    <div key={product.id} className="rounded-xl border border-green-100 p-4">
                      <div className="grid gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{product.id}</p>
                        <input className="rounded-lg border border-green-200 px-3 py-2 font-medium" value={product.name} onChange={(event) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, name: event.target.value } : item))} />
                        <textarea className="rounded-lg border border-green-200 px-3 py-2 text-sm" value={product.description} onChange={(event) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, description: event.target.value } : item))} />
                        <div className="grid grid-cols-2 gap-2">
                          <input className="rounded-lg border border-green-200 px-3 py-2" value={product.category} placeholder="Category" onChange={(event) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, category: event.target.value } : item))} />
                          <input className="rounded-lg border border-green-200 px-3 py-2" value={product.unit} placeholder="Unit / pack size" onChange={(event) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, unit: event.target.value } : item))} />
                          <input type="number" min="0" className="rounded-lg border border-green-200 px-3 py-2" value={product.price} onChange={(event) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, price: Number(event.target.value) } : item))} />
                          <select className="rounded-lg border border-green-200 px-3 py-2" value={product.stock_status} onChange={(event) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, stock_status: event.target.value as Product["stock_status"] } : item))}><option value="in_stock">In stock</option><option value="limited">Limited</option><option value="unavailable">Unavailable</option></select>
                        </div>
                        <input className="rounded-lg border border-green-200 px-3 py-2" value={product.image} placeholder="Public image URL or emoji" onChange={(event) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, image: event.target.value } : item))} />
                        <label className="rounded-lg border border-dashed border-green-300 px-3 py-2 text-sm text-gray-600">
                          {uploadingImageId === product.id ? "Uploading image..." : "Upload replacement image"}
                          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-1 block w-full text-xs" disabled={uploadingImageId === product.id} onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) void uploadProductImage(product.id, file);
                          }} />
                        </label>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => saveProduct(product)} disabled={savingProductId === product.id} className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{savingProductId === product.id ? "Saving..." : "Save changes"}</button>
                          <button type="button" onClick={() => deleteProduct(product.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                      <select
                        value={order.status}
                        onChange={(event) => updateOrderStatus(order, event.target.value as OrderStatus)}
                        className="rounded-lg border border-green-200 px-2 py-1 text-sm font-semibold text-green-800"
                      >
                        {orderStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
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
