import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the User document
export interface IUser extends Document {  // Ensure this is exported
  email: string;
  password: string;
  position: number;
  _id: mongoose.Types.ObjectId; // Ensure _id is of type ObjectId
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  position: { type: Number, required: true },
});

const User = mongoose.model<IUser>('User', userSchema, 'users');

export default User;