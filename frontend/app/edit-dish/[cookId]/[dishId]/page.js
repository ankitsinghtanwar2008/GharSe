"use client";

import { useParams } from "next/navigation";
import { useState,useEffect } from "react";

export default function EditDish(){

const {cookId,dishId} = useParams();

const [dishName,setDishName] = useState("");
const [description,setDescription] = useState("");
const [price,setPrice] = useState("");
const [location,setLocation] = useState("");
const [image,setImage] = useState(null);

useEffect(()=>{
fetchDish();
},[])

const fetchDish = async()=>{

const res = await fetch(`http://localhost:5000/api/cooks/${cookId}`);
const data = await res.json();

const dish = data.dishes.find(d=>d._id===dishId);

setDishName(dish.dishName);
setDescription(dish.description);
setPrice(dish.price);
setLocation(dish.location);

}

const updateDish = async(e)=>{

e.preventDefault();

const formData = new FormData();

formData.append("dishName",dishName);
formData.append("description",description);
formData.append("price",price);
formData.append("location",location);

if(image){
formData.append("image",image);
}

await fetch(`http://localhost:5000/api/cooks/update-dish/${cookId}/${dishId}`,{
method:"PUT",
body:formData
})

alert("Dish Updated Successfully");

}

return(

<div className="p-10">

<h1 className="text-3xl mb-6">
Edit Dish
</h1>

<form onSubmit={updateDish} className="space-y-4">

<input
value={dishName}
onChange={(e)=>setDishName(e.target.value)}
className="border p-2 w-full"
/>

<input
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="border p-2 w-full"
/>

<input
value={price}
onChange={(e)=>setPrice(e.target.value)}
className="border p-2 w-full"
/>

<input
value={location}
onChange={(e)=>setLocation(e.target.value)}
className="border p-2 w-full"
/>

<input
type="file"
onChange={(e)=>setImage(e.target.files[0])}
/>

<button className="bg-green-500 text-white px-6 py-2 rounded">
Update Dish
</button>

</form>

</div>

)

}