"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt"); // Importing from jwt.ts
const router = (0, express_1.Router)();
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.default({ email, password: hashedPassword, position: await User_1.default.countDocuments() + 1 });
        await newUser.save();
        const accessToken = (0, jwt_1.generateAccessToken)(newUser._id.toString()); // Using the imported function
        const refreshToken = (0, jwt_1.generateRefreshToken)(newUser._id.toString()); // Using the imported function
        res.cookie('token', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
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
        const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString()); // Using the imported function
        const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString()); // Using the imported function
        res.cookie('token', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.json({ message: 'Login successful', accessToken, refreshToken });
    }
    catch (err) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
exports.default = router;
