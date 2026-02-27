"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChefDishes(){

const {id} = useParams();

const [dishes,setDishes] = useState([]);

useEffect(()=>{
fetchDishes();
},[])

const fetchDishes = async()=>{

const res = await fetch(`http://localhost:5000/api/cooks/${id}`);
const data = await res.json();

setDishes(data.dishes || []);

}

const deleteDish = async(dishId)=>{

const confirmDelete = confirm("Are you sure you want to delete this dish?");

if(!confirmDelete){
return;
}

await fetch(`http://localhost:5000/api/cooks/delete-dish/${id}/${dishId}`,{
method:"DELETE"
})

alert("Dish Deleted Successfully");

fetchDishes()

}

return(

<div className="p-10">

<h1 className="text-3xl mb-8 font-bold">
Chef Dishes
</h1>

<div className="grid grid-cols-3 gap-6">

{dishes.map((dish)=>(

<div key={dish._id} className="border p-4 rounded">

<img
src={`http://localhost:5000/uploads/${dish.image}`}
className="w-full h-40 object-cover mb-3"
/>

<h2 className="text-xl font-bold">
{dish.dishName}
</h2>

<p>
{dish.description}
</p>

<p className="font-bold">
₹{dish.price}
</p>

<div className="flex gap-2 mt-3">

<button
onClick={()=>window.location.href=`/edit-dish/${id}/${dish._id}`}
className="bg-blue-500 text-white px-3 py-1 rounded"
>
Edit
</button>

<button
onClick={()=>deleteDish(dish._id)}
className="bg-red-500 text-white px-3 py-1 rounded"
>
Delete
</button>

</div>

</div>

))}

</div>

</div>

)

}