import mongoose from 'mongoose';

// This is the collection where every username + (hashed) password in the
// system lives. Mongoose will create the `users` collection automatically
// the first time a document is saved to it.
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    // 'employee' has full access to the operational pages.
    // 'manager' has everything an employee has, plus the employee-management page.
    role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
