import { Router } from 'express';
import User from '../models/User.js';
import { requireAuth, requireManager } from '../middleware/auth.js';

const router = Router();

// Both routes are manager-only: this is the "employee management" page.
router.get('/', requireAuth, requireManager, async (req, res) => {
  const employees = await User.find().sort({ createdAt: -1 });
  res.json({
    employees: employees.map((u) => ({
      id: u._id,
      fullName: u.fullName,
      username: u.username,
      role: u.role,
      createdAt: u.createdAt,
    })),
  });
});

router.delete('/:id', requireAuth, requireManager, async (req, res) => {
  const { id } = req.params;

  if (id === req.userId) {
    return res.status(400).json({ message: 'לא ניתן להסיר את המשתמש המחובר כרגע' });
  }

  const target = await User.findById(id);
  if (!target) {
    return res.status(404).json({ message: 'העובד לא נמצא' });
  }

  if (target.role === 'manager') {
    const managerCount = await User.countDocuments({ role: 'manager' });
    if (managerCount <= 1) {
      return res.status(400).json({ message: 'לא ניתן להסיר את המנהל האחרון במערכת' });
    }
  }

  await User.findByIdAndDelete(id);
  res.json({ success: true });
});

export default router;
