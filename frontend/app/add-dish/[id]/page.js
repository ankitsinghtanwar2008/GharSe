"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import ParticleBackground from "../../../components/ParticleBackground";
import toast, { Toaster } from "react-hot-toast";

export default function AddDish() {

  const { id } = useParams();
  const router = useRouter();

  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  /* ================= IMAGE UPLOAD ================= */

  const handleImage = (file) => {

    setImage(file);
    setPreview(URL.createObjectURL(file));

  };

  const handleDrop = (e) => {

    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) handleImage(file);

  };

  const handleFileChange = (e) => {

    const file = e.target.files[0];
    if (file) handleImage(file);

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!image) {
      toast.error("Please upload dish image");
      return;
    }

    const formData = new FormData();

    formData.append("dishName", dishName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("image", image);

    try {

      const res = await fetch(`http://localhost:5000/api/cooks/add-dish/${id}`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {

        setSuccess(true);

        toast.success("Dish added successfully!");

        setTimeout(() => {
          router.push("/cook");
        }, 2000);

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      toast.error("Server error");
      console.error(error);

    }

  };

  return (

    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">

      <ParticleBackground />
      <Toaster position="top-right" />

      {/* SUCCESS POPUP */}

      {success && (

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-10 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          Dish Added Successfully 🎉
        </motion.div>

      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid md:grid-cols-2 gap-10 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-[900px] text-white"
      >

        {/* ================= FORM ================= */}

        <div>

          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
            Add New Dish 🍽
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              placeholder="Dish Name"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-gray-600 focus:border-yellow-400 outline-none"
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-gray-600 focus:border-yellow-400 outline-none"
              required
            />

            <input
              type="number"
              placeholder="Price ₹"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-gray-600 focus:border-yellow-400 outline-none"
              required
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-gray-600 focus:border-yellow-400 outline-none"
              required
            />

            {/* DRAG DROP AREA */}

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-500 rounded-xl p-6 text-center cursor-pointer hover:border-yellow-400 transition"
            >

              <p className="text-gray-300 mb-2">
                Drag & Drop Dish Image
              </p>

              <input
                type="file"
                onChange={handleFileChange}
                className="text-sm"
              />

            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 text-black hover:shadow-lg hover:shadow-pink-500/40 transition-all"
            >
              Add Dish 🚀
            </motion.button>

          </form>

        </div>


        {/* ================= LIVE PREVIEW ================= */}

        <div className="flex items-center justify-center">

          <motion.div
            className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-[300px]"
            whileHover={{ scale: 1.05 }}
          >

            {preview && (
              <img
                src={preview}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5">

              <h2 className="text-xl font-bold text-yellow-400">
                {dishName || "Dish Name"}
              </h2>

              <p className="text-gray-300 text-sm mt-2">
                {description || "Dish description will appear here"}
              </p>

              <p className="text-green-400 mt-3">
                ₹ {price || "0"}
              </p>

              <p className="text-gray-400 text-sm">
                📍 {location || "Location"}
              </p>

            </div>

          </motion.div>

        </div>

      </motion.div>

    </div>

  );

}