"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function PaymentPage(){

const router = useRouter();
const {cartItems,totalPrice,clearCart} = useCart();

const [paymentMethod,setPaymentMethod] = useState("");

const CODcharge = Math.round(totalPrice * 0.02);
const CODtotal = totalPrice + CODcharge;

const handleCOD = async()=>{

await fetch("/api/orders",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
items:cartItems,
totalAmount:CODtotal,
paymentType:"COD",
address:JSON.parse(localStorage.getItem("address"))
})
});

clearCart();

router.push("/order-success");

};

const handleOnlinePayment = async()=>{

const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({ amount: totalPrice })
});

const order = await res.json();

const options = {

key: "YOUR_RAZORPAY_KEY",

amount: order.amount,

currency: "INR",

name: "GharSe",

description: "Food Order",

order_id: order.id,

handler: async function () {

await fetch("/api/orders",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
items:cartItems,
totalAmount:totalPrice,
paymentType:"ONLINE",
address:JSON.parse(localStorage.getItem("address"))
})
});

clearCart();

router.push("/order-success");

}

};

const razor = new window.Razorpay(options);

razor.open();

};

return(

<div className="min-h-screen bg-black text-white flex justify-center items-center">

<div className="bg-white/10 p-8 rounded-2xl w-96 space-y-6">

<h2 className="text-2xl font-bold text-center">
Select Payment
</h2>

<div className="space-y-3">

<button
onClick={handleCOD}
className="w-full bg-green-500 py-3 rounded"
>
Cash On Delivery (+₹{CODcharge})
Total ₹{CODtotal}
</button>

<button
onClick={handleOnlinePayment}
className="w-full bg-purple-500 py-3 rounded"
>
Online Payment ₹{totalPrice}
</button>

</div>

</div>

</div>

);
}