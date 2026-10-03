import express from 'express';
import { userProfiles } from '../data/moviesData.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// GET /api/profiles
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: userProfiles
  });
});

// POST /api/profiles/select (body: { profileId })
router.post('/select', authenticateToken, (req, res) => {
  const user = req.user;
  const { profileId } = req.body;

  const profile = userProfiles.find(p => p.id === profileId);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  user.activeProfile = profileId;
  res.json({
    success: true,
    message: `Switched to profile: ${profile.name}`,
    activeProfile: profile
  });
});

export default router;
