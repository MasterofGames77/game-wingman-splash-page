import { Request, Response, Router } from 'express';
import User from './models/User'; // Import the User model

const router = Router();

// Endpoint to add an email to the waitlist
router.post('/waitlist', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already on the waitlist' });
    }

    const position = await User.countDocuments() + 1;
    const newUser = new User({ email, position });
    await newUser.save();

    res.status(200).json({ message: 'Email added to the waitlist', position });
  } catch (err: any) { 
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

export default router;