import Navbar from "./components/Navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Require the global stylesheet to avoid TypeScript side-effect import resolution issues
// in some Next.js setups where CSS module declarations are not available.
require("./globals.css");
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import Script from "next/script";
import Chatbot3D from "../components/Chatbot3D";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GharSe",
  description: "Homemade food delivery platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f5f7fa",
        }}
      >
        {/* Razorpay Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
            },
          }}
        />

        <Chatbot3D />
      </body>
    </html>
  );
}