"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ParticleBackground from "../../../../components/ParticleBackground";
import { FiUpload } from "react-icons/fi";

export default function EditDish() {
  const { cookId, dishId } = useParams();

  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDish();
  }, []);

  const fetchDish = async () => {
    const res = await fetch(`http://localhost:5000/api/cooks/${cookId}`);
    const data = await res.json();

    const dish = data.dishes.find((d) => d._id === dishId);

    setDishName(dish.dishName || "");
    setDescription(dish.description || "");
    setPrice(dish.price || "");
    setLocation(dish.location || "");
  };

  const updateDish = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("dishName", dishName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);

    if (image) {
      formData.append("image", image);
    }

    await fetch(
      `http://localhost:5000/api/cooks/update-dish/${cookId}/${dishId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    alert("Dish Updated Successfully");
  };

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden flex flex-col items-center justify-center p-10">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Heading */}
      <motion.h1
        className="text-4xl font-extrabold text-white mb-10 z-10 relative"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Edit Dish
      </motion.h1>

      {/* Form */}
      <motion.form
        onSubmit={updateDish}
        className="space-y-6 bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl w-full max-w-xl relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.input
          type="text"
          placeholder="Dish Name"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          className="border border-gray-600 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white placeholder-gray-400"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-600 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white placeholder-gray-400"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-600 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white placeholder-gray-400"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-600 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white placeholder-gray-400"
          whileFocus={{ scale: 1.02 }}
        />

        {/* Drag & Drop File Upload */}
        <motion.div
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setImage(e.dataTransfer.files[0]);
            }
          }}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-full w-40 h-40 mx-auto cursor-pointer transition-all duration-300 ${
            dragOver ? "border-pink-500 bg-pink-100/10" : "border-gray-500"
          }`}
        >
          <FiUpload className="text-4xl text-white mb-2" />
          <span className="text-white text-center text-sm px-2">
            {image ? image.name : "Drag & Drop or Click"}
          </span>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </motion.div>

        {/* Update Button */}
        <motion.button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl w-full font-semibold shadow-lg transition-transform duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Update Dish
        </motion.button>
      </motion.form>
    </div>
  );
}