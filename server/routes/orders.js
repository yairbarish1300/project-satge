import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const STATUSES = ['pending', 'approved', 'completed', 'cancelled'];

function toPublicOrder(o) {
  return {
    id: o.orderNumber,
    mongoId: o._id,
    customer: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    company: o.company,
    productId: o.productId,
    product: o.productName,
    price: `₪${o.totalPrice.toLocaleString('he-IL')}`,
    totalPrice: o.totalPrice,
    status: o.status,
    notes: o.notes,
    createdAt: o.createdAt,
  };
}

async function generateOrderNumber() {
  for (let i = 0; i < 8; i += 1) {
    const candidate = `#STG-${Math.floor(1000 + Math.random() * 9000)}`;
    // eslint-disable-next-line no-await-in-loop
    const exists = await Order.findOne({ orderNumber: candidate });
    if (!exists) return candidate;
  }
  return `#STG-${Date.now()}`;
}

// Public: submitted from the customer-facing checkout page.
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, company, productId, notes } = req.body ?? {};

    if (!customerName?.trim()) {
      return res.status(400).json({ message: 'יש למלא שם מלא' });
    }
    if (!productId) {
      return res.status(400).json({ message: 'לא נבחר מוצר להזמנה' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'המוצר לא נמצא' });
    }

    const order = await Order.create({
      orderNumber: await generateOrderNumber(),
      customerName: customerName.trim(),
      customerEmail: (customerEmail ?? '').trim(),
      customerPhone: (customerPhone ?? '').trim(),
      company: (company ?? '').trim(),
      productId: product._id,
      productName: product.name,
      totalPrice: product.price,
      notes: (notes ?? '').trim(),
    });

    res.status(201).json({ order: toPublicOrder(order) });
  } catch (err) {
    console.error('create order error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

// Everything below is for the admin Orders page — any logged-in employee/manager.
router.get('/', requireAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ orders: orders.map(toPublicOrder) });
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'ההזמנה לא נמצאה' });
    }

    const { customerName, customerEmail, customerPhone, company, status, totalPrice, notes } = req.body ?? {};

    if (customerName !== undefined) order.customerName = customerName.trim();
    if (customerEmail !== undefined) order.customerEmail = customerEmail.trim();
    if (customerPhone !== undefined) order.customerPhone = customerPhone.trim();
    if (company !== undefined) order.company = company.trim();
    if (notes !== undefined) order.notes = notes.trim();

    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ message: 'סטטוס לא תקין' });
      }
      order.status = status;
    }

    if (totalPrice !== undefined) {
      const parsedPrice = Number(totalPrice);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ message: 'סכום לא תקין' });
      }
      order.totalPrice = parsedPrice;
    }

    await order.save();
    res.json({ order: toPublicOrder(order) });
  } catch (err) {
    console.error('update order error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'ההזמנה לא נמצאה' });
  }
  res.json({ success: true });
});

export default router;
