import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import myListRoutes from './routes/myList.js';
import watchHistoryRoutes from './routes/watchHistory.js';
import profileRoutes from './routes/profiles.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Optional MongoDB Atlas connection with automatic fallback
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log(' Connected to MongoDB Atlas'))
    .catch((err) => console.warn(' MongoDB Atlas connection skipped:', err.message));
} else {
  console.log(' Using High-Performance FLIXORA In-Memory Data Store with seeded database');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/my-list', myListRoutes);
app.use('/api/watch-history', watchHistoryRoutes);
app.use('/api/profiles', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'FLIXORA Cinematic Streaming Backend',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(` FLIXORA Server running smoothly at http://localhost:${PORT}`);
});
