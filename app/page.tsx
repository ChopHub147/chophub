import Link from "next/link";

const shoppingSections = [
  ["Cooked Food", "Ready-to-eat Calabar meals, soups, rice, meat, and treats.", "/cooked-food", "from-green-700 to-green-500"],
  ["Foodstuff", "Pantry essentials and ingredients for your kitchen.", "/foodstuff", "from-amber-700 to-orange-500"],
  ["Uncooked Food", "Fresh and raw ingredients for meals you want to prepare.", "/uncooked-food", "from-emerald-800 to-teal-500"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-green-50 text-gray-900">
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[url('/chophub-background.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white/70" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">ChopHub Calabar</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-green-950 md:text-6xl">What are you shopping for today?</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-700">Get the food you need from one trusted ChopHub marketplace.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
            {shoppingSections.map(([title, description, href, accent]) => (
              <Link key={title} href={href} className={`group rounded-3xl bg-gradient-to-br ${accent} p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}>
                <div className="flex min-h-52 flex-col justify-between">
                  <div>
                    <p className="text-2xl font-bold">{title}</p>
                    <p className="mt-3 leading-7 text-white/90">{description}</p>
                  </div>
                  <span className="mt-8 font-semibold transition group-hover:translate-x-1">Browse section →</span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-gray-600">More ChopHub sections are coming soon.</p>
        </div>
      </section>
    </main>
  );
}
