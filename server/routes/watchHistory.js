import express from 'express';
import { moviesData } from '../data/moviesData.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// GET /api/watch-history
router.get('/', authenticateToken, (req, res) => {
  const user = req.user;
  const history = user.watchHistory || [];

  const historyWithDetails = history.map(item => {
    const movie = moviesData.find(m => m.id === item.movieId);
    return {
      ...item,
      movie
    };
  }).filter(item => item.movie);

  res.json({
    success: true,
    data: historyWithDetails
  });
});

// POST /api/watch-history (body: { movieId, progress, currentEpisode, remainingTime })
router.post('/', authenticateToken, (req, res) => {
  const user = req.user;
  const { movieId, progress, currentEpisode, remainingTime } = req.body;

  if (!movieId) {
    return res.status(400).json({ success: false, message: 'Movie ID required' });
  }

  const existingIndex = user.watchHistory.findIndex(h => h.movieId === movieId);
  const entry = {
    movieId,
    progress: progress || 0,
    currentEpisode: currentEpisode || "Feature Film",
    remainingTime: remainingTime || "15m remaining",
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    user.watchHistory[existingIndex] = entry;
  } else {
    user.watchHistory.unshift(entry);
  }

  res.json({
    success: true,
    message: 'Watch progress saved',
    watchHistory: user.watchHistory
  });
});

export default router;
