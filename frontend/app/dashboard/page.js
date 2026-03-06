"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import ParticleBackground from "../../components/ParticleBackground";

export default function Dashboard() {

  const router = useRouter();
  const { addToCart, cartItems } = useCart();

  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [chefFilter, setChefFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

  useEffect(() => {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const storedRatings =
      JSON.parse(localStorage.getItem("ratings")) || {};

    const storedComments =
      JSON.parse(localStorage.getItem("comments")) || {};

    setRatings(storedRatings);
    setComments(storedComments);

    fetchFoods();

  }, []);

  const fetchFoods = async () => {

    setLoading(true);

    try {

      const res = await fetch("http://localhost:5000/api/cooks");
      const data = await res.json();

      let allDishes = [];

      data.forEach((cook) => {

        if (cook.dishes) {

          cook.dishes.forEach((dish) => {

            allDishes.push({
              _id: dish._id,
              dishName: dish.name,
              description: dish.description,
              price: dish.price,
              location: dish.location,
              image: dish.image,
              cookName: cook.name,
            });

          });

        }

      });

      setFoods(allDishes);

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  };

  const chefs = ["All", ...new Set(foods.map((f) => f.cookName))];

  const locations = [
    "All",
    ...new Set(foods.map((f) => f.location)),
  ];

  const filteredFoods = foods.filter((food) => {

    const matchSearch = (food.dishName || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchChef =
      chefFilter === "All" || food.cookName === chefFilter;

    const matchLocation =
      locationFilter === "All" ||
      food.location === locationFilter;

    return matchSearch && matchChef && matchLocation;

  });

  const toggleSave = (id) => {

    if (saved.includes(id)) {

      setSaved(saved.filter((i) => i !== id));

    } else {

      setSaved([...saved, id]);

    }

  };

  const addRating = (dishId, value) => {

    const updated = { ...ratings };

    if (!updated[dishId]) updated[dishId] = [];

    updated[dishId].push(value);

    setRatings(updated);

    localStorage.setItem("ratings", JSON.stringify(updated));

  };

  const getAverageRating = (dishId) => {

    if (!ratings[dishId]) return 0;

    const total = ratings[dishId].reduce((a, b) => a + b, 0);

    return (total / ratings[dishId].length).toFixed(1);

  };

  const addComment = (dishId) => {

    const text = commentInput[dishId];

    if (!text) return;

    const updated = { ...comments };

    if (!updated[dishId]) updated[dishId] = [];

    updated[dishId].push(text);

    setComments(updated);

    localStorage.setItem("comments", JSON.stringify(updated));

    setCommentInput({
      ...commentInput,
      [dishId]: "",
    });

  };

  return (

    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-10 overflow-hidden">

      <ParticleBackground />

      <div className="flex justify-between items-center mb-10 relative z-10">

        <h1 className="text-4xl font-bold">
          Homemade Premium Meals 🍽️
        </h1>

        <div className="bg-white/10 px-6 py-2 rounded-xl">
          🛒 {cartItems.length}
        </div>

      </div>

      {/* FILTERS */}

      <div className="grid md:grid-cols-3 gap-6 mb-10 relative z-10 bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg">

        <input
          placeholder="Search meals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-xl bg-white/80 text-black outline-none focus:ring-2 focus:ring-pink-400"
        />

        <select
          value={chefFilter}
          onChange={(e) => setChefFilter(e.target.value)}
          className="p-3 rounded-xl bg-white/80 text-black outline-none focus:ring-2 focus:ring-blue-400"
        >
          {chefs.map((chef, i) => (
            <option key={i}>
              {chef === "All" ? "All Cooks" : chef}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-3 rounded-xl bg-white/80 text-black outline-none focus:ring-2 focus:ring-purple-400"
        >
          {locations.map((loc, i) => (
            <option key={i}>
              {loc === "All" ? "All Locations" : loc}
            </option>
          ))}
        </select>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">

        {loading &&
          [1, 2, 3, 4, 5, 6].map((i) => (

            <div
              key={i}
              className="h-80 bg-white/10 rounded-xl animate-pulse"
            ></div>

          ))}

        {!loading &&
          filteredFoods.map((food, index) => {

            const avg = getAverageRating(food._id);

            const userRating =
              ratings[food._id]?.slice(-1)[0] || 0;

            return (

              <motion.div
                key={food._id}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="bg-white/10 backdrop-blur-xl p-5 rounded-xl shadow-lg relative"
              >

                <button
                  onClick={() => toggleSave(food._id)}
                  className="absolute right-4 top-4 text-xl"
                >
                  {saved.includes(food._id) ? "❤️" : "🤍"}
                </button>

                <img
                  src={`http://localhost:5000/uploads/${food.image}`}
                  className="w-full h-40 object-cover rounded mb-3"
                />

                <h2 className="text-xl font-bold text-pink-300">
                  {food.dishName}
                </h2>

                <p className="text-gray-300">
                  {food.description}
                </p>

                <p className="text-gray-300">
                  Cooks: {food.cookName}
                </p>

                <p className="text-gray-400">
                  📍 {food.location}
                </p>

                <div className="flex items-center gap-2 mt-2">

                  <span className="text-yellow-400">
                    ⭐ {avg || "No rating"}
                  </span>

                  {avg >= 4.5 && (
                    <span className="bg-red-500 text-xs px-2 py-1 rounded">
                      🔥 Popular
                    </span>
                  )}

                </div>

                {/* DYNAMIC STARS */}

                <div className="flex gap-1 mt-2 text-xl">

                  {[1, 2, 3, 4, 5].map((star) => (

                    <button
                      key={star}
                      onClick={() =>
                        addRating(food._id, star)
                      }
                      className={
                        star <= userRating
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }
                    >
                      ★
                    </button>

                  ))}

                </div>

                <p className="text-blue-400 font-bold mt-2">
                  ₹{food.price}
                </p>

                <button
                  onClick={() => addToCart(food)}
                  className="mt-3 w-full bg-gradient-to-r from-pink-500 to-blue-500 py-2 rounded"
                >
                  Add to Cart
                </button>

                {/* COMMENT */}

                <div className="mt-4">

                  <input
                    value={commentInput[food._id] || ""}
                    onChange={(e) =>
                      setCommentInput({
                        ...commentInput,
                        [food._id]: e.target.value,
                      })
                    }
                    placeholder="Write comment..."
                    className="p-2 w-full text-black rounded"
                  />

                  <button
                    onClick={() =>
                      addComment(food._id)
                    }
                    className="mt-2 bg-green-500 px-3 py-1 rounded"
                  >
                    Comment
                  </button>

                </div>

                <div className="mt-2 text-sm text-gray-300">

                  {comments[food._id]?.map((c, i) => (
                    <p key={i}>💬 {c}</p>
                  ))}

                </div>

              </motion.div>

            );

          })}

      </div>

    </div>

  );

}