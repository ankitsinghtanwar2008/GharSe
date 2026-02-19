const express = require("express");
const router = express.Router();
const Cook = require("../models/cook");
const upload = require("../middlewares/upload");


router.get("/", async (req, res) => {
  try {
    const cooks = await Cook.find();
    res.json(cooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newCook = new Cook({
      name: req.body.name,
      image: req.file.filename,
    });

    await newCook.save();
    res.status(201).json(newCook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Cook.findByIdAndDelete(req.params.id);
    res.json({ message: "Cook deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const cook = await Cook.findById(req.params.id);

    if (!cook) {
      return res.status(404).json({ message: "Cook not found" });
    }

    cook.name = req.body.name;

    if (req.file) {
      cook.image = req.file.filename; // new image if uploaded
    }

    await cook.save();

    res.json({ message: "Cook updated successfully", cook });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
