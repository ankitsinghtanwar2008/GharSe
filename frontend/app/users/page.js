export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-6xl font-extrabold mb-6">GharSe</h1>
        <p className="text-xl max-w-2xl mb-8">
          Order homemade food directly from nearby homes. Fresh, hygienic and
          affordable meals delivered to your doorstep.
        </p>

        <div className="flex gap-4">
          <a
            href="/users"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            View Users
          </a>

          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
