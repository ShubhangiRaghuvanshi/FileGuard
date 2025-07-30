import mongoose, { Document, Schema } from 'mongoose';

export interface IFileMeta extends Document {
  filename: string;
  path: string;
  status: 'pending' | 'scanned';
  uploadedAt: Date;
  scannedAt: Date | null;
  result: 'clean' | 'infected' | null;
}

const FileMetaSchema = new Schema<IFileMeta>({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  status: { type: String, enum: ['pending', 'scanned'], default: 'pending' },
  uploadedAt: { type: Date, default: Date.now },
  scannedAt: { type: Date, default: null },
  result: { type: String, enum: ['clean', 'infected', null], default: null },
});

export default mongoose.model<IFileMeta>('FileMeta', FileMetaSchema); 