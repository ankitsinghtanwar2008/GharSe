"use client";

import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, totalPrice } = useCart();
  const handlePlaceOrder = async () => {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId: localStorage.getItem("userId"),
      items: cartItems,
      totalAmount: total
    })
  });

  if (res.ok) {
    alert("Order Placed!");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Your Cart 🛒
      </h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>₹{item.price} × {item.quantity}</p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-4 py-1 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}

          <h2 className="text-xl font-bold mt-4">
            Total: ₹{totalPrice}
          </h2>
        </>
      )}
    </div>
  );
}
