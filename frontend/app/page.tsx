"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center text-white text-center">
      <h1 className="text-5xl font-bold mb-6">
        Welcome to GharSe 🍽️
      </h1>

      <p className="mb-8 text-lg">
        Homemade food delivered with love.
      </p>

      <div className="space-x-4">
        <button
          onClick={() => router.push("/login")}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
