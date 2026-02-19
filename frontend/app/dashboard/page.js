"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function Dashboard() {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();   // ✅ Hook inside component

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
    <div className="min-h-screen bg-gray-100 p-6">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          Available Homemade Meals 🍽️
        </h1>

        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Cart: {cartItems.length}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {food.name}
            </h2>

            <p className="text-gray-600 mb-3">
              {food.description}
            </p>

            <p className="font-bold text-blue-600 mb-3">
              ₹{food.price}
            </p>

            <button
              onClick={() => addToCart(food)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
