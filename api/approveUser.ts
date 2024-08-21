import { IncomingMessage, ServerResponse } from 'http';
import { send } from 'micro';
import { json } from 'micro';
import { User, connectToDatabase } from './models/User';
import { authMiddleware } from './middleware/authMiddleware';

export default async function approveUser(req: IncomingMessage, res: ServerResponse) {
  await connectToDatabase();

  if (req.method !== 'POST') {
    send(res, 405, { message: 'Method Not Allowed' });
    return;
  }

  try {
    const isAuthenticated = await authMiddleware(req, res);
    if (!isAuthenticated) return;

    const { userId } = await json(req) as { userId: string };

    const user = await User.findById(userId);

    if (!user) {
      send(res, 404, { message: 'User not found' });
      return;
    }

    user.position = null;  // Nullify the waitlist position
    user.isApproved = true;

    await user.save();

    const users = await User.find({ position: { $ne: null } }).sort('position');
    users.forEach(async (user, index) => {
      user.position = index + 1;
      await user.save();
    });

    send(res, 200, { message: 'User approved and positions updated' });
  } catch (err) {
    console.error(err);
    send(res, 500, { message: 'Server error' });
  }
}