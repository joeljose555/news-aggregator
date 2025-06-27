import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();



export const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      // useNewUrlParser and useUnifiedTopology are default in mongoose >= 6
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
