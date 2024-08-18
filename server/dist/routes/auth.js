"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
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
    }
    catch (err) {
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
exports.default = router;
