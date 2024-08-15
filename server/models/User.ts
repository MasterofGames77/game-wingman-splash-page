import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  position: { type: Number, required: true },
});

const User = mongoose.model('User', userSchema, 'users');

export default User;