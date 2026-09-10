import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';
import { findFreeUnits, isValidDateRange, rentalDays, todayIso } from '../utils/availability.js';

const router = Router();
const STATUSES = ['pending', 'approved', 'completed', 'cancelled'];

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function toPublicOrder(o) {
  return {
    id: o.orderNumber,
    mongoId: o._id,
    customer: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    company: o.company,
    productId: o.productId,
    product: o.quantity > 1 ? `${o.productName} × ${o.quantity}` : o.productName,
    productName: o.productName,
    quantity: o.quantity,
    unitNumbers: o.unitNumbers,
    dates: `${formatDate(o.startDate)} - ${formatDate(o.endDate)}`,
    startDate: o.startDate,
    endDate: o.endDate,
    price: `₪${o.totalPrice.toLocaleString('he-IL')}`,
    totalPrice: o.totalPrice,
    pricePerUnitPerDay: o.pricePerUnitPerDay,
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

// Public: submitted from the customer-facing checkout page. This is where a
// specific product is actually reserved — it re-checks availability and
// assigns concrete unit numbers atomically with creating the order, so two
// customers can't be handed the same physical unit for overlapping dates.
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, company, productId, quantity, startDate, endDate, notes } =
      req.body ?? {};

    if (!customerName?.trim()) {
      return res.status(400).json({ message: 'יש למלא שם מלא' });
    }
    if (!productId) {
      return res.status(400).json({ message: 'לא נבחר מוצר להזמנה' });
    }
    if (!isValidDateRange(startDate, endDate)) {
      return res.status(400).json({ message: 'יש לבחור טווח תאריכים תקין' });
    }
    // A one-day grace window absorbs any client/server timezone drift instead
    // of rejecting a booking the customer's own calendar considered "today".
    const minStartDate = new Date(`${todayIso()}T00:00:00Z`);
    minStartDate.setUTCDate(minStartDate.getUTCDate() - 1);
    if (new Date(`${startDate}T00:00:00Z`) < minStartDate) {
      return res.status(400).json({ message: 'לא ניתן לשריין תאריך שכבר עבר' });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: 'יש להזין כמות תקינה' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'המוצר לא נמצא' });
    }
    if (product.stockTotal === 0) {
      return res.status(400).json({ message: 'מוצר זה אינו זמין להשכרה כרגע' });
    }
    if (qty > product.stockTotal) {
      return res.status(400).json({ message: `לא ניתן להזמין יותר מ-${product.stockTotal} יחידות מהמוצר הזה` });
    }

    const freeUnits = await findFreeUnits(product._id, product.stockTotal, startDate, endDate);
    if (freeUnits.length < qty) {
      return res.status(409).json({
        message: `אין מספיק יחידות פנויות בתאריכים אלו — זמינות כרגע: ${freeUnits.length} מתוך ${product.stockTotal}`,
      });
    }

    const unitNumbers = freeUnits.slice(0, qty);
    const days = rentalDays(startDate, endDate);
    const totalPrice = product.price * qty * days;

    const order = await Order.create({
      orderNumber: await generateOrderNumber(),
      customerName: customerName.trim(),
      customerEmail: (customerEmail ?? '').trim(),
      customerPhone: (customerPhone ?? '').trim(),
      company: (company ?? '').trim(),
      productId: product._id,
      productName: product.name,
      quantity: qty,
      unitNumbers,
      startDate,
      endDate,
      pricePerUnitPerDay: product.price,
      totalPrice,
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

// Admin edits are limited to status/notes/contact details/price override —
// changing the reserved product, dates, or quantity would require redoing
// the unit allocation, so that's not supported here (cancel and rebook instead).
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
      order.status = status; // setting 'cancelled' immediately frees its reserved units
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
