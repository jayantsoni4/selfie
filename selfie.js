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
  image: String,
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

// ===============================
// Routes
// ===============================
app.post("/api/selfie", async (req, res) => {
  try {
    const selfie = new Selfie(req.body);

    if (!selfie.username || !selfie.image || !selfie.name || !selfie.address) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    await selfie.save();
    res.json(selfie);
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ error: "Failed to save submission." });
  }
});

app.get("/api/selfies", async (req, res) => {
  try {
    const { username } = req.query;
    const query = username ? { username } : {};
    const data = await Selfie.find(query).sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.put("/api/selfie/:id", async (req, res) => {
  try {
    const updated = await Selfie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Selfie not found." });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ error: "Failed to update selfie." });
  }
});

app.delete("/api/selfie/:id", async (req, res) => {
  try {
    const deleted = await Selfie.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Selfie not found." });
    }
    res.json({ message: "Selfie deleted." });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ error: "Failed to delete selfie." });
  }
});

// ===============================
// Start Server (Railway Port)
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);


// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "10mb" }));

// // ===============================
// // MongoDB connection (Railway ENV)
// // ===============================
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/selfieDB";

// mongoose
//   .connect(MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // ===============================
// // Schema
// // ===============================
// const selfieSchema = new mongoose.Schema({
//   username: String,
//   image: String,
//   name: String,
//   address: String,
//   number: String,
//   From: String,
//   To: String,
//   Location: String,
//   MobileNo: String,
//   epnbd: String,
//   inv: String,
//   bat: String,
//   pan: String,
//   Inverter: String,
//   Battery: String,
//   Panel: String,
//   Mode: String,
//   km: String,
//   Amount: String,
//   remarks: String,
//   date: String,
//   location: {
//     latitude: Number,
//     longitude: Number,
//   },
//   timestamp: { type: Date, default: Date.now },
// });

// const Selfie = mongoose.model("Selfie", selfieSchema);

// // ===============================
// // Routes
// // ===============================
// app.post("/api/selfie", async (req, res) => {
//   try {
//     const selfie = new Selfie(req.body);

//     if (!selfie.username || !selfie.image || !selfie.name || !selfie.address) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     await selfie.save();
//     res.json(selfie);
//   } catch (err) {
//     console.error("POST error:", err);
//     res.status(500).json({ error: "Failed to save submission." });
//   }
// });

// app.get("/api/selfies", async (req, res) => {
//   try {
//     const { username } = req.query;
//     const query = username ? { username } : {};
//     const data = await Selfie.find(query).sort({ timestamp: -1 });
//     res.json(data);
//   } catch (err) {
//     console.error("GET error:", err);
//     res.status(500).json({ error: "Failed to fetch data." });
//   }
// });

// app.put("/api/selfie/:id", async (req, res) => {
//   try {
//     const updated = await Selfie.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     if (!updated) {
//       return res.status(404).json({ error: "Selfie not found." });
//     }

//     res.json(updated);
//   } catch (err) {
//     console.error("PUT error:", err);
//     res.status(500).json({ error: "Failed to update selfie." });
//   }
// });

// app.delete("/api/selfie/:id", async (req, res) => {
//   try {
//     const deleted = await Selfie.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ error: "Selfie not found." });
//     }
//     res.json({ message: "Selfie deleted." });
//   } catch (err) {
//     console.error("DELETE error:", err);
//     res.status(500).json({ error: "Failed to delete selfie." });
//   }
// });

// // ===============================
// // Start Server (Railway Port)
// // ===============================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );
