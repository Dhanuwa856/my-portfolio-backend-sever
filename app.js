import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import projectRouter from "./routes/projectRouter.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Express app
const app = express();
const PORT = process.env.PORT || 5000;

// __dirname workaround (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (e.g., profile images or uploads)
// app.use("/assets", express.static(path.join(__dirname, "public/uploads")));

// API routes
app.use("/api/user", userRouter);
app.use("/api/projects", projectRouter);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("Portfolio Backend API is running...");
});

// Start server
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
