"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ParticleBackground from "../../components/ParticleBackground";

export default function CooksPage() {
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCooks();
  }, []);

  const fetchCooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/cooks");
      const data = await res.json();
      setCooks(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteCook = async (id) => {
    if (!confirm("Are you sure you want to delete this cook?")) return;
    await fetch(`http://localhost:5000/api/cooks/${id}`, { method: "DELETE" });
    setCooks(cooks.filter((c) => c._id !== id));
  };

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden p-10">
      <ParticleBackground />

      <motion.h1
        className="text-5xl font-extrabold text-center text-white mb-12 relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Meet Our Chefs
      </motion.h1>

      {/* Loader Skeleton */}
      {loading ? (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-10 px-8 relative z-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-2xl h-96 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-10 px-8 relative z-10">
          {cooks.map((cook, idx) => (
            <motion.div
              key={cook._id}
              className="bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl hover:shadow-pink-500/50 cursor-pointer transition-all duration-300"
              whileHover={{ scale: 1.05, rotateY: 3 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="overflow-hidden rounded-xl border-2 border-gray-700">
                <img
                  src={`http://localhost:5000/uploads/${cook.image}`}
                  alt={cook.name}
                  className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              <h2 className="text-2xl font-semibold mt-4 mb-6 text-white">{cook.name}</h2>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push(`/edit/${cook._id}`)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl shadow-md transition-all duration-300 flex-1"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCook(cook._id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl shadow-md transition-all duration-300 flex-1"
                >
                  Delete
                </button>

                <button
                  onClick={() => router.push(`/add-dish/${cook._id}`)}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl shadow-md transition-all duration-300 flex-1"
                >
                  Add Dish
                </button>

                <button
                  onClick={() => router.push(`/chef-dishes/${cook._id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl shadow-md transition-all duration-300 flex-1"
                >
                  Manage Dishes
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}