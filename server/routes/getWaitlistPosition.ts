import express, { Request, Response } from 'express';
import User from '../models/User';

const router = express.Router();

router.get('/getWaitlistPosition', async (req: Request, res: Response) => {
  // Access the user ID from the request, using 'any' to bypass TypeScript errors
  const userId = (req as any).user?._id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(userId);
    if (user) {
      res.json({ position: user.position, isApproved: user.isApproved });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving waitlist position:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;