"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import ParticleBackground from "../../components/ParticleBackground"; // optional, add for animated background

export default function Dashboard() {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();

  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [chefFilter, setChefFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/cooks");
      const data = await res.json();

      let allDishes = [];
      data.forEach((cook) => {
        if (cook.dishes) {
          cook.dishes.forEach((dish) => {
            allDishes.push({
              _id: dish._id,
              dishName: dish.name,
              description: dish.description,
              price: dish.price,
              location: dish.location,
              image: dish.image,
              cookName: cook.name,
              rating: (Math.random() * 2 + 3).toFixed(1),
            });
          });
        }
      });

      setFoods(allDishes);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const chefs = ["All", ...new Set(foods.map((f) => f.cookName))];
  const locations = ["All", ...new Set(foods.map((f) => f.location))];

  const filteredFoods = foods.filter((food) => {
    const matchSearch = (food.dishName || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchChef = chefFilter === "All" || food.cookName === chefFilter;
    const matchLocation = locationFilter === "All" || food.location === locationFilter;
    return matchSearch && matchChef && matchLocation;
  });

  const toggleSave = (id) => {
    if (saved.includes(id)) {
      setSaved(saved.filter((i) => i !== id));
    } else {
      setSaved([...saved, id]);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-10 overflow-hidden">
      {/* Optional Particle Background */}
      <ParticleBackground />

      {/* Header */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        <h1 className="text-4xl font-bold">Homemade Premium Meals 🍽️</h1>
        <div className="bg-white/10 px-6 py-2 rounded-xl">
          🛒 {cartItems.length}
        </div>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-10 relative z-10">
        <input
          placeholder="Search your favourite meal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded text-black"
        />
        <select
          value={chefFilter}
          onChange={(e) => setChefFilter(e.target.value)}
          className="p-3 rounded text-black"
        >
          {chefs.map((chef, i) => (
            <option key={i}>{chef}</option>
          ))}
        </select>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-3 rounded text-black"
        >
          {locations.map((loc, i) => (
            <option key={i}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
        {/* Loader Skeleton */}
        {loading &&
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 bg-white/10 rounded-xl animate-pulse"
            ></div>
          ))}

        {!loading && filteredFoods.length === 0 && (
          <p className="text-center col-span-full">No dishes available</p>
        )}

        {!loading &&
          filteredFoods.map((food, index) => (
            <motion.div
              key={food._id}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl p-5 rounded-xl shadow-lg relative"
            >
              {/* Save button */}
              <button
                onClick={() => toggleSave(food._id)}
                className="absolute right-4 top-4 text-xl"
              >
                {saved.includes(food._id) ? "❤️" : "🤍"}
              </button>

              <img
                src={`http://localhost:5000/uploads/${food.image}`}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <h2 className="text-xl font-bold text-pink-300">{food.dishName}</h2>

              <p className="text-gray-300 mt-1">{food.description}</p>

              <p className="text-gray-300">Chef: {food.cookName}</p>
              <p className="text-gray-400">📍 {food.location}</p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400">⭐ {food.rating}</span>
                <span className="bg-red-500 text-xs px-2 py-1 rounded">🔥 Popular</span>
              </div>

              <p className="text-blue-400 font-bold mt-2">₹{food.price}</p>

              <button
                onClick={() => addToCart(food)}
                className="mt-4 w-full bg-gradient-to-r from-pink-500 to-blue-500 py-2 rounded"
              >
                Add to Cart
              </button>
            </motion.div>
          ))}
      </div>
    </div>
  );
}