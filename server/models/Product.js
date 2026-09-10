import mongoose from 'mongoose';

// The full product catalog (used by Shop, Inventory, and the Dashboard "Add
// Product" flow) lives in this one collection now instead of the browser's
// localStorage, so every employee/manager sees the same live data.
//
// `stockTotal` is the fleet size — how many physical units of this product
// the business owns. There is no separate "available" counter: since this is
// a date-range rental system, whether a unit is free depends on which dates
// you're asking about. Each unit is identified by a number from 1..stockTotal
// (see server/utils/availability.js), and availability is always computed on
// demand for a specific date range instead of being tracked as a static field.
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: 'General' },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 }, // price per unit, per day
    unit: { type: String, default: '/ יום' },
    stockTotal: { type: Number, required: true, min: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model('Product', productSchema);
