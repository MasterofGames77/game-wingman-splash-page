import { IncomingMessage, ServerResponse } from 'http';
import { send } from 'micro';
import bcrypt from 'bcryptjs';
import { json } from 'micro';
import { User, connectToDatabase } from '../models/User';

interface ResetPasswordRequestBody {
  token: string;
  newPassword: string;
}

export default async function resetPassword(req: IncomingMessage, res: ServerResponse) {
  await connectToDatabase();

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  const { token, newPassword } = await json(req) as ResetPasswordRequestBody;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      send(res, 400, { message: 'Password reset token is invalid or has expired' });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    send(res, 200, { message: 'Password has been reset' });
  } catch (err) {
    send(res, 500, { message: 'Server error' });
  }
}