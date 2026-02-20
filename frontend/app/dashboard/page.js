"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  const foods = [
    {
      id: 1,
      name: "Rajma Chawal",
      description: "Delicious home-style rajma with steamed rice.",
      price: 120,
    },
    {
      id: 2,
      name: "Paneer Butter Masala",
      description: "Creamy paneer curry served with naan.",
      price: 180,
    },
    {
      id: 3,
      name: "Veg Thali",
      description: "Complete thali with 4 items + roti + rice.",
      price: 150,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">

      {/* Animated Background Circles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-96 h-96 bg-purple-500 opacity-30 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500 opacity-30 blur-3xl rounded-full bottom-10 right-10 animate-bounce"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center p-8">
        <motion.h1 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent"
        >
          Homemade Premium Meals 🍽️
        </motion.h1>

        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="bg-white/10 backdrop-blur-lg px-6 py-2 rounded-xl border border-white/20 shadow-lg"
        >
          🛒 {cartItems.length}
        </motion.div>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-8 pb-20">

        {foods.map((food, index) => (
          <motion.div
            key={food.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition duration-300"
          >
            <h2 className="text-2xl font-bold mb-3 text-pink-300">
              {food.name}
            </h2>

            <p className="text-gray-300 mb-4">
              {food.description}
            </p>

            <p className="text-xl font-bold text-blue-400 mb-4">
              ₹{food.price}
            </p>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => addToCart(food)}
              className="w-full bg-gradient-to-r from-pink-500 to-blue-500 py-2 rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 transition"
            >
              Add to Cart
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}