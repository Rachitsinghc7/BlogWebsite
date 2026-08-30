require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "*"
    })
);
app.use(express.json()); // parse JSON request bodies

// Routes
app.use("/api/posts", postRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ message: "BlogSphere API is running" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Generic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
