"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import { motion } from "framer-motion";

export default function CheckoutPage(){

const { cartItems,totalPrice,clearCart } = useCart();
const router = useRouter();

const [savedAddresses,setSavedAddresses] = useState([]);
const [selectedAddress,setSelectedAddress] = useState(null);

const [address,setAddress] = useState({
name:"",
phone:"",
town:"",
city:"",
state:"",
pincode:"",
landmark:""
});

const [errors,setErrors] = useState({});
const [paymentMethod,setPaymentMethod] = useState("online");

useEffect(()=>{

const stored = localStorage.getItem("savedAddresses");

if(stored){
setSavedAddresses(JSON.parse(stored));
}

},[]);

const handleChange=(e)=>{

setAddress({
...address,
[e.target.name]:e.target.value
});

};

const validateForm=()=>{

let newErrors={};

Object.keys(address).forEach((field)=>{
if(!address[field]){
newErrors[field]="Fill this field";
}
});

setErrors(newErrors);

return Object.keys(newErrors).length===0;

};

const isDuplicate=(newAddress)=>{

return savedAddresses.some(a=>
JSON.stringify(a)===JSON.stringify(newAddress)
);

};

const saveAddress=()=>{

if(!validateForm()) return;

if(isDuplicate(address)){
alert("Address already saved");
return;
}

const updated=[...savedAddresses,address];

setSavedAddresses(updated);

localStorage.setItem("savedAddresses",JSON.stringify(updated));

setSelectedAddress(address);

};

const deleteAddress=(index)=>{

const updated=savedAddresses.filter((_,i)=>i!==index);

setSavedAddresses(updated);

localStorage.setItem("savedAddresses",JSON.stringify(updated));

};

const codCharge = totalPrice * 0.02;

const finalTotal = paymentMethod==="cod"
? totalPrice + codCharge
: totalPrice;

const handlePayment = ()=>{

if(!selectedAddress && !validateForm()){
return;
}

alert("Order placed successfully 🎉");

clearCart();

router.push("/order-success");

};

return(

<div className="min-h-screen p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

<h1 className="text-4xl font-bold text-center mb-10">
Checkout
</h1>

<div className="grid md:grid-cols-2 gap-10">

{/* ADDRESS SECTION */}

<motion.div
initial={{opacity:0,x:-40}}
animate={{opacity:1,x:0}}
className="glassCard"
>

<h2 className="text-2xl font-semibold mb-4">
Shipping Address
</h2>

<div className="grid grid-cols-2 gap-4">

<input name="name" placeholder="Full Name" value={address.name} onChange={handleChange} className="input col-span-2"/>

<input name="phone" placeholder="Phone" value={address.phone} onChange={handleChange} className="input"/>

<input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange} className="input"/>

<input name="town" placeholder="Town" value={address.town} onChange={handleChange} className="input"/>

<input name="city" placeholder="City" value={address.city} onChange={handleChange} className="input"/>

<input name="state" placeholder="State" value={address.state} onChange={handleChange} className="input"/>

<input name="landmark" placeholder="Landmark" value={address.landmark} onChange={handleChange} className="input"/>

</div>

<button
onClick={saveAddress}
className="saveBtn"
>
Save Address
</button>

{/* SAVED ADDRESSES */}

{savedAddresses.length>0 &&(

<div className="mt-6">

<h3 className="text-lg font-semibold mb-3">
Saved Addresses
</h3>

<div className="space-y-3">

{savedAddresses.map((addr,i)=>(
<div
key={i}
className={`addressCard ${selectedAddress===addr ? "selected" : ""}`}
>

<div onClick={()=>setSelectedAddress(addr)}>

<p className="font-semibold">
Address {i+1}
</p>

<p className="text-sm opacity-70">
{addr.city} • {addr.pincode}
</p>

</div>

<button
onClick={()=>deleteAddress(i)}
className="deleteBtn"
>
Delete
</button>

</div>
))}

</div>

</div>

)}

</motion.div>

{/* PAYMENT SECTION */}

<motion.div
initial={{opacity:0,x:40}}
animate={{opacity:1,x:0}}
className="glassCard"
>

<div className="summary">

<h3 className="font-semibold mb-3">
Order Summary
</h3>

<div className="flex justify-between text-sm">
<span>Items</span>
<span>{cartItems.length}</span>
</div>

<div className="flex justify-between text-sm">
<span>Subtotal</span>
<span>₹{totalPrice}</span>
</div>

<div className="flex justify-between text-sm">
<span>Delivery</span>
<span>Free</span>
</div>

</div>

<h2 className="text-xl font-semibold mt-6 mb-4">
Payment Method
</h2>

<label className="paymentOption">

<span>Online Payment</span>

<input
type="radio"
checked={paymentMethod==="online"}
onChange={()=>setPaymentMethod("online")}
/>

</label>

<label className="paymentOption">

<span>Cash On Delivery (+2%)</span>

<input
type="radio"
checked={paymentMethod==="cod"}
onChange={()=>setPaymentMethod("cod")}
/>

</label>

<div className="border-t border-white/20 mt-6 pt-6">

<h3 className="text-3xl font-bold mb-5">
Total ₹{finalTotal.toFixed(2)}
</h3>

<button
onClick={handlePayment}
className="orderBtn"
>

Place Order

</button>

</div>

</motion.div>

</div>

<style jsx>{`

.glassCard{
background:rgba(255,255,255,0.05);
backdrop-filter:blur(12px);
border:1px solid rgba(255,255,255,0.1);
padding:24px;
border-radius:16px;
box-shadow:0 10px 40px rgba(0,0,0,0.6);
}

.input{
background:rgba(255,255,255,0.06);
border:1px solid rgba(255,255,255,0.15);
padding:12px;
border-radius:10px;
color:white;
outline:none;
transition:0.25s;
}

.input::placeholder{
color:rgba(255,255,255,0.5);
}

.input:hover{
border-color:#6366f1;
box-shadow:0 0 10px rgba(99,102,241,0.4);
}

.input:focus{
border-color:#22c55e;
box-shadow:0 0 12px rgba(34,197,94,0.6);
}

.saveBtn{
margin-top:16px;
width:100%;
background:linear-gradient(90deg,#6366f1,#9333ea);
padding:12px;
border-radius:10px;
font-weight:600;
transition:0.25s;
}

.saveBtn:hover{
transform:scale(1.05);
}

.addressCard{
display:flex;
justify-content:space-between;
align-items:center;
background:rgba(255,255,255,0.08);
padding:12px;
border-radius:10px;
cursor:pointer;
transition:0.2s;
}

.addressCard:hover{
background:rgba(255,255,255,0.15);
}

.selected{
border:1px solid #6366f1;
}

.deleteBtn{
color:#f87171;
}

.summary{
background:rgba(255,255,255,0.08);
padding:16px;
border-radius:10px;
}

.paymentOption{
display:flex;
justify-content:space-between;
align-items:center;
background:rgba(255,255,255,0.08);
padding:14px;
border-radius:10px;
margin-bottom:10px;
cursor:pointer;
transition:0.2s;
}

.paymentOption:hover{
background:rgba(255,255,255,0.15);
}

.orderBtn{
width:100%;
background:linear-gradient(90deg,#22c55e,#16a34a);
padding:14px;
border-radius:10px;
font-weight:700;
font-size:18px;
transition:0.25s;
}

.orderBtn:hover{
transform:scale(1.05);
}

`}</style>

</div>

);

}