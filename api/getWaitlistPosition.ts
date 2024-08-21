import { IncomingMessage, ServerResponse } from 'http';
import { send } from 'micro';
import { User, connectToDatabase } from './models/User';
import { verifyToken } from './utils/jwt';  // Assuming you have a verifyToken function

export default async function getWaitlistPosition(req: IncomingMessage, res: ServerResponse) {
  await connectToDatabase();

  if (req.method !== 'GET') {
    send(res, 405, { message: 'Method Not Allowed' });
    return;
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      send(res, 401, { message: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { userId: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      send(res, 404, { error: 'User not found' });
      return;
    }

    if (user.isApproved) {
      send(res, 200, { isApproved: true });
    } else {
      send(res, 200, { position: user.position, isApproved: false });
    }
  } catch (error) {
    console.error('Error retrieving waitlist position:', error);
    send(res, 500, { error: 'Internal Server Error' });
  }
}