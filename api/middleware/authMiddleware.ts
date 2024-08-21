import { IncomingMessage, ServerResponse } from 'http';
import { send } from 'micro';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';

export const authMiddleware = async (req: IncomingMessage, res: ServerResponse) => {
  const authorizationHeader = req.headers.authorization || '';
  let token = authorizationHeader;

  // Log the incoming token
  console.log('Received Token:', token);

  if (!token) {
    send(res, 401, { message: 'Unauthorized' });
    return false;
  }

  // Strip 'Bearer ' prefix if it exists
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }

  try {
    const decoded = verifyToken(token) as { userId: string };

    // Log the decoded token
    console.log('Decoded Token:', decoded);

    const user = await User.findById(decoded.userId).exec();
    console.log('Looking for User with ID:', decoded.userId);

    if (!user) {
      console.log('No user found with the provided ID');
      send(res, 401, { message: 'Unauthorized' });
      return false;
    }

    // Attach the user to the request object
    (req as any).user = user;

    // Log the authenticated user
    console.log('Authenticated User:', user);

    return true;
  } catch (err) {
    console.error('Error verifying token or finding user:', err);
    send(res, 401, { message: 'Unauthorized' });
    return false;
  }
};
