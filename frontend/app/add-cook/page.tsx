"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";

export default function AddCook() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !image) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/cooks", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      alert("Cook added successfully 🎉");
      setName("");
      setImage(null);
    } catch (err) {
      alert("Error adding cook ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black relative overflow-hidden">
      
      <div className="absolute w-96 h-96 bg-pink-500 opacity-20 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full bottom-10 right-10 animate-bounce"></div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl w-[400px] text-white"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
          👨‍🍳 Add New Cook
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <input
            type="text"
            placeholder="Enter cook name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-xl p-6 cursor-pointer hover:border-pink-400 transition group">
            <UploadCloud className="w-8 h-8 mb-2 text-gray-300 group-hover:text-pink-400 transition" />
            <span className="text-sm text-gray-300 group-hover:text-pink-400 transition">
              {image ? image.name : "Click to upload image"}
            </span>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
              className="hidden"
            />
          </label>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 py-3 rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 transition"
          >
            {loading ? "Adding..." : "Add Cook"}
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
}