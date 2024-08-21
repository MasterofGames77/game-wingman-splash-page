import mongoose, { Document, Schema } from 'mongoose';

let isConnected = false; // Track the connection status

// MongoDB connection function
async function connectToDatabase() {
  if (isConnected) {
    return; // Already connected
  }
  
  // Replace with your MongoDB URI
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable inside .env.local");
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true; // Connection successful
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Define an interface for the User document
export interface IUser extends Document {
  email: string;
  password: string;
  position: number | null;
  isApproved: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  _id: mongoose.Types.ObjectId;
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  position: { type: Number, default: null },
  isApproved: { type: Boolean, default: false },
  resetPasswordToken: { type: String, default: undefined },
  resetPasswordExpires: { type: Date, default: undefined },
});

// Initialize the model only if it hasn't been initialized before (important for serverless)
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema, 'users');

export { User, connectToDatabase };