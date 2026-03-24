"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (!form.name || !form.phone || !form.password) {
      alert("All fields are required");
      return;
    }

    if (form.phone.length < 10) {
      alert("Enter valid phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Invalid server response" };
      }

      if (res.ok) {
        alert("Signup successful ✅");

        // 👉 clear form
        setForm({
          name: "",
          phone: "",
          password: "",
        });

        // 👉 redirect to login
        router.push("/login");
      } else {
        console.log("BACKEND ERROR:", data);
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.log("FRONTEND ERROR:", error);
      alert("Cannot connect to server ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-xl w-96 text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account 🚀
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
        />

        {/* Password */}
        <div className="relative mb-5">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
          />

          <div
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-blue-500 py-3 rounded-lg font-semibold"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Login redirect */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="cursor-pointer font-semibold underline"
          >
            Login
          </span>
        </p>
      </motion.form>
    </div>
  );
}