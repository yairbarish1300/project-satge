import { Router } from 'express';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';
import { findFreeUnits, isValidDateRange } from '../utils/availability.js';

const router = Router();

function toPublicProduct(p) {
  return {
    id: p._id,
    name: p.name,
    sku: p.sku,
    description: p.description,
    category: p.category,
    image: p.image,
    price: p.price,
    unit: p.unit,
    stockTotal: p.stockTotal,
    inStock: p.stockTotal > 0,
    tags: p.tags,
    createdAt: p.createdAt,
  };
}

// Public: the Shop page (customer-facing) needs to read the catalog without logging in.
router.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ products: products.map(toPublicProduct) });
});

// Public: how many units of this product are free for a given date range —
// used by the checkout page before it lets the customer submit a reservation.
router.get('/:id/availability', async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!isValidDateRange(startDate, endDate)) {
    return res.status(400).json({ message: 'טווח תאריכים לא תקין' });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'המוצר לא נמצא' });
  }

  const free = await findFreeUnits(product._id, product.stockTotal, startDate, endDate);
  res.json({ stockTotal: product.stockTotal, availableUnits: free.length });
});

// Everything below is a write — any logged-in employee/manager may manage the catalog.
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, sku, description, category, image, price, unit, stockTotal, tags } = req.body ?? {};

    if (!name?.trim() || !sku?.trim()) {
      return res.status(400).json({ message: 'יש למלא שם מוצר ו-SKU' });
    }

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: 'יש להזין מחיר תקין' });
    }

    const parsedStock = Number(stockTotal);
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ message: 'יש להזין כמות מלאי תקינה' });
    }

    const existing = await Product.findOne({ sku: sku.trim() });
    if (existing) {
      return res.status(409).json({ message: 'קיים כבר מוצר עם ה-SKU הזה' });
    }

    const product = await Product.create({
      name: name.trim(),
      sku: sku.trim(),
      description: (description ?? '').trim(),
      category: (category ?? '').trim() || 'General',
      image: image || '',
      price: parsedPrice,
      unit: unit || '/ יום',
      stockTotal: parsedStock,
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({ product: toPublicProduct(product) });
  } catch (err) {
    console.error('create product error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'המוצר לא נמצא' });
    }

    const { name, sku, description, category, image, price, unit, stockTotal, tags } = req.body ?? {};

    if (sku !== undefined && sku.trim() !== product.sku) {
      const duplicate = await Product.findOne({ sku: sku.trim(), _id: { $ne: product._id } });
      if (duplicate) return res.status(409).json({ message: 'קיים כבר מוצר עם ה-SKU הזה' });
      product.sku = sku.trim();
    }

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (category !== undefined) product.category = category.trim() || 'General';
    if (image !== undefined) product.image = image;
    if (unit !== undefined) product.unit = unit;
    if (tags !== undefined) product.tags = Array.isArray(tags) ? tags : product.tags;

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ message: 'יש להזין מחיר תקין' });
      }
      product.price = parsedPrice;
    }

    if (stockTotal !== undefined) {
      const parsedStock = Number(stockTotal);
      if (!Number.isFinite(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ message: 'יש להזין כמות מלאי תקינה' });
      }
      product.stockTotal = parsedStock;
    }

    await product.save();
    res.json({ product: toPublicProduct(product) });
  } catch (err) {
    console.error('update product error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'המוצר לא נמצא' });
  }
  res.json({ success: true });
});

export default router;
