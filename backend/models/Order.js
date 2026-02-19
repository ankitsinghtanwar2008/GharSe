import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: String,
  chefId: String,
  deliveryId: String,
  items: Array,
  totalAmount: Number,
  status: {
    type: String,
    enum: [
      "Pending",
      "Accepted",
      "Preparing",
      "Ready",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);
