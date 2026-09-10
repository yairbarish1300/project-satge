import mongoose from 'mongoose';

// A "leaf" is a specific tag under a branch (e.g. branch "Audio" -> leaf
// "מיקרופון"), used by the Shop's category sidebar filter and the Add
// Product form's category dropdown. Leaves get their own _id automatically.
const leafSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true } });

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    leaves: { type: [leafSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model('Category', categorySchema);
