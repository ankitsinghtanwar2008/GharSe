const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const cookRoutes = require("./routes/cookRoutes")
const Cook = require("./models/Cook")

const multer = require("multer")

const storage = multer.diskStorage({
 destination:function(req,file,cb){
  cb(null,"uploads")
 },
 filename:function(req,file,cb){
  cb(null,Date.now()+path.extname(file.originalname))
 }
})

const upload = multer({storage})

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname,"uploads")))

app.get("/api/cooks/:id", async (req,res)=>{

const cook = await Cook.findById(req.params.id)

res.json(cook)

})

app.delete("/api/cooks/delete-dish/:cookId/:dishId", async (req,res)=>{

const {cookId,dishId} = req.params

await Cook.findByIdAndUpdate(cookId,{
 $pull:{dishes:{_id:dishId}}
})

res.json({message:"Dish deleted"})

})

app.put("/api/cooks/update-dish/:cookId/:dishId", upload.single("image"), async (req,res)=>{

const {cookId,dishId} = req.params

const cook = await Cook.findById(cookId)

const dish = cook.dishes.id(dishId)

dish.dishName = req.body.dishName
dish.description = req.body.description
dish.price = req.body.price
dish.location = req.body.location

if(req.file){
 dish.image = req.file.filename
}

await cook.save()

res.json({message:"Dish updated"})

})

mongoose.connect(process.env.MONGO_URI)

app.use("/api/cooks", cookRoutes)

app.listen(5000,()=>{
 console.log("Server running on port 5000")
})