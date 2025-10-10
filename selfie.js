const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const NodeCache = require("node-cache");

const app = express();


app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(compression()); // gzip compression for faster network transfer

// Simple in-memory cache (TTL = 5 minutes)
const cache = new NodeCache({ stdTTL: 300 });

// ===============================
// 🔗 MongoDB Connection
// ===============================
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://jayantsoni4382:js%40workdb@cluster0.jjjc03f.mongodb.net/attendanceDB?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // increase pool for concurrent requests
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===============================
// 📦 Schema & Model
// ===============================
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
  location: {
    latitude: Number,
    longitude: Number,
  },
  timestamp: { type: Date, default: Date.now },
});

// ✅ Add important indexes for speed
selfieSchema.index({ username: 1 });
selfieSchema.index({ date: 1 });
selfieSchema.index({ timestamp: -1 });

const Selfie = mongoose.model("Selfie", selfieSchema);

// ===============================
// 🧠 API Routes
// ===============================

// ✅ Add new DSR Entry
app.post("/api/selfie", async (req, res) => {
  try {
    const selfie = new Selfie(req.body);
    const saved = await selfie.save();

    // clear cache for freshness
    cache.flushAll();

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: "Error saving data" });
  }
});

// ✅ Get All Selfies (Optionally filtered by month)
app.get("/api/selfies", async (req, res) => {
  try {
    const { username, month } = req.query;
    const cacheKey = `selfies_${username || "all"}_${month || "all"}`;

    // ⚡ Serve from cache if available
    if (cache.has(cacheKey)) {
      console.log("⚡ Cache Hit");
      return res.json(cache.get(cacheKey));
    }

    console.log("🐢 Cache Miss - Fetching from DB");

    const query = {};
    if (username) query.username = username;

    // 🔹 Filter by month (e.g. 2025-10)
    if (month) {
      const start = new Date(`${month}-01T00:00:00Z`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      query.timestamp = { $gte: start, $lt: end };
    }

    // ⚡ Fetch lean (plain JS objects) + projection (only needed fields)
    const data = await Selfie.find(query)
      .select(
        "username name address From To Location MobileNo epnbd inv bat pan Inverter Battery Panel Mode km Amount remarks date location timestamp"
      )
      .sort({ timestamp: -1 })
      .lean();

    // 🧠 Cache result
    cache.set(cacheKey, data);

    res.json(data);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// ✅ Delete Entry by ID
app.delete("/api/selfie/:id", async (req, res) => {
  try {
    await Selfie.findByIdAndDelete(req.params.id);

    // clear cache
    cache.flushAll();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Error deleting entry" });
  }
});

// ===============================
// 🌍 Start Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
