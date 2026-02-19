const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookRoutes = require('./routes/cookRoutes');
const authRoutes = require("./routes/auth");


require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/cooks', cookRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/auth", authRoutes);




mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch((err) => console.log(err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String
});



app.get('/', (req, res) => {
  res.send('GharSe Backend & DB Running 🚀');
});

app.post('/api/users/add', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "User Added", data: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
