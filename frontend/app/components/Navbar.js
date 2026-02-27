"use client";

import Link from "next/link";
import { useRouter,usePathname } from "next/navigation";
import { useEffect,useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar(){

const router = useRouter();
const pathname = usePathname();

const { cartItems } = useCart();

const [isLoggedIn,setIsLoggedIn] = useState(false);
const [mounted,setMounted] = useState(false);

useEffect(()=>{

const loginStatus = localStorage.getItem("isLoggedIn");

if(loginStatus === "true"){
setIsLoggedIn(true);
}

setMounted(true);

},[])

const handleLogout = ()=>{

localStorage.setItem("isLoggedIn","false");
localStorage.removeItem("user");

setIsLoggedIn(false);

router.push("/login");

}

const linkStyle = (path)=>
`transition-all duration-300 hover:text-blue-400 ${
pathname===path ? "text-blue-400 font-semibold" : ""
}`

if(!mounted) return null;

return(

<nav className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-gray-800 shadow-lg">

<div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

<Link
href="/"
className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
>
GharSe
</Link>

<div className="flex gap-8 items-center text-gray-300">

<Link href="/" className={linkStyle("/")}>
Home
</Link>

<Link href="/dashboard" className={linkStyle("/dashboard")}>
Dashboard
</Link>

<Link href="/add-cook" className={linkStyle("/add-cook")}>
Add Cook
</Link>

<Link href="/cooks" className={linkStyle("/cooks")}>
Chefs
</Link>

</div>

<div className="flex gap-4 items-center">

{isLoggedIn ? (

<>

<Link
href="/cart"
className="relative bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
>

🛒 Cart

{cartItems?.length > 0 && (

<span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-1 rounded-full">

{cartItems.length}

</span>

)}

</Link>

<button
onClick={handleLogout}
className="bg-red-500/90 px-5 py-2 rounded-full hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-md"
>

Logout

</button>

</>

):( 

<Link
href="/login"
className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full hover:scale-105 transition-all duration-300 shadow-md"
>
Login
</Link>

)}

</div>

</div>

</nav>

)

}