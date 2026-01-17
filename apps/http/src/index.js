import express from "express";
import v1Router from "./routes/v1/index.js";

const app = express();

app.use(express.json());

import db from "@repo/db"

// Root route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// API v1
app.use("/api/v1", v1Router);

// 🔥 THIS IS THE MOST IMPORTANT LINE
export default app;
