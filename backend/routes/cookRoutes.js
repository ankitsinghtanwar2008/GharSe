const express = require("express")
const router = express.Router()
const Cook = require("../models/Cook")
const multer = require("multer")

const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, "uploads")
},
filename: function (req, file, cb) {
cb(null, Date.now() + ".png")
}
})

const upload = multer({ storage })

router.get("/", async (req, res) => {
const cooks = await Cook.find()
res.json(cooks)
})

router.post("/add-dish/:cookId", upload.single("image"), async (req, res) => {

const { cookId } = req.params
const { name, price } = req.body

const cook = await Cook.findById(cookId)

cook.dishes.push({
name,
price,
image: req.file.filename
})

await cook.save()

res.json({ message: "Dish Added Successfully" })

})

module.exports = router