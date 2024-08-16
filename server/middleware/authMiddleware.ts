import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt'; // Import the verifyToken function
import User from '../models/User';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  // Log the incoming token
  console.log('Received Token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token) as { userId: string }; // Use the imported verifyToken function

    // Log the decoded token
    console.log('Decoded Token:', decoded);

    const user = await User.findById(decoded.userId);
    console.log('Looking for User with ID:', decoded.userId);

    if (!user) {
      console.log('No user found with the provided ID');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach the user to the request object using a plain property
    (req as any).user = user;

    // Log the user that was found
    console.log('Authenticated User:', user);

    next();
  } catch (err) {
    console.error('Error verifying token or finding user:', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authMiddleware;