"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ParticleBackground from "../../../components/ParticleBackground";

export default function ChefDishes() {
  const { id } = useParams();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:5000/api/cooks/${id}`);
    const data = await res.json();
    setDishes(data.dishes || []);
    setLoading(false);
  };

  const deleteDish = async (dishId) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;
    await fetch(`http://localhost:5000/api/cooks/delete-dish/${id}/${dishId}`, {
      method: "DELETE",
    });
    alert("Dish Deleted Successfully");
    fetchDishes();
  };

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden p-10">
      <ParticleBackground />

      <h1 className="text-4xl font-extrabold text-white mb-12 text-center relative z-10">
        Chef Dishes
      </h1>

      {loading ? (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-2xl h-80 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {dishes.map((dish, idx) => (
            <motion.div
              key={dish._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 p-5 rounded-2xl shadow-2xl hover:shadow-pink-600 hover:-translate-y-2 cursor-pointer transition-all duration-300"
            >
              <img
                src={`http://localhost:5000/uploads/${dish.image}`}
                alt={dish.dishName}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold text-white mb-1">{dish.dishName}</h2>
              <p className="text-gray-300 mb-2">{dish.description}</p>
              <p className="text-yellow-400 font-bold mb-4">₹{dish.price}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => (window.location.href = `/edit-dish/${id}/${dish._id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex-1 shadow-md transition-all duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteDish(dish._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex-1 shadow-md transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}