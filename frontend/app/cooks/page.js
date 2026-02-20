"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ParticleBackground from "@/components/ParticleBackground";

export default function CooksPage() {
  const [cooks, setCooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCooks();
  }, []);

  const fetchCooks = async () => {
    const res = await fetch("http://localhost:5000/api/cooks");
    const data = await res.json();
    setCooks(data);
    setLoading(false);
  };

  const deleteCook = async (id) => {
    await fetch(`http://localhost:5000/api/cooks/${id}`, {
      method: "DELETE",
    });

    setCooks((prev) => prev.filter((cook) => cook._id !== id));
  };

  const filteredCooks = cooks.filter((cook) =>
    cook.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white px-8 py-12">
      
      {/* 🔥 3D PARTICLES BACKGROUND */}
      <ParticleBackground />

      <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        👨‍🍳 Meet Our Chefs
      </h1>

      <div className="flex justify-center mb-12">
        <input
          type="text"
          placeholder="Search cook..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-96 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      {loading ? (
        <p className="text-center animate-pulse text-gray-400">
          Loading chefs...
        </p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCooks.map((cook) => (
            <div
              key={cook._id}
              className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-800 transform hover:-translate-y-4 hover:rotate-1 transition-all duration-500"
            >
              <div className="h-60 overflow-hidden">
                <img
                  src={`http://localhost:5000/uploads/${cook.image}`}
                  alt={cook.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold mb-6">
                  {cook.name}
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={() => router.push(`/edit/${cook._id}`)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 py-2 rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    ✏ Edit
                  </button>

                  <button
                    onClick={() => deleteCook(cook._id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 py-2 rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}