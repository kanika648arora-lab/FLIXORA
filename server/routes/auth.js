import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
export const JWT_SECRET = process.env.JWT_SECRET || 'flixora_ultra_secret_jwt_key_2026';

// Persistent in-memory user registry with initial demo account
export const usersDb = [
  {
    id: "usr-01",
    name: "Vaibhav",
    email: "vaibhav@flixora.com",
    passwordHash: bcrypt.hashSync("password123", 10),
    activeProfile: "prof-1",
    myList: ["flx-01", "flx-02", "flx-05", "flx-08", "flx-10"],
    watchHistory: [
      { movieId: "flx-02", progress: 72, currentEpisode: "S2:E4 'The Butterfly Anomaly'", remainingTime: "24m remaining" },
      { movieId: "flx-03", progress: 45, currentEpisode: "Feature Film", remainingTime: "1h 12m remaining" },
      { movieId: "flx-05", progress: 88, currentEpisode: "S1:E8 'The Singularity Gate'", remainingTime: "12m remaining" }
    ],
    createdAt: new Date().toISOString()
  }
];

// Helper: generate token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Middleware: authenticate JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Fall back to default demo user if unauthenticated for seamless demo UX
    req.user = usersDb[0];
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = usersDb[0];
      return next();
    }
    const user = usersDb.find(u => u.id === decoded.id) || usersDb[0];
    req.user = user;
    next();
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const existingUser = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      activeProfile: "prof-1",
      myList: ["flx-01", "flx-08"],
      watchHistory: [
        { movieId: "flx-01", progress: 35, currentEpisode: "Feature Film", remainingTime: "1h 32m remaining" }
      ],
      createdAt: new Date().toISOString()
    };

    usersDb.push(newUser);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        activeProfile: newUser.activeProfile
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        activeProfile: user.activeProfile
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      activeProfile: user.activeProfile,
      myListCount: user.myList.length
    }
  });
});

export default router;
