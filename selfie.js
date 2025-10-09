// ===============================
// 🚀 DSR Backend (Render Ready, No Extra Modules)
// ===============================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===============================
// 🔧 Middleware
// ===============================
app.use(cors());
app.use(express.json({ limit: "10mb" }));

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
    maxPoolSize: 10,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

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

// ✅ Add indexes for better performance
selfieSchema.index({ username: 1 });
selfieSchema.index({ date: 1 });
selfieSchema.index({ timestamp: -1 });

const Selfie = mongoose.model("Selfie", selfieSchema);

// ===============================
// 📌 Routes
// ===============================

// Add new selfie
app.post("/api/selfie", async (req, res) => {
  try {
    const selfie = new Selfie(req.body);
    const saved = await selfie.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: "Error saving data" });
  }
});

// Get all selfies (optional month filter)
app.get("/api/selfies", async (req, res) => {
  try {
    const { username, month } = req.query;
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

    res.json(data);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Delete selfie by ID
app.delete("/api/selfie/:id", async (req, res) => {
  try {
    await Selfie.findByIdAndDelete(req.params.id);
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
