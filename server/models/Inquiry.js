import mongoose from 'mongoose';

// A "contact us" submission from the public contact page — has nothing to do
// with a specific product, just the customer's details and why they're reaching out.
const inquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    reason: { type: String, trim: true, default: '' },
    message: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['new', 'handled'], default: 'new' },
  },
  { timestamps: true },
);

export default mongoose.model('Inquiry', inquirySchema);
