"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const jwt_1 = require("../utils/jwt");
const sendEmail_1 = require("../utils/sendEmail");
const router = (0, express_1.Router)();
const isProduction = process.env.NODE_ENV === 'production';
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.default({ email, password: hashedPassword, position: await User_1.default.countDocuments() + 1 });
        await newUser.save();
        const accessToken = (0, jwt_1.generateAccessToken)(newUser._id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(newUser._id.toString());
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
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating user' });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user || !await bcryptjs_1.default.compare(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
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
    }
    catch (err) {
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
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = crypto_1.default.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();
        // Send the reset token to the user's email
        const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
        const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                     Please click on the following link, or paste this into your browser to complete the process:\n\n
                     ${resetUrl}\n\n
                     If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        await (0, sendEmail_1.sendEmail)(user.email, 'Password Reset', message);
        res.status(200).json({ message: 'Password reset email sent' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: 'Password has been reset' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
