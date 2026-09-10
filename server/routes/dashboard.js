import { Router } from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { requireAuth } from '../middleware/auth.js';
import { todayIso } from '../utils/availability.js';

const router = Router();

// Real numbers computed from the products/orders collections — used by the
// admin dashboard's stat tiles instead of the placeholder figures it used to ship with.
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const products = await Product.find().select('stockTotal');
    const totalUnits = products.reduce((sum, p) => sum + p.stockTotal, 0);
    const productCount = products.length;

    const activeOrdersCount = await Order.countDocuments({ status: { $in: ['pending', 'approved'] } });

    const today = todayIso();
    const inUseOrders = await Order.find({
      status: { $in: ['pending', 'approved', 'completed'] },
      startDate: { $lte: today },
      endDate: { $gte: today },
    }).select('quantity');
    const unitsInUse = inUseOrders.reduce((sum, o) => sum + o.quantity, 0);
    const inUsePercent = totalUnits > 0 ? Math.round((unitsInUse / totalUnits) * 100) : 0;

    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const monthOrders = await Order.find({
      status: { $ne: 'cancelled' },
      createdAt: { $gte: monthStart },
    }).select('totalPrice');
    const revenueThisMonth = monthOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    res.json({
      totalUnits,
      productCount,
      activeOrdersCount,
      unitsInUse,
      inUsePercent,
      revenueThisMonth,
      monthOrdersCount: monthOrders.length,
    });
  } catch (err) {
    console.error('dashboard stats error:', err);
    res.status(500).json({ message: 'שגיאת שרת, נסה שוב' });
  }
});

export default router;
