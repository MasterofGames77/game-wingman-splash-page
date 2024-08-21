import { IncomingMessage, ServerResponse } from 'http';
import { send } from 'micro';
import crypto from 'crypto';
import { json } from 'micro';
import { User, connectToDatabase } from '../models/User';
import { sendEmail } from '../utils/sendEmail';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://game-wingman-splash-page.vercel.app'
  : 'http://localhost:3000';

interface ForgotPasswordRequestBody {
  email: string;
}

export default async function forgotPassword(req: IncomingMessage, res: ServerResponse) {
  await connectToDatabase();

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  const { email } = await json(req) as ForgotPasswordRequestBody;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      send(res, 404, { message: 'User not found' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    const resetUrl = `${BASE_URL}/reset-password?token=${token}`;
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                     Please click on the following link, or paste this into your browser to complete the process:\n\n
                     ${resetUrl}\n\n
                     If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    await sendEmail(user.email, 'Password Reset', message);

    send(res, 200, { message: 'Password reset email sent' });
  } catch (err) {
    send(res, 500, { message: 'Server error' });
  }
}