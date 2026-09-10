import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI לא מוגדר. צור קובץ .env בשורש הפרויקט לפי ההוראות ב-MONGODB_SETUP.md',
    );
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`Connected to MongoDB (${mongoose.connection.name})`);
}
