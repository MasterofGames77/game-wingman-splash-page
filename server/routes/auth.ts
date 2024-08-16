import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'; // Importing from jwt.ts

const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, position: await User.countDocuments() + 1 });

    await newUser.save();

    const accessToken = generateAccessToken(newUser._id.toString()); // Using the imported function
    const refreshToken = generateRefreshToken(newUser._id.toString()); // Using the imported function

    res.cookie('token', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.status(201).json({ message: 'User created', accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id.toString()); // Using the imported function
    const refreshToken = generateRefreshToken(user._id.toString()); // Using the imported function

    res.cookie('token', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.json({ message: 'Login successful', accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

export default router;