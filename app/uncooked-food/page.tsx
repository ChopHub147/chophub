import Link from "next/link";

export default function UncookedFoodPage() {
  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-16 text-gray-900">
      <div className="mx-auto max-w-3xl text-center">
        <Link href="/" className="font-semibold text-green-800">← Change section</Link>
        <p className="mt-12 text-sm font-semibold uppercase tracking-widest text-emerald-700">ChopHub Uncooked Food</p>
        <h1 className="mt-3 text-4xl font-bold text-emerald-950">Uncooked food is coming soon</h1>
        <p className="mt-4 text-gray-700">We are preparing a fresh selection of raw ingredients for home cooking.</p>
      </div>
    </main>
  );
}
