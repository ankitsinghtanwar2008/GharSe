"use client";

import { useRouter } from "next/navigation";

export default function SuccessPage(){

const router = useRouter();

return(

<div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">

<h1 className="text-4xl font-bold text-green-400">
🎉 Order Placed Successfully
</h1>

<p className="mt-4 text-gray-400">
Your food is being prepared 🍕
</p>

<button
onClick={()=>router.push("/")}
className="mt-6 bg-blue-500 px-6 py-3 rounded-xl"
>
Back To Home
</button>

</div>

);
}