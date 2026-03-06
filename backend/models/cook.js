const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userId: String,
  rating: Number,
  comment: String
});

const DishSchema = new mongoose.Schema({

  dishName:{
    type:String,
    required:true
  },

  price:{
    type:Number,
    required:true
  },

  description:String,
  image:String,

  reviews:{
    type:[ReviewSchema],
    default:[]
  },

  averageRating:{
    type:Number,
    default:0
  }

});

const CookSchema = new mongoose.Schema({
  name:String,
  speciality:String,
  dishes:[DishSchema]
});

module.exports = mongoose.models.Cook || mongoose.model("Cook",CookSchema);