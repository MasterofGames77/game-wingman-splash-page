import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

const router = Router();

const isProduction = process.env.NODE_ENV === 'production';

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, position: await User.countDocuments() + 1 });

    await newUser.save();

    const accessToken = generateAccessToken(newUser._id.toString());
    const refreshToken = generateRefreshToken(newUser._id.toString());

    // Set the token in a cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only set secure flag in production
      sameSite: 'strict', // Use lowercase 'strict'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Use lowercase 'strict'
    });

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

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Set the token in a cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only set secure flag in production
      sameSite: 'strict', // Use lowercase 'strict'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Use lowercase 'strict'
    });

    res.json({ message: 'Login successful', accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});


router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logout successful' });
});

export default router;