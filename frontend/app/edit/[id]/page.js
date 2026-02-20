"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditCook() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCook = async () => {
      const res = await fetch("http://localhost:5000/api/cooks");
      const data = await res.json();
      const cook = data.find((c) => c._id === id);

      if (cook) {
        setName(cook.name);
        setPreview(`http://localhost:5000/uploads/${cook.image}`);
      }
    };

    fetchCook();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      setLoading(true);

      await fetch(`http://localhost:5000/api/cooks/${id}`, {
        method: "PUT",
        body: formData,
      });

      toast.success("Cook updated successfully 🎉");
      router.push("/cooks");
    } catch (err) {
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-6 overflow-hidden">

      {/* Animated Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 blur-[150px] opacity-20 rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500 blur-[150px] opacity-20 rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          ✏ Edit Cook
        </h2>

        <form onSubmit={handleUpdate} className="flex flex-col gap-6">

          {/* Name Input */}
          <div>
            <label className="text-sm text-gray-300">Cook Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter cook name"
            />
          </div>

          {/* Custom File Upload */}
          <div>
            <label className="text-sm text-gray-300">Upload New Image (Optional)</label>

            <label className="mt-2 flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition-all bg-white/5">
              <span className="text-gray-400">
                {image ? image.name : "Click to choose image"}
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="mt-2 overflow-hidden rounded-xl">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {loading ? "Updating..." : "Update Cook 🚀"}
          </button>

        </form>
      </div>
    </div>
  );
}