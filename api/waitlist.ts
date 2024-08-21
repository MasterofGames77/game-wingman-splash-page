import { IncomingMessage, ServerResponse } from 'http';
import { send } from 'micro';
import { json } from 'micro';
import bcrypt from 'bcryptjs';
import { User, connectToDatabase } from './models/User';

export default async function waitlist(req: IncomingMessage, res: ServerResponse) {
  await connectToDatabase();

  if (req.method !== 'POST') {
    send(res, 405, { message: 'Method Not Allowed' });
    return;
  }

  try {
    const { email, password } = await json(req) as { email: string; password: string };

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      send(res, 400, { message: 'Email is already on the waitlist' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving

    const position = await User.countDocuments() + 1;

    const newUser = new User({
      email,
      password: hashedPassword,
      position,
      isApproved: false,
    });

    await newUser.save();

    send(res, 200, { message: 'Email added to the waitlist', position });
  } catch (err) {
    send(res, 500, { message: 'Server error. Please try again later.' });
  }
}