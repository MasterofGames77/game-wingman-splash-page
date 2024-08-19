import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { sendEmail } from '../utils/sendEmail';

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

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: isProduction ? 'strict' : 'lax', // Use 'lax' for development
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax', // Use 'lax' for development
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

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax', // Use 'lax' for development
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax', // Use 'lax' for development
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
    sameSite: isProduction ? 'strict' : 'lax', // Use 'lax' for development
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax', // Use 'lax' for development
  });
  res.status(200).json({ message: 'Logout successful' });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    // Send the reset token to the user's email
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                     Please click on the following link, or paste this into your browser to complete the process:\n\n
                     ${resetUrl}\n\n
                     If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    await sendEmail(user.email, 'Password Reset', message);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;