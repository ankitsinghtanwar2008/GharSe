"use client";

import { useState } from "react";

export default function ReviewBox({cookId,dishId,refresh}){

const [rating,setRating] = useState(0);
const [comment,setComment] = useState("");

const submitReview = async()=>{

if(rating===0){
alert("Please give rating");
return;
}

await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/review/${cookId}/${dishId}`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
rating,
comment,
userId:localStorage.getItem("userId")
})
});

setRating(0);
setComment("");

refresh();

}

return(

<div className="mt-4">

<div className="flex gap-2 mb-2">

{[1,2,3,4,5].map((star)=>(
<span
key={star}
onClick={()=>setRating(star)}
className={`cursor-pointer text-2xl ${rating>=star?"text-yellow-400":"text-gray-500"}`}
>
⭐
</span>
))}

</div>

<textarea
value={comment}
onChange={(e)=>setComment(e.target.value)}
placeholder="Write review..."
className="w-full p-2 rounded bg-gray-800 border border-gray-700"
/>

<button
onClick={submitReview}
className="bg-green-500 mt-2 px-4 py-1 rounded"
>
Submit Review
</button>

</div>

)

}