"use strict";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const cookRoutes = require("./routes/cookRoutes");
const authRoutes = require("./routes/auth");
const Cook = require("./models/Cook");

const multer = require("multer");

// ------------------- Multer Setup -------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ------------------- Express Setup -------------------
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------- MongoDB Connection -------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// ------------------- Auth Routes -------------------
app.use("/api/auth", authRoutes);

// ------------------- Cook Routes -------------------

// Get single cook by ID
app.get("/api/cooks/:id", async (req, res) => {
  try {
    const cook = await Cook.findById(req.params.id);
    if (!cook) return res.status(404).json({ message: "Cook not found" });
    res.json(cook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a dish of a cook
app.delete("/api/cooks/delete-dish/:cookId/:dishId", async (req, res) => {
  try {
    const { cookId, dishId } = req.params;
    await Cook.findByIdAndUpdate(cookId, {
      $pull: { dishes: { _id: dishId } },
    });
    res.json({ message: "Dish deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a dish of a cook
app.put(
  "/api/cooks/update-dish/:cookId/:dishId",
  upload.single("image"),
  async (req, res) => {
    try {
      const { cookId, dishId } = req.params;
      const cook = await Cook.findById(cookId);
      if (!cook) return res.status(404).json({ message: "Cook not found" });

      const dish = cook.dishes.id(dishId);
      if (!dish) return res.status(404).json({ message: "Dish not found" });

      dish.dishName = req.body.dishName;
      dish.description = req.body.description;
      dish.price = req.body.price;
      dish.location = req.body.location;

      if (req.file) dish.image = req.file.filename;

      await cook.save();
      res.json({ message: "Dish updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Cook CRUD other routes
app.use("/api/cooks", cookRoutes);

// ------------------- Test Route -------------------
app.get("/", (req, res) => res.send("Server is running"));