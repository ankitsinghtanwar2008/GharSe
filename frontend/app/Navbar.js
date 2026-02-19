"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">GharSe</h1>

      <div className="flex gap-6 font-medium">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <Link href="/users" className="hover:text-blue-600">Users</Link>
        <Link href="#" className="hover:text-blue-600">Order Food</Link>
        <Link href="#" className="hover:text-blue-600">Become Cook</Link>
      </div>
    </nav>
  );
}
