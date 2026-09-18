import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, default: '' },
    customerPhone: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },

    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true, trim: true }, // snapshot, survives product edits/deletion

    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'approved', 'completed', 'cancelled'], default: 'pending' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

export default mongoose.model('Order', orderSchema);
