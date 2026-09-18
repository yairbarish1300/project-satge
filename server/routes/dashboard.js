import { Router } from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Real numbers computed from the products/orders collections — used by the
// admin dashboard's stat tiles instead of the placeholder figures it used to ship with.
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const activeOrdersCount = await Order.countDocuments({ status: { $in: ['pending', 'approved'] } });
    const pendingOrdersCount = await Order.countDocuments({ status: 'pending' });

    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const monthOrders = await Order.find({
      status: { $ne: 'cancelled' },
      createdAt: { $gte: monthStart },
    }).select('totalPrice');
    const revenueThisMonth = monthOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    res.json({
      productCount,
      activeOrdersCount,
      pendingOrdersCount,
      revenueThisMonth,
      monthOrdersCount: monthOrders.length,
    });
  } catch (err) {
    console.error('dashboard stats error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

export default router;
