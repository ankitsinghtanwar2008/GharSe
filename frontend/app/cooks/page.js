"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CooksPage() {

  const [cooks, setCooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/cooks")
      .then(res => res.json())
      .then(data => setCooks(data));
  }, []);

  const deleteCook = async (id) => {

    await fetch(`http://localhost:5000/api/cooks/${id}`,{
      method:"DELETE"
    });

    setCooks(cooks.filter(c => c._id !== id));
  };

  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-8 text-center">
        Meet Our Chefs
      </h1>

      <div className="grid grid-cols-3 gap-8">

        {cooks.map((cook)=>(
          <div key={cook._id} className="bg-gray-900 p-6 rounded-xl">

            <img
              src={`http://localhost:5000/uploads/${cook.image}`}
              className="rounded-lg mb-4"
            />

            <h2 className="text-xl text-white mb-4">{cook.name}</h2>

            <div className="flex gap-3">

              <button
                onClick={()=>router.push(`/edit/${cook._id}`)}
                className="bg-green-500 px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={()=>deleteCook(cook._id)}
                className="bg-red-500 px-4 py-2 rounded"
              >
                Delete
              </button>

              <button
                onClick={()=>router.push(`/add-dish/${cook._id}`)}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                Add Dish
              </button>
              <button
                onClick={()=>router.push(`/chef-dishes/${cook._id}`)}
                className="bg-yellow-500 px-4 py-2 rounded"
              >
                Manage Dishes
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>

  );
}