import Link from "next/link";

export default function FoodstuffPage() {
  return (
    <main className="min-h-screen bg-amber-50 px-4 py-16 text-gray-900">
      <div className="mx-auto max-w-3xl text-center">
        <Link href="/" className="font-semibold text-green-800">← Change section</Link>
        <p className="mt-12 text-sm font-semibold uppercase tracking-widest text-amber-700">ChopHub Foodstuff</p>
        <h1 className="mt-3 text-4xl font-bold text-amber-950">Foodstuff is coming soon</h1>
        <p className="mt-4 text-gray-700">We are preparing a trusted selection of pantry essentials and kitchen ingredients.</p>
      </div>
    </main>
  );
}
