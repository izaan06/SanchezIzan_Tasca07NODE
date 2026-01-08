require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Servir imatges locals des de /uploads
app.use("/uploads", express.static("uploads"));

// Rutes públiques
app.use("/api/auth", authRoutes);

// Rutes protegides
app.use("/api/tasks", taskRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

// Conexió a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connectat correctament"))
  .catch(err => console.error("Error connectant a MongoDB:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor funcionant a http://localhost:${PORT}`));
