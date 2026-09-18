import { Router } from 'express';
import Inquiry from '../models/Inquiry.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function toPublicInquiry(i) {
  return {
    id: i._id,
    fullName: i.fullName,
    phone: i.phone,
    email: i.email,
    reason: i.reason,
    message: i.message,
    status: i.status,
    createdAt: i.createdAt,
  };
}

// Public: submitted from the "Contact Us" page.
router.post('/', async (req, res) => {
  try {
    const { fullName, phone, email, reason, message } = req.body ?? {};

    if (!fullName?.trim()) {
      return res.status(400).json({ message: 'יש למלא שם מלא' });
    }
    if (!phone?.trim()) {
      return res.status(400).json({ message: 'יש למלא מספר טלפון' });
    }

    const inquiry = await Inquiry.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: (email ?? '').trim(),
      reason: (reason ?? '').trim(),
      message: (message ?? '').trim(),
    });

    res.status(201).json({ inquiry: toPublicInquiry(inquiry) });
  } catch (err) {
    console.error('create inquiry error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

// Admin: any logged-in employee/manager may view and handle inquiries.
router.get('/', requireAuth, async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json({ inquiries: inquiries.map(toPublicInquiry) });
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body ?? {};
    if (!['new', 'handled'].includes(status)) {
      return res.status(400).json({ message: 'סטטוס לא תקין' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!inquiry) return res.status(404).json({ message: 'הפנייה לא נמצאה' });

    res.json({ inquiry: toPublicInquiry(inquiry) });
  } catch (err) {
    console.error('update inquiry error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) return res.status(404).json({ message: 'הפנייה לא נמצאה' });
  res.json({ success: true });
});

export default router;
