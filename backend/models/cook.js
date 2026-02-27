const mongoose = require("mongoose")

const dishSchema = new mongoose.Schema({
name: String,
price: String,
image: String
})

const cookSchema = new mongoose.Schema({
name: String,
image: String,
dishes: [dishSchema]
})

module.exports = mongoose.models.Cook || mongoose.model("Cook", cookSchema)