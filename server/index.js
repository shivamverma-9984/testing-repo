const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");

const dns= require("dns")

dns.setServers(['1.1.1.1','0.0.0.0'])

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/items", itemRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("MERN CRUD API is running...");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
