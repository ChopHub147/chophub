import Link from "next/link";

const shoppingSections = [
  ["🍲", "Cooked Food", "Ready-to-eat meals and treats.", "/cooked-food", "bg-green-100 text-green-800"],
  ["🛒", "Foodstuff", "Pantry essentials and ingredients.", "/foodstuff", "bg-amber-100 text-amber-800"],
  ["🥬", "Uncooked Food", "Fresh ingredients for home cooking.", "/uncooked-food", "bg-emerald-100 text-emerald-800"],
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
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-3 gap-2 sm:gap-5">
            {shoppingSections.map(([icon, title, description, href, accent]) => (
              <Link key={title} href={href} className={`group rounded-3xl ${accent} p-3 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:p-6`}>
                <div className="flex min-h-40 flex-col items-center justify-center text-center sm:min-h-48">
                  <span className="text-5xl sm:text-6xl" aria-hidden="true">{icon}</span>
                  <p className="mt-3 text-sm font-bold sm:text-xl">{title}</p>
                  <p className="mt-2 text-xs leading-5 opacity-80 sm:text-sm">{description}</p>
                  <span className="mt-3 text-xs font-semibold sm:text-sm">Browse →</span>
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
