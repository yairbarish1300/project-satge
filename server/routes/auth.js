import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

function toPublicUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  };
}

// כל מי שנרשם מקבל גישה מלאה למערכת. אם isManager===true הוא מקבל גם
// הרשאת ניהול עובדים (role: 'manager').
router.post('/register', async (req, res) => {
  try {
    const { fullName, username, password, isManager } = req.body ?? {};

    if (!fullName?.trim() || !username?.trim() || !password) {
      return res.status(400).json({ message: 'יש למלא שם מלא, שם משתמש וסיסמה' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'הסיסמה חייבת להכיל לפחות 6 תווים' });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const existing = await User.findOne({ username: normalizedUsername });
    if (existing) {
      return res.status(409).json({ message: 'שם המשתמש הזה כבר תפוס' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      fullName: fullName.trim(),
      username: normalizedUsername,
      passwordHash,
      role: isManager ? 'manager' : 'employee',
    });

    const token = signToken(user);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body ?? {};

    if (!username?.trim() || !password) {
      return res.status(400).json({ message: 'יש למלא שם משתמש וסיסמה' });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'שם משתמש או סיסמה שגויים' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'שם משתמש או סיסמה שגויים' });
    }

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

// Used on app load to restore a session from a saved token.
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'משתמש לא נמצא' });
  res.json({ user: toPublicUser(user) });
});

export default router;
