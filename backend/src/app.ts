import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import uploadRouter from './routes/upload';
import filesRouter from './routes/files';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/upload', uploadRouter);
app.use('/files', filesRouter);

const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}); 