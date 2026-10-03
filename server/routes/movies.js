import express from 'express';
import { moviesData } from '../data/moviesData.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// GET /api/movies/featured/hero
router.get('/featured/hero', (req, res) => {
  const hero = moviesData.find(m => m.featuredHero) || moviesData[0];
  res.json({ success: true, data: hero });
});

// GET /api/movies/sections/all - Structured rails for instant cinematic rendering
router.get('/sections/all', authenticateToken, (req, res) => {
  const user = req.user;
  const userHistoryMap = new Map();
  if (user && user.watchHistory) {
    user.watchHistory.forEach(h => userHistoryMap.set(h.movieId, h));
  }

  // Continue watching rail: enrich movie objects with user's progress
  const continueWatching = moviesData
    .filter(m => userHistoryMap.has(m.id) || m.progress)
    .map(m => {
      const history = userHistoryMap.get(m.id);
      return {
        ...m,
        progress: history ? history.progress : (m.progress || 50),
        currentEpisode: history ? history.currentEpisode : (m.currentEpisode || "Ep 1"),
        remainingTime: history ? history.remainingTime : (m.remainingTime || "28m remaining")
      };
    });

  const trendingNow = moviesData.filter(m => m.trending);
  const popularMovies = moviesData.filter(m => m.type === 'movie' && m.rating >= 8.5);
  const topSeries = moviesData.filter(m => m.type === 'series');
  const newReleases = moviesData.filter(m => m.year >= 2026);
  
  const sciFi = moviesData.filter(m => m.genres.some(g => g.toLowerCase().includes('sci-fi') || g.toLowerCase().includes('cyberpunk')));
  const action = moviesData.filter(m => m.genres.some(g => g.toLowerCase().includes('action') || g.toLowerCase().includes('thriller')));
  const horror = moviesData.filter(m => m.genres.some(g => g.toLowerCase().includes('horror') || g.toLowerCase().includes('mystery')));
  const comedy = moviesData.filter(m => m.genres.some(g => g.toLowerCase().includes('comedy') || g.toLowerCase().includes('satire')));
  const anime = moviesData.filter(m => m.genres.some(g => g.toLowerCase().includes('anime') || g.toLowerCase().includes('cyberpunk')));
  const drama = moviesData.filter(m => m.genres.some(g => g.toLowerCase().includes('drama') || g.toLowerCase().includes('history')));

  // Personalized "Because you watched" / "Recommended for you"
  const recommendedForYou = [...moviesData].sort(() => 0.5 - Math.random()).slice(0, 8);

  res.json({
    success: true,
    data: {
      continueWatching,
      trendingNow,
      popularMovies,
      topSeries,
      newReleases,
      recommendedForYou,
      sciFi,
      action,
      horror,
      comedy,
      anime,
      drama
    }
  });
});

// GET /api/movies - Query-based listing and search
router.get('/', (req, res) => {
  const { category, genre, type, search, limit } = req.query;
  let results = [...moviesData];

  if (type) {
    results = results.filter(m => m.type.toLowerCase() === type.toLowerCase());
  }

  if (genre) {
    results = results.filter(m => m.genres.some(g => g.toLowerCase() === genre.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.genres.some(g => g.toLowerCase().includes(q)) ||
      (m.director && m.director.toLowerCase().includes(q)) ||
      (m.cast && m.cast.some(c => c.toLowerCase().includes(q)))
    );
  }

  if (limit) {
    results = results.slice(0, parseInt(limit, 10));
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// GET /api/movies/:id - Single movie with "More Like This"
router.get('/:id', (req, res) => {
  const movie = moviesData.find(m => m.id === req.params.id);
  if (!movie) {
    return res.status(404).json({ success: false, message: 'Movie not found' });
  }

  // Find similar movies sharing genres
  const similar = moviesData
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 6);

  res.json({
    success: true,
    data: {
      ...movie,
      similar
    }
  });
});

export default router;
