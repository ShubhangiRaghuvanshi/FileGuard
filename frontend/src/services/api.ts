import axios from 'axios';
import { FileMeta, UploadResponse } from '../types';

const API_BASE_URL = 'https://fileguard-2.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getFiles = async (): Promise<FileMeta[]> => {
  const response = await api.get<FileMeta[]>('/files');
  return response.data;
};

export default api; 