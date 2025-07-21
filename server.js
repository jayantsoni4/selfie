// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Replace this with your MongoDB Atlas URI
// const MONGO_URI = 'your_mongodb_atlas_uri_here';
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// MongoDB Schema
const userSchema = new mongoose.Schema({
  name: String,
  designation: String,
  location: String,
  remarks: String,
  sales: Number,
  collection: Number,
  salary: Object, // e.g., { "2025-07": 5000 }
  attendance: { type: Map, of: String }, // e.g., { "2025-07-19": "present" }
});

const User = mongoose.model('User', userSchema);

// Routes

// Get all users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Add user
app.post('/api/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error('MongoDB connection error:', err));
