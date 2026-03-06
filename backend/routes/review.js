const express = require("express");
const router = express.Router();
const Cook = require("../models/cook");

router.post("/:cookId/:dishId", async (req,res)=>{

try{

const {cookId,dishId} = req.params;
const {rating,comment,userId} = req.body;

const cook = await Cook.findById(cookId);

if(!cook) return res.status(404).json({message:"Cook not found"});

const dish = cook.dishes.id(dishId);

if(!dish) return res.status(404).json({message:"Dish not found"});

dish.reviews.push({
userId,
rating,
comment
});

const total = dish.reviews.reduce((sum,r)=>sum+r.rating,0);

dish.averageRating = total / dish.reviews.length;

await cook.save();

res.json({
success:true,
reviews:dish.reviews,
averageRating:dish.averageRating
});

}catch(err){
res.status(500).json({error:err.message});
}

});

module.exports = router;