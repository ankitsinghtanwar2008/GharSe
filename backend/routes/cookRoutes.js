const express = require("express");
const router = express.Router();
const Cook = require("../models/cook");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ================= MULTER SETUP ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ================= GET ALL COOKS ================= */

router.get("/", async (req, res) => {
  try {
    const cooks = await Cook.find();
    res.json(cooks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching cooks" });
  }
});

/* ================= ADD COOK ================= */

router.post("/", upload.single("image"), async (req, res) => {
  try {

    const { name } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({ message: "Name and image required" });
    }

    const newCook = new Cook({
      name: name,
      image: req.file.filename,
      dishes: []
    });

    await newCook.save();

    res.status(201).json({
      message: "Cook added successfully",
      cook: newCook
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding cook" });
  }
});

/* ================= DELETE COOK ================= */

router.delete("/:id", async (req, res) => {

  try {

    const cook = await Cook.findById(req.params.id);

    if (!cook) {
      return res.status(404).json({ message: "Cook not found" });
    }

    /* delete cook image from uploads */

    if (cook.image) {
      const imgPath = path.join(__dirname, "..", "uploads", cook.image);

      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    /* delete dishes images */

    if (cook.dishes && cook.dishes.length > 0) {

      cook.dishes.forEach((dish) => {

        if (dish.image) {

          const dishImg = path.join(__dirname, "..", "uploads", dish.image);

          if (fs.existsSync(dishImg)) {
            fs.unlinkSync(dishImg);
          }

        }

      });

    }

    await Cook.findByIdAndDelete(req.params.id);

    res.json({ message: "Cook deleted successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

});

/* ================= ADD DISH ================= */

router.post("/add-dish/:cookId", upload.single("image"), async (req, res) => {

  try {

    const { cookId } = req.params;
    const { dishName, description, price, location } = req.body;

    const cook = await Cook.findById(cookId);

    if (!cook) {
      return res.status(404).json({ message: "Chef not found" });
    }

    cook.dishes.push({
      dishName: dishName,
      price: price,
      description: description,
      location: location,
      image: req.file ? req.file.filename : ""
    });

    await cook.save();

    res.json({ message: "Dish Added Successfully" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error adding dish" });

  }

});

module.exports = router;