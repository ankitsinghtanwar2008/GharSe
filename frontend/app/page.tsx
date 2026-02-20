"use client";

import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const scrollRef = useRef(null);

  /* ================= LOGIN CHECK ================= */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  /* ================= SCROLL ================= */
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end center"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 4]);

  const images = ["/food1.png", "/food2.png", "/food3.png", "/food4.png"];

  return (
    <div className="relative bg-[#0b0f19] text-white overflow-x-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero3d.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight"
          >
            GharSe 🍽️
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg text-gray-300 max-w-xl mx-auto"
          >
            Homemade food delivered with love, speed & trust.
          </motion.p>

          {!isLoggedIn ? (
            <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/login")}
                className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-110 transition duration-300 shadow-lg"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-8 py-3 rounded-full border border-white text-white hover:bg-white hover:text-black transition duration-300"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-10 px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-110 transition duration-300"
            >
              Go to Dashboard 🚀
            </button>
          )}
        </div>
      </section>

      {/* ================= 3D ROTATION SECTION ================= */}
      <section
        ref={scrollRef}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0f19] to-black overflow-hidden relative"
      >
        <div className="relative w-full max-w-6xl h-[520px] flex items-center justify-center">
          {images.map((src, index) => {
            const [isHovered, setIsHovered] = useState(false);

            const x = useTransform(progress, (value) => {
              const position = (index - Math.floor(value) + 4) % 4;
              const positions = [-500, -170, 170, 500];
              return positions[position];
            });

            const scale = useTransform(progress, (value) => {
              const position = (index - Math.floor(value) + 4) % 4;
              if (isHovered) return 1.15;
              return position === 2 ? 1.35 : 0.9;
            });

            const rotate = useTransform(progress, (value) => {
              const position = (index - Math.floor(value) + 4) % 4;
              if (position === 2) return 0;
              if (position === 1) return -18;
              if (position === 3) return 18;
              return 28;
            });

            const blur = useTransform(progress, (value) => {
              const position = (index - Math.floor(value) + 4) % 4;
              if (isHovered) return "blur(0px)";
              return position === 2 ? "blur(0px)" : "blur(6px)";
            });

            const zIndex = useTransform(progress, (value) => {
              const position = (index - Math.floor(value) + 4) % 4;
              if (isHovered) return 100;
              return position === 2 ? 50 : 10;
            });

            return (
              <motion.div
                key={index}
                style={{ x, scale, rotate, filter: blur, zIndex }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                transition={{ type: "spring", stiffness: 200 }}
                className="absolute rounded-3xl cursor-pointer"
              >
                <img
                  src={src}
                  className="w-[320px] rounded-3xl shadow-2xl"
                  draggable={false}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="min-h-screen bg-gradient-to-b from-black to-[#0b0f19] flex flex-col justify-center items-center px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-16"
        >
          Why GharSe?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl">
          {[
            {
              title: "Homemade Taste 👩‍🍳",
              desc: "Authentic ghar ka khana made by verified home cooks.",
            },
            {
              title: "Fast Delivery ⚡",
              desc: "Blinkit level speed with fresh hot meals.",
            },
            {
              title: "Affordable 💸",
              desc: "No fancy pricing, just honest food pricing.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
            >
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 to-black text-center px-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-6"
        >
          Ready to taste home?
        </motion.h2>

        <button
          onClick={() => router.push("/signup")}
          className="px-10 py-4 rounded-full bg-white text-black font-semibold hover:scale-110 transition duration-300"
        >
          Get Started 🚀
        </button>
      </section>

      {/* ================= PROFESSIONAL FOOTER ================= */}
      <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-300 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">GharSe</h3>
            <p className="text-gray-400">Homemade food delivered with love, speed & trust.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Refund Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-xl">
              <FaFacebookF className="hover:text-white cursor-pointer transition" />
              <FaTwitter className="hover:text-white cursor-pointer transition" />
              <FaInstagram className="hover:text-white cursor-pointer transition" />
              <FaLinkedinIn className="hover:text-white cursor-pointer transition" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8">
          <p className="text-center py-6 text-gray-500 text-sm">
            © {new Date().getFullYear()} GharSe. Made by Ankit Singh
          </p>
        </div>
      </footer>
    </div>
  );
}