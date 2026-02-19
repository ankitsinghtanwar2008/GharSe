"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-black text-white">

      {/* LEFT SIDE LINKS */}
      <div className="flex gap-6 items-center">
        <Link href="/" className="hover:text-blue-400 transition">
          Home
        </Link>

        <Link href="/dashboard" className="hover:text-blue-400 transition">
          Dashboard
        </Link>

        <Link href="/add-cook" className="hover:text-blue-400 transition">
          Add Cook
        </Link>

        {/* ✅ FIXED: Chefs now opens /cooks */}
        <Link href="/cooks" className="hover:text-blue-400 transition">
          Chefs
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex gap-4 items-center">

        {isLoggedIn ? (
          <>
            {/* Cart Button */}
            <Link
              href="/cart"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Cart ({cartItems.length})
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}
