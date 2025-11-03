// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ====== CONFIG ======
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ====== DATABASE CONNECTION ======
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://jayantsoni4382:js%40workdb@cluster0.jjjc03f.mongodb.net/attendanceDB?retryWrites=true&w=majority/notifications"; // ⚠️ Replace with your Atlas URI

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ====== SCHEMA & MODEL ======
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  file: {
    name: String,
    url: String,
  },
  date: { type: String, default: () => new Date().toLocaleString() },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model("Notification", notificationSchema);

// ====== ROUTES ======

// Default route
app.get("/", (req, res) => {
  res.send("📢 Notification API is running...");
});

// Get all notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ _id: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new notification
app.post("/api/notifications", async (req, res) => {
  try {
    const { title, message, file } = req.body;
    if (!title || !message)
      return res.status(400).json({ error: "Title and message are required" });

    const newNotif = new Notification({ title, message, file });
    await newNotif.save();

    res.status(201).json(newNotif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete one notification
app.delete("/api/notifications/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
