export interface FileMeta {
  _id: string;
  filename: string;
  path: string;
  status: 'pending' | 'scanned';
  uploadedAt: string;
  scannedAt: string | null;
  result: 'clean' | 'infected' | 'error' | null;
  __v: number;
}

export interface UploadResponse {
  message: string;
  file: FileMeta;
}

export interface ApiError {
  error: string;
} 