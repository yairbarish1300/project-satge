import mongoose from 'mongoose';

// The full product catalog (used by Shop, Inventory, and the Dashboard "Add
// Product" flow) lives in this one collection now instead of the browser's
// localStorage, so every employee/manager sees the same live data.
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: 'General' },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, default: '/ יום' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model('Product', productSchema);
