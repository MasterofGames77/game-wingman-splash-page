import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import waitlistRoute from './waitlist'; // Import the waitlist route

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err: any) => console.log('MongoDB connection error:', err));

// Use the waitlist route
app.use('/api', waitlistRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});