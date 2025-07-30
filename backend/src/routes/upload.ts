import express from 'express';
import multer from 'multer';
import path from 'path';
import FileMeta from '../models/FileMeta';

const router = express.Router();
const uploadsDir = path.join(process.cwd(), "backend/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads folder created:", uploadsDir);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});


const allowedTypes = ['.pdf', '.docx', '.jpg', '.jpeg', '.png'];
const fileFilter = (req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOCX, JPG, and PNG files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post('/', upload.any(), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const file = req.files[0];
    const { filename, path: filePath } = file;
    const fileMeta = await FileMeta.create({
      filename,
      path: filePath,
      status: 'pending',
      uploadedAt: new Date(),
      scannedAt: null,
      result: null,
    });
    
    
    const { scanQueue } = await import('../queue');
    scanQueue.enqueue({
      fileId: fileMeta._id?.toString() || '',
      filePath,
      filename
    });
    res.status(201).json({ message: 'File uploaded', file: fileMeta });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 
