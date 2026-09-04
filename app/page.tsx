"use client";

import { useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Customer details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Temporary "Added!" feedback per dish
  const [addedFeedback, setAddedFeedback] = useState<Record<number, boolean>>({});

  const swallowOptions = [
    { name: "Garri", price: 800 },
    { name: "Semo", price: 800 },
    { name: "Poundo", price: 800 },
    { name: "Wheat", price: 800 },
    { name: "Plantain Flour", price: 800 },
    { name: "Fufu", price: 500 },
  ];

  const pairingOptions = ["Plantain", "Rice"];
  const proteinOptions = [
    { name: "Chicken", price: 3500 },
    { name: "Goat Meat", price: 2500 },
    { name: "Beef", price: 2500 },
    { name: "Fish", price: 2000 },
    { name: "Fried Plantain", price: 500 },
  ];
  const waterPrice = 500;
  const drinkOptions = [
    { name: "Coke", price: 500 },
    { name: "Water", price: 500 },
    { name: "Malt", price: 1000 },
    { name: "Hollandia", price: 3000 },
    { name: "Sprite", price: 500 },
    { name: "Tiger Nuts", price: 1500 },
    { name: "Pineapple Juice", price: 2000 },
  ];
  const beerOptions = [
    { name: "Heniken", price: 1500 },
    { name: "Star", price: 1500 },
    { name: "Stout", price: 1500 },
    { name: "Desperado", price: 1500 },
  ];

  const dishes = [
    {
      id: 1,
      name: "Afang Soup",
      price: 5000,
      desc: "Rich traditional Afang soup prepared with fresh ingredients and assorted proteins.",
      image: "/afang.jpeg",
      type: "soup" as const,
    },
    {
      id: 2,
      name: "Edikang Ikong",
      price: 5000,
      desc: "Fresh and delicious traditional vegetable soup loaded with assorted ingredients.",
      image: "/edikanikong.jpeg",
      type: "soup" as const,
    },
    {
      id: 3,
      name: "Indigenous 404",
      price: 4000,
      desc: "Well-seasoned, freshly prepared indigenous 404 meat.",
      image: "/404.JPG",
      type: "meat" as const,
    },
    {
      id: 4,
      name: "Indigenous Bush Meat",
      price: 4000,
      desc: "Freshly prepared traditional indigenous bush meat with rich local seasoning.",
      image: "/Bushmeat.jpg",
      type: "meat" as const,
    },
    {
      id: 5,
      name: "Fisherman Soup",
      price: 8000,
      desc: "A rich Calabar-style seafood soup packed with fresh fish and seafood.",
      image: "/fisherman_soup.JPG",
      type: "soup" as const,
    },
    {
      id: 6,
      name: "White Soup",
      price: 5500,
      desc: "Traditional white soup with a rich, aromatic and comforting taste.",
      image: "/white_soup.jpg",
      type: "soup" as const,
    },
    {
      id: 7,
      name: "Ogbono Soup",
      price: 5000,
      desc: "Rich, smooth ogbono soup prepared with traditional spices and fresh ingredients.",
      image: "/ogbono.jpg",
      type: "soup" as const,
    },
    {
      id: 8,
      name: "Okro Soup",
      price: 5000,
      desc: "Freshly prepared okro soup with a delicious traditional Calabar flavor.",
      image: "/okro_.JPG",
      type: "soup" as const,
    },
    {
      id: 9,
      name: "Egusi Soup",
      price: 5000,
      desc: "Rich and hearty egusi soup prepared with assorted ingredients.",
      image: "/egusi.JPG",
      type: "soup" as const,
    },
    {
      id: 10,
      name: "Oha Soup",
      price: 5000,
      desc: "Traditional Oha soup with a rich, comforting indigenous flavor.",
      image: "/oha.JPG",
      type: "soup" as const,
    },
    {
      id: 11,
      name: "Fresh Roasted Fish",
      price: 8000,
      desc: "Well-seasoned fresh roasted fish served with spicy pepper sauce.",
      image: "/grilled_fish.JPG",
      type: "fish" as const,
    },
    {
      id: 12,
      name: "Jollof Rice",
      price: 2000,
      desc: "Fragrant party-style jollof rice served plain or with your choice of protein.",
      image: "/jollof.jpg",
      type: "rice" as const,
    },
    {
      id: 13,
      name: "Rice & Stew",
      price: 2000,
      desc: "Steamed rice with rich, flavorful stew and your choice of protein.",
      image: "/rice_stew.jpg",
      type: "rice" as const,
    },
    {
      id: 14,
      name: "Shawarma",
      price: 6500,
      desc: "The King's Shawarma, generously filled and freshly prepared.",
      image: "/sharwama.jpeg",
      type: "special" as const,
      sectionTitle: "The King's Shawarma",
    },
    {
      id: 15,
      name: "Parfait",
      price: 5000,
      desc: "A creamy, layered parfait treat.",
      image: "/Parfait.webp",
      type: "special" as const,
    },
    {
      id: 16,
      name: "Abáchà",
      price: 4000,
      desc: "Traditional African salad prepared with delicious local ingredients.",
      image: "/abacha.JPG",
      type: "special" as const,
      sectionTitle: "Abáchà",
    },
  ];

  const [selectedSwallow, setSelectedSwallow] = useState<Record<number, string>>({});
  const [selectedPairing, setSelectedPairing] = useState<Record<number, string>>({});
  const [selectedProtein, setSelectedProtein] = useState<
    Record<number, Record<string, number>>
  >({});
  const [selectedWater, setSelectedWater] = useState<Record<number, boolean>>({});
  const [selectedDrink, setSelectedDrink] = useState<
    Record<number, { name: string; quantity: number }>
  >({});

  const scrollToMenu = () => {
    setIsMobileNavOpen(false);
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToAbout = () => {
    setIsMobileNavOpen(false);
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToContact = () => {
    setIsMobileNavOpen(false);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sendContactMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`ChopHub contact message from ${contactName}`);
    const body = encodeURIComponent(
      `Name: ${contactName}\nPhone or email: ${contactDetails}\n\n${contactMessage}`
    );
    window.location.href = `mailto:chophub@aol.com?subject=${subject}&body=${body}`;
  };

  const addToCart = (dish: (typeof dishes)[0]) => {
    if (dish.type === "soup" && !selectedSwallow[dish.id]) {
      alert("Please choose your swallow first.");
      return;
    }

    if (dish.type === "meat" && !selectedPairing[dish.id]) {
      alert("Please choose Plantain or Rice first.");
      return;
    }

    const swallow = selectedSwallow[dish.id];
    const pairing = selectedPairing[dish.id];
    const selectedProteins = selectedProtein[dish.id] || {};
    const includesWater = selectedWater[dish.id] || false;
    const drink = selectedDrink[dish.id];
    const drinkOption = [...drinkOptions, ...beerOptions].find(
      (option) => option.name === drink?.name
    );
    const drinkLabel = drinkOption
      ? ` + ${drinkOption.name} x${drink?.quantity}`
      : "";
    const drinkCost = drinkOption
      ? drinkOption.price * (drink?.quantity || 0)
      : 0;
    const proteinAddons = proteinOptions.filter(
      (option) => (selectedProteins[option.name] || 0) > 0
    );

    const itemName =
      dish.type === "soup"
        ? `${dish.name} + ${swallow}${includesWater ? " + Water" : ""}${drinkLabel}`
        : dish.type === "meat"
          ? `${dish.name} + ${pairing}${includesWater ? " + Water" : ""}${drinkLabel}`
          : dish.type === "rice" && proteinAddons.length > 0
          ? `${dish.name} + ${proteinAddons
              .map(
                (option) =>
                  `${option.name} x${selectedProteins[option.name]}`
              )
              .join(" + ")}${includesWater ? " + Water" : ""}${drinkLabel}`
          : `${dish.name}${includesWater ? " + Water" : ""}${drinkLabel}`;

    const itemPrice =
      dish.type === "soup"
        ? dish.price + (swallowOptions.find((option) => option.name === swallow)?.price ?? 0)
          + (includesWater ? waterPrice : 0) + drinkCost
        : dish.type === "meat"
          ? dish.price + 1000 + (includesWater ? waterPrice : 0) + drinkCost
          : dish.type === "rice"
            ? dish.price +
              proteinAddons.reduce(
                (sum, option) =>
                  sum + option.price * selectedProteins[option.name],
                0
            ) +
            (includesWater ? waterPrice : 0) + drinkCost
          : dish.price +
            (includesWater ? waterPrice : 0) +
            drinkCost;

    const cartId =
      dish.type === "soup"
        ? `${dish.id}-${swallow}`
        : dish.type === "meat"
          ? `${dish.id}-${pairing}${includesWater ? "-water" : ""}${drinkOption ? `-${drinkOption.name}-${drink?.quantity}` : ""}`
          : dish.type === "rice"
            ? `${dish.id}-${proteinAddons
                .map((option) => `${option.name}-${selectedProteins[option.name]}`)
                .join("_") || "plain"}${includesWater ? "-water" : ""}${drinkOption ? `-${drinkOption.name}-${drink?.quantity}` : ""}`
          : `${dish.id}${includesWater ? "-water" : ""}${drinkOption ? `-${drinkOption.name}-${drink?.quantity}` : ""}`;

    const cartItem: CartItem = {
      id: cartId,
      name: itemName,
      price: itemPrice,
      quantity: 1,
      image: dish.image,
    };

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartId);

      if (existing) {
        return prev.map((item) =>
          item.id === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, cartItem];
    });

    // Show "Added!" feedback
    setAddedFeedback((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [dish.id]: false }));
    }, 1800);
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // WhatsApp Checkout with customer details
  const sendOrderToWhatsApp = () => {
    if (cart.length === 0) return;

    if (!customerName || !customerPhone || !deliveryAddress) {
      alert("Please fill in your Name, Phone Number and Delivery Address");
      return;
    }

    let message = `*New Order - ChopHub Calabar*%0A%0A`;
    message += `*Customer Details*%0A`;
    message += `Name: ${customerName}%0A`;
    message += `Phone: ${customerPhone}%0A`;
    message += `Address: ${deliveryAddress}%0A%0A`;
    message += `*Order Items*%0A`;

    cart.forEach((item) => {
      message += `• ${item.name} x${item.quantity} — ₦${(
        item.price * item.quantity
      ).toLocaleString()}%0A`;
    });

    message += `%0A*Total: ₦${totalPrice.toLocaleString()}*%0A%0A`;
    message += `Please confirm my order. Thank you!`;

    const phoneNumber = "2348081688937";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/Chop_icon.png"
              alt="ChopHub"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-xl font-extrabold tracking-tight text-green-800">
              ChopHub
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={scrollToMenu}
              className="hover:text-green-700 transition"
            >
              Menu
            </button>
            <button
              type="button"
              onClick={scrollToAbout}
              className="hover:text-green-700 transition"
            >
              About
            </button>
            <button
              type="button"
              onClick={scrollToContact}
              className="hover:text-green-700 transition"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-green-50 rounded-full transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={scrollToMenu}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition"
            >
              Order Now
            </button>
          </div>
          <div className="relative md:hidden">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileNavOpen}
              onClick={() => setIsMobileNavOpen((open) => !open)}
              className="p-2 rounded-lg hover:bg-green-50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {isMobileNavOpen && (
              <nav className="absolute right-0 top-12 z-10 w-36 rounded-xl border border-green-100 bg-white p-2 shadow-lg">
                <button
                  type="button"
                  onClick={scrollToMenu}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-green-50 transition"
                >
                  Menu
                </button>
                <button
                  type="button"
                  onClick={scrollToAbout}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-green-50 transition"
                >
                  About
                </button>
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-green-50 transition"
                >
                  Contact
                </button>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-green-900">
            Authentic Calabar Food
            <br />
            <span className="text-green-600">Delivered Fresh</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Taste the real indigenous flavors of Calabar — Afang, Edikang Ikong,
            Ogbono Soup, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToMenu}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition shadow-lg shadow-green-200"
            >
              Order Food Now
            </button>
            <button
              onClick={scrollToMenu}
              className="bg-white border-2 border-green-200 hover:border-green-400 text-green-800 px-8 py-4 rounded-full text-lg font-semibold transition"
            >
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section id="menu" className="py-16 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-900">
            Featured Dishes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
            {dishes.map((dish) => (
              <div key={dish.id} className={dish.sectionTitle ? "contents" : ""}>
                {dish.sectionTitle && (
                <h3 className="col-span-2 md:col-span-3 text-2xl font-bold text-green-900 pt-4">
                    {dish.sectionTitle}
                  </h3>
                )}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-green-100">
                <div className="h-32 md:h-52 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-3 md:p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm md:text-lg text-green-900">
                        {dish.name}
                      </h3>
                      <span className="text-green-700 font-bold text-xs md:text-base">
                        {dish.type === "rice" ? "From " : ""}₦{dish.price.toLocaleString()}
                      </span>
                    </div>
                  <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">{dish.desc}</p>

                  {dish.type === "soup" && (
                    <details className="mb-4">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-green-900">
                        Choose your swallow
                      <span className="float-right text-green-600">+</span>
                      </summary>
                      <select
                        value={selectedSwallow[dish.id] || ""}
                        onChange={(e) =>
                          setSelectedSwallow((prev) => ({
                            ...prev,
                            [dish.id]: e.target.value,
                          }))
                        }
                        className="mt-2 w-full border border-green-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select swallow</option>
                        {swallowOptions.map((swallow) => (
                          <option key={swallow.name} value={swallow.name}>
                            {swallow.name} — ₦{swallow.price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </details>
                  )}

                  {dish.type === "rice" && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-green-900 mb-2">
                        Choose proteins and portions (optional)
                      </label>
                      <div className="space-y-2">
                        {proteinOptions.map((protein) => {
                          const quantity =
                            selectedProtein[dish.id]?.[protein.name] || 0;

                          return (
                            <div
                              key={protein.name}
                              className="flex items-center justify-between border border-green-100 rounded-lg px-3 py-2"
                            >
                              <span className="text-sm">
                                {protein.name} — ₦{protein.price.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedProtein((prev) => ({
                                      ...prev,
                                      [dish.id]: {
                                        ...prev[dish.id],
                                        [protein.name]: Math.max(0, quantity - 1),
                                      },
                                    }))
                                  }
                                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200"
                                  aria-label={`Remove one portion of ${protein.name}`}
                                >
                                  −
                                </button>
                                <span className="w-5 text-center font-medium">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedProtein((prev) => ({
                                      ...prev,
                                      [dish.id]: {
                                        ...prev[dish.id],
                                        [protein.name]: quantity + 1,
                                      },
                                    }))
                                  }
                                  className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 text-green-900"
                                  aria-label={`Add one portion of ${protein.name}`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Rice base: ₦{dish.price.toLocaleString()} + selected portions
                      </p>
                    </div>
                  )}

                  {dish.type === "meat" && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-green-900 mb-2">
                        Choose your side
                      </label>
                      <select
                        value={selectedPairing[dish.id] || ""}
                        onChange={(e) =>
                          setSelectedPairing((prev) => ({
                            ...prev,
                            [dish.id]: e.target.value,
                          }))
                        }
                        className="w-full border border-green-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select side — ₦1,000</option>
                        {pairingOptions.map((pairing) => (
                          <option key={pairing} value={pairing}>
                            {pairing} — ₦1,000
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {dish.name !== "Parfait" && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-green-900 mb-2">
                        Add water
                      </label>
                      <select
                        value={selectedWater[dish.id] ? "water" : ""}
                        onChange={(e) =>
                          setSelectedWater((prev) => ({
                            ...prev,
                            [dish.id]: e.target.value === "water",
                          }))
                        }
                        className="w-full border border-green-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">No water</option>
                        <option value="water">Water — ₦{waterPrice.toLocaleString()}</option>
                      </select>
                    </div>
                  )}

                  <details className="mb-4">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-green-900">
                      Drinks
                      <span className="float-right text-green-600">+</span>
                    </summary>
                    <div className="mt-2 flex gap-2">
                      <select
                        value={selectedDrink[dish.id]?.name || ""}
                        onChange={(e) =>
                          setSelectedDrink((prev) => ({
                            ...prev,
                            [dish.id]: {
                              name: e.target.value,
                              quantity: e.target.value
                                ? prev[dish.id]?.quantity || 1
                                : 0,
                            },
                          }))
                        }
                        className="min-w-0 flex-1 border border-green-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">No drink</option>
                        {drinkOptions.map((drink) => (
                          <option key={drink.name} value={drink.name}>
                            {drink.name} — ₦{drink.price.toLocaleString()}
                          </option>
                        ))}
                        {dish.type === "meat" && (
                          <optgroup label="Beer (404 & Bush Meat only)">
                            {beerOptions.map((drink) => (
                              <option key={drink.name} value={drink.name}>
                                {drink.name} — ₦{drink.price.toLocaleString()}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                      {selectedDrink[dish.id]?.name && (
                        <input
                          type="number"
                          min="1"
                          value={selectedDrink[dish.id].quantity}
                          onChange={(e) =>
                            setSelectedDrink((prev) => ({
                              ...prev,
                              [dish.id]: {
                                ...prev[dish.id],
                                quantity: Math.max(1, Number(e.target.value) || 1),
                              },
                            }))
                          }
                          className="w-20 border border-green-200 rounded-lg px-2 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                          aria-label="Drink quantity"
                        />
                      )}
                    </div>
                  </details>

                  <button
                    onClick={() => addToCart(dish)}
                    disabled={addedFeedback[dish.id]}
                    className={`w-full py-2.5 rounded-full font-medium transition ${
                      addedFeedback[dish.id]
                        ? "bg-green-500 text-white cursor-default"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {addedFeedback[dish.id] ? "Added! ✓" : "Add to Cart"}
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600 mb-3">
            Our Story
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-6">
            Good food should be easy to find, easy to order, and delivered right.
          </h2>
          <div className="space-y-4 text-gray-600 leading-7">
            <p>
              ChopHub was born from a simple idea:{" "}
              <strong className="text-green-800">
                good food should be easy to find, easy to order, and delivered
                right.
              </strong>
            </p>
            <p>
              We created ChopHub to connect people with the food they love from
              restaurants and food vendors across Calabar, while making the
              entire experience more convenient, reliable, and enjoyable.
            </p>
            <p>
              From the moment you place your order to the moment it arrives at
              your door, we focus on the details that matter:{" "}
              <strong className="text-green-800">
                quality, convenience, presentation, and great service.
              </strong>
            </p>
            <p className="font-semibold text-green-800">
              ChopHub is more than food delivery. It&apos;s your hub for good
              food.
            </p>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsCartOpen(false)}
          ></div>

          <div className="relative bg-white w-full max-w-md h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-xl font-bold text-green-900">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                  Your cart is empty
                </p>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b pb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-900">
                            {item.name}
                          </h3>
                          <p className="text-green-700 font-medium">
                            ₦{item.price.toLocaleString()} / portion
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              −
                            </button>
                            <span className="font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Details Form */}
                  <div className="space-y-4 border-t pt-5">
                    <h3 className="font-bold text-green-900">
                      Delivery Details
                    </h3>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 08012345678"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Delivery Address
                      </label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter full delivery address"
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-5">
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total</span>
                  <span className="text-green-700">
                    ₦{totalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={sendOrderToWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold transition"
                >
                  Proceed to Checkout (WhatsApp)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="bg-green-50 py-16 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-600 mb-3">
              Get in touch
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900">
              Contact ChopHub
            </h2>
            <p className="text-gray-600 mt-3">
              We are available 24/7 to help with your order or question.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-green-900 mb-5">
                Contact information
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-green-100 pb-5 mb-5">
                <img
                  src="/whatsapp-qr.svg"
                  alt="Scan to chat with ChopHub on WhatsApp"
                  className="w-32 h-32 rounded-lg"
                />
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-green-900">Scan to order on WhatsApp</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Point your phone camera at the QR code to start a chat.
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  <span className="block text-sm font-semibold text-green-800">WhatsApp / Orders</span>
                  <a href="https://wa.me/2348081688937" target="_blank" rel="noreferrer" className="hover:text-green-700">
                    +234 808 168 8937
                  </a>
                </p>
                <p>
                  <span className="block text-sm font-semibold text-green-800">Phone</span>
                  <a href="tel:+2348137963930" className="hover:text-green-700">
                    +234 813 796 3930
                  </a>
                </p>
                <p>
                  <span className="block text-sm font-semibold text-green-800">Email</span>
                  <a href="mailto:chophub@aol.com" className="hover:text-green-700">
                    chophub@aol.com
                  </a>
                </p>
                <p>
                  <span className="block text-sm font-semibold text-green-800">Service area</span>
                  Calabar Municipal and Calabar South
                </p>
                <p>
                  <span className="block text-sm font-semibold text-green-800">Opening hours</span>
                  24/7
                </p>
                <p>
                  <span className="block text-sm font-semibold text-green-800">Social media</span>
                  <a
                    href="https://x.com/chophubfood"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-green-700"
                  >
                    X/Twitter
                  </a>
                  {" · "}
                  <a
                    href="https://www.facebook.com/share/1BW844CEN9/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-green-700"
                  >
                    Facebook
                  </a>
                  {" · Instagram · TikTok: @chophub"}
                </p>
              </div>
            </div>

            <form
              onSubmit={sendContactMessage}
              className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm space-y-4"
            >
              <h3 className="text-xl font-bold text-green-900">Send us a message</h3>
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="contact-details" className="block text-sm font-medium mb-1">Phone or email</label>
                <input
                  id="contact-details"
                  type="text"
                  required
                  value={contactDetails}
                  onChange={(event) => setContactDetails(event.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(event) => setContactMessage(event.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-100 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src="/Chop_icon_white.png"
              alt="ChopHub"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-white font-bold text-lg">
              ChopHub Calabar
            </span>
          </div>
          <p className="text-sm mb-6">
            Authentic indigenous Calabar cuisine, delivered with love.
          </p>
          <p className="text-xs text-green-300">
            © 2026 ChopHub Calabar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}