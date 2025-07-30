import path from "path";
import fs from "fs";
import express from "express";
import multer from "multer";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary";
import FileMeta from "../models/FileMeta";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";


const router = express.Router();
const uploadsDir = path.join(process.cwd(), "backend/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads folder created:", uploadsDir);
}

// ✅ Store file in memory instead of local disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedExts = [".pdf", ".docx", ".jpg", ".jpeg", ".png"];
    const ext = file.originalname
      .toLowerCase()
      .slice(file.originalname.lastIndexOf("."));
    if (allowedExts.includes(ext)) cb(null, true);
    else cb(new Error("Only PDF, DOCX, JPG, and PNG files are allowed"));
  },
});

// ✅ Helper function for Cloudinary upload
function uploadToCloudinary(fileBuffer: Buffer, filename: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "uploads", resource_type: "auto" },
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error) reject(error);
        else if (result) resolve(result);
        else reject(new Error("Cloudinary upload failed"));
      }
    );

    // ✅ Pipe buffer to Cloudinary
    Readable.from(fileBuffer).pipe(uploadStream);
  });
}

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    // ✅ Save metadata to MongoDB
    const fileMeta = await FileMeta.create({
      filename: req.file.originalname,
      path: cloudinaryResult.secure_url,
      status: "pending",
      uploadedAt: new Date(),
      scannedAt: null,
      result: null,
    });

    // ✅ Add job to queue
    const { scanQueue } = await import("../queue");
    scanQueue.enqueue({
      fileId: fileMeta._id.toString(),
      fileUrl: cloudinaryResult.secure_url,
      filename: req.file.originalname,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: fileMeta,
    });
  } catch (err: any) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
});

export default router;
