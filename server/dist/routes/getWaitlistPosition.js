"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.get('/getWaitlistPosition', async (req, res) => {
    // Access the user ID from the request, using 'any' to bypass TypeScript errors
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const user = await User_1.default.findById(userId);
        if (user) {
            res.json({ position: user.position, isApproved: user.isApproved });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error retrieving waitlist position:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
