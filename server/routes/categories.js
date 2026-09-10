import { Router } from 'express';
import Category from '../models/Category.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function toPublicCategory(c) {
  return {
    id: c._id,
    name: c.name,
    leaves: c.leaves.map((leaf) => ({ id: leaf._id, name: leaf.name })),
  };
}

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

// Public: the Shop page's category sidebar filters by this without logging in.
router.get('/', async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 });
  res.json({ categories: categories.map(toPublicCategory) });
});

// Everything below manages the category tree — any logged-in employee/manager.
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name } = req.body ?? {};
    if (!name?.trim()) {
      return res.status(400).json({ message: 'יש להזין שם ענף' });
    }

    const existing = await Category.find().select('name');
    if (existing.some((c) => sameName(c.name, name))) {
      return res.status(409).json({ message: 'ענף בשם הזה כבר קיים' });
    }

    const category = await Category.create({ name: name.trim(), leaves: [] });
    res.status(201).json({ category: toPublicCategory(category) });
  } catch (err) {
    console.error('create category error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { name } = req.body ?? {};
    if (!name?.trim()) {
      return res.status(400).json({ message: 'יש להזין שם ענף' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'הענף לא נמצא' });

    const others = await Category.find({ _id: { $ne: category._id } }).select('name');
    if (others.some((c) => sameName(c.name, name))) {
      return res.status(409).json({ message: 'ענף בשם הזה כבר קיים' });
    }

    category.name = name.trim();
    await category.save();
    res.json({ category: toPublicCategory(category) });
  } catch (err) {
    console.error('rename category error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'הענף לא נמצא' });
  res.json({ success: true });
});

router.post('/:id/leaves', requireAuth, async (req, res) => {
  try {
    const { name } = req.body ?? {};
    if (!name?.trim()) {
      return res.status(400).json({ message: 'יש להזין שם עלה' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'הענף לא נמצא' });

    if (category.leaves.some((leaf) => sameName(leaf.name, name))) {
      return res.status(409).json({ message: 'עלה בשם הזה כבר קיים בענף' });
    }

    category.leaves.push({ name: name.trim() });
    await category.save();
    res.status(201).json({ category: toPublicCategory(category) });
  } catch (err) {
    console.error('add leaf error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

router.put('/:id/leaves/:leafId', requireAuth, async (req, res) => {
  try {
    const { name } = req.body ?? {};
    if (!name?.trim()) {
      return res.status(400).json({ message: 'יש להזין שם עלה' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'הענף לא נמצא' });

    const leaf = category.leaves.id(req.params.leafId);
    if (!leaf) return res.status(404).json({ message: 'העלה לא נמצא' });

    if (category.leaves.some((l) => l._id.toString() !== leaf._id.toString() && sameName(l.name, name))) {
      return res.status(409).json({ message: 'עלה בשם הזה כבר קיים בענף' });
    }

    leaf.name = name.trim();
    await category.save();
    res.json({ category: toPublicCategory(category) });
  } catch (err) {
    console.error('rename leaf error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

router.delete('/:id/leaves/:leafId', requireAuth, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'הענף לא נמצא' });

  category.leaves = category.leaves.filter((leaf) => leaf._id.toString() !== req.params.leafId);
  await category.save();
  res.json({ category: toPublicCategory(category) });
});

export default router;
