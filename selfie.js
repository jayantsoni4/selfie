// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const NodeCache = require("node-cache");
require("dotenv").config(); // load .env locally

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(compression());

// Cache
const cache = new NodeCache({ stdTTL: 300 });

// MongoDB
const MONGODB_URI = process.env.MONGODB_URI; // set in Render dashboard
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not defined in environment");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize: 10 })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Schema
const selfieSchema = new mongoose.Schema({
  username: String,
  name: String,
  address: String,
  number: String,
  From: String,
  To: String,
  Location: String,
  MobileNo: String,
  epnbd: String,
  inv: String,
  bat: String,
  pan: String,
  Inverter: String,
  Battery: String,
  Panel: String,
  Mode: String,
  km: String,
  Amount: String,
  remarks: String,
  date: String,
  location: { latitude: Number, longitude: Number },
  timestamp: { type: Date, default: Date.now },
});

// Indexes
selfieSchema.index({ username: 1 });
selfieSchema.index({ date: 1 });
selfieSchema.index({ timestamp: -1 });

const Selfie = mongoose.model("Selfie", selfieSchema);

// Routes
app.post("/api/selfie", async (req, res) => {
  try {
    const selfie = new Selfie(req.body);
    const saved = await selfie.save();
    cache.flushAll();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: "Error saving data" });
  }
});

app.get("/api/selfies", async (req, res) => {
  try {
    const { username, month } = req.query;
    const cacheKey = `selfies_${username || "all"}_${month || "all"}`;

    if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

    const query = {};
    if (username) query.username = username;
    if (month) {
      const start = new Date(`${month}-01T00:00:00Z`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      query.timestamp = { $gte: start, $lt: end };
    }

    const data = await Selfie.find(query)
      .sort({ timestamp: -1 })
      .lean();

    cache.set(cacheKey, data);
    res.json(data);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.delete("/api/selfie/:id", async (req, res) => {
  try {
    await Selfie.findByIdAndDelete(req.params.id);
    cache.flushAll();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Error deleting entry" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
