const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
  type: String,
  required: true,
  select: false
  },

  role: {
    type: String,
    enum: ['customer', 'chef', 'delivery', 'admin'],
    default: 'customer',
  },
  address: String,
  location: {
    lat: Number,
    lng: Number,
  },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

