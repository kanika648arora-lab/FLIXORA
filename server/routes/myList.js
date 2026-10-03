import express from 'express';
import { moviesData } from '../data/moviesData.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// GET /api/my-list
router.get('/', authenticateToken, (req, res) => {
  const user = req.user;
  const listMovieIds = user.myList || [];
  const listMovies = moviesData.filter(m => listMovieIds.includes(m.id));

  res.json({
    success: true,
    count: listMovies.length,
    data: listMovies
  });
});

// POST /api/my-list (body: { movieId })
router.post('/', authenticateToken, (req, res) => {
  const user = req.user;
  const { movieId } = req.body;

  if (!movieId) {
    return res.status(400).json({ success: false, message: 'Movie ID required' });
  }

  if (!user.myList.includes(movieId)) {
    user.myList.push(movieId);
  }

  const movie = moviesData.find(m => m.id === movieId);
  res.json({
    success: true,
    message: 'Added to My List',
    myList: user.myList,
    movie
  });
});

// DELETE /api/my-list/:movieId
router.delete('/:movieId', authenticateToken, (req, res) => {
  const user = req.user;
  const { movieId } = req.params;

  user.myList = user.myList.filter(id => id !== movieId);

  res.json({
    success: true,
    message: 'Removed from My List',
    myList: user.myList
  });
});

export default router;
