import express from 'express';
import FileMeta from '../models/FileMeta';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const files = await FileMeta.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 