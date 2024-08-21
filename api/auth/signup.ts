import { IncomingMessage, ServerResponse } from 'http';
import { send } from 'micro';
import bcrypt from 'bcryptjs';
import { json } from 'micro';
import { User, connectToDatabase } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

interface SignupRequestBody {
  email: string;
  password: string;
}

export default async function signup(req: IncomingMessage, res: ServerResponse) {
  await connectToDatabase();

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  const { email, password } = await json(req) as SignupRequestBody;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, position: await User.countDocuments() + 1 });
    await newUser.save();

    const accessToken = generateAccessToken(newUser._id.toString());
    const refreshToken = generateRefreshToken(newUser._id.toString());

    send(res, 201, { message: 'User created', accessToken, refreshToken });
  } catch (err) {
    send(res, 500, { message: 'Error creating user' });
  }
}