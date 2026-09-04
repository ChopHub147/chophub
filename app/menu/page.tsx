import Link from "next/link";

const dishes = [
  ["Afang Soup", 5000, "Rich traditional soup prepared with fresh ingredients.", "/afang.jpeg", "soup-swallow"],
  ["Edikang Ikong", 5000, "Traditional vegetable soup loaded with assorted ingredients.", "/edikanikong.jpeg", "soup-swallow"],
  ["Fisherman Soup", 8000, "Calabar-style seafood soup packed with fresh fish and seafood.", "/fisherman_soup.JPG", "soup-swallow"],
  ["White Soup", 5500, "Traditional white soup with a rich, aromatic taste.", "/white_soup.jpg", "soup-swallow"],
  ["Ogbono Soup", 5000, "Rich, smooth ogbono soup prepared with traditional spices.", "/ogbono.jpg", "soup-swallow"],
  ["Okro Soup", 5000, "Freshly prepared okro soup with a traditional Calabar flavor.", "/okro_.JPG", "soup-swallow"],
  ["Egusi Soup", 5000, "Rich and hearty egusi soup prepared with assorted ingredients.", "/egusi.JPG", "soup-swallow"],
  ["Oha Soup", 5000, "Traditional Oha soup with a comforting indigenous flavor.", "/oha.JPG", "soup-swallow"],
  ["Indigenous 404", 4000, "Well-seasoned, freshly prepared indigenous 404 meat.", "/404.JPG", "meat"],
  ["Indigenous Bush Meat", 4000, "Freshly prepared traditional indigenous bush meat.", "/Bushmeat.jpg", "meat"],
  ["Shawarma", 6500, "The King's Shawarma, generously filled and freshly prepared.", "/sharwama.jpeg", "meat"],
  ["Jollof Rice", 2000, "Fragrant party-style jollof rice served plain or with protein.", "/jollof.jpg", "rice"],
  ["Rice & Stew", 2000, "Steamed rice with rich, flavorful stew and protein.", "/rice_stew.jpg", "rice"],
  ["Parfait", 5000, "A creamy, layered parfait treat.", "/Parfait.webp", "dessert"],
  ["Fresh Roasted Fish", 8000, "Well-seasoned roasted fish served with spicy pepper sauce.", "/grilled_fish.JPG", "meat"],
  ["Abáchà", 4000, "Traditional African salad prepared with delicious local ingredients.", "/abacha.JPG", "dessert"],
] as const;

const categoryNames = {
  "soup-swallow": "Soup and Swallow",
  meat: "Meat",
  rice: "Rice",
  dessert: "Dessert",
} as const;

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const category = (await searchParams).category;
  const filteredDishes = category && category in categoryNames
    ? dishes.filter((dish) => dish[4] === category)
    : dishes;
  const title = category && category in categoryNames
    ? categoryNames[category as keyof typeof categoryNames]
    : "Full Menu";
  return (
    <main className="min-h-screen bg-green-50 text-gray-900">
      <header className="bg-white border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-green-800">ChopHub</Link>
          <Link href="/" className="text-sm font-semibold text-green-700 hover:text-green-900">
            Back to Home
          </Link>
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600 mb-3">
            ChopHub Calabar
          </p>
          <h1 className="text-4xl font-bold text-green-900">{title}</h1>
          <p className="text-gray-600 mt-3">
            {category ? `Explore our ${title.toLowerCase()} selection.` : "Explore everything available to order."}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredDishes.map(([name, price, description, image]) => (
            <article key={name} className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm">
              <div className="h-32 md:h-44 overflow-hidden">
                <img src={image} alt={name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 md:p-4">
                <div className="flex justify-between gap-2 items-start">
                  <h2 className="font-bold text-sm md:text-base text-green-900">{name}</h2>
                  <span className="text-xs md:text-sm font-bold text-green-700 whitespace-nowrap">
                    ₦{price.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mt-2">{description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/#menu" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold">
            Customize and Order
          </Link>
        </div>
      </section>
    </main>
  );
}
