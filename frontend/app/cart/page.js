"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: localStorage.getItem("userId"),
        items: cartItems,
        totalAmount: totalPrice,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("🎉 Order Placed Successfully!");
      clearCart();
    } else {
      alert("❌ Order Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Your Cart 🛒
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl">Your cart is empty</p>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-6 flex justify-between items-center border border-gray-700"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-300 mt-1">
                    ₹{item.price} × {item.quantity}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition"
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition shadow-md"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Total Section */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-gray-700 mt-8">
              <h2 className="text-2xl font-bold">
                Total: ₹{totalPrice}
              </h2>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {loading ? "Processing..." : "Place Order 🚀"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}