import mongoose from 'mongoose';

// An order = a reservation of `quantity` specific units of one product for
// one continuous date range. `unitNumbers` records exactly which of the
// product's 1..stockTotal personal unit numbers were allocated to this
// booking, so the same physical unit can never be double-booked for
// overlapping dates (see server/utils/availability.js).
const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, default: '' },
    customerPhone: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },

    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true, trim: true }, // snapshot, survives product edits/deletion
    quantity: { type: Number, required: true, min: 1 },
    unitNumbers: { type: [Number], required: true },

    // Stored as plain "YYYY-MM-DD" strings on purpose: that format sorts
    // and compares correctly as plain strings, so range-overlap queries
    // don't need timezone-sensitive Date math.
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },

    pricePerUnitPerDay: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'approved', 'completed', 'cancelled'], default: 'pending' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

export default mongoose.model('Order', orderSchema);
