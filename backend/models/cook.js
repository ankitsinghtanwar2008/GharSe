const mongoose = require('mongoose');

const CookSchema = new mongoose.Schema({
  name: String,
  image: String
});

module.exports = mongoose.model('Cook', CookSchema);
