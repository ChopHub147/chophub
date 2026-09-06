import Link from "next/link";

export default function FreshFoodPage() {
  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-16 text-gray-900">
      <div className="mx-auto max-w-3xl text-center">
        <Link href="/" className="font-semibold text-green-800">← Change section</Link>
        <p className="mt-12 text-sm font-semibold uppercase tracking-widest text-emerald-700">ChopHub Fresh Food</p>
        <h1 className="mt-3 text-4xl font-bold text-emerald-950">Fresh food is coming soon</h1>
        <p className="mt-4 text-gray-700">We are preparing a fresh selection of fruits, vegetables, and ingredients for home cooking.</p>
      </div>
    </main>
  );
}
