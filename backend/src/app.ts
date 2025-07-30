import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import uploadRouter from "./routes/upload";
import filesRouter from "./routes/files";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();

// ✅ CORS config
const allowedOrigins = [
  "http://localhost:3000",
  "https://file-guard.vercel.app",
  "https://fileguard-2.onrender.com",
  "https://file-guard-3.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ✅ Handle preflight requests
app.options("/*", cors());

// ✅ Global fallback headers (sometimes required on Render)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins.join(","));
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());
app.use("/upload", uploadRouter);
app.use("/files", filesRouter);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
