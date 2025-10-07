// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ===============================
// MongoDB Atlas Connection
// ===============================
// Replace <username>, <password>, and <dbname> with your Atlas values
const MONGODB_URI =
  process.env.MONGODB_URI ||
  // "mongodb+srv://service:services1234@cluster0.wxa147v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  "mongodb+srv://jayantsoni4382:js%40workdb@cluster0.jjjc03f.mongodb.net/attendanceDB?retryWrites=true&w=majority";

console.log("🔗 Connecting to:", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===============================
// Schema
// ===============================
const selfieSchema = new mongoose.Schema({
  username: String,
  // image: String,
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

const Selfie = mongoose.model("Selfie", selfieSchema);
