"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function AddDish(){

const {id} = useParams();

const [name,setName] = useState("");
const [description,setDescription] = useState("");
const [price,setPrice] = useState("");
const [location,setLocation] = useState("");
const [image,setImage] = useState(null);

const submitDish = async(e)=>{

e.preventDefault();

const formData = new FormData();

formData.append("name",name);
formData.append("description",description);
formData.append("price",price);
formData.append("location",location);
formData.append("image",image);

const res = await fetch(`http://localhost:5000/api/cooks/add-dish/${id}`,{
method:"POST",
body:formData
});

const data = await res.json();

alert(data.message || "Dish Added Successfully");

setName("");
setDescription("");
setPrice("");
setLocation("");
};

return(

<div className="p-10">

<h1 className="text-3xl mb-6">Add Dish</h1>

<form onSubmit={submitDish} className="space-y-4">

<input
placeholder="Dish Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="border p-2 w-full"
/>

<input
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="border p-2 w-full"
/>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
className="border p-2 w-full"
/>

<input
placeholder="Location"
value={location}
onChange={(e)=>setLocation(e.target.value)}
className="border p-2 w-full"
/>

<input
type="file"
onChange={(e)=>setImage(e.target.files[0])}
/>

<button className="bg-green-500 text-white px-6 py-2 rounded">
Add Dish
</button>

</form>

</div>

);
}