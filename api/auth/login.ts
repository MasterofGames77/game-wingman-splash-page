import { IncomingMessage, ServerResponse } from 'http';
import bcrypt from 'bcryptjs';
import { json } from 'micro';
import { User, connectToDatabase } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

interface LoginRequestBody {
  email: string;
  password: string;
}

export default async function login(req: IncomingMessage, res: ServerResponse) {
  await connectToDatabase();

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  const { email, password } = await json(req) as LoginRequestBody;

  try {
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Invalid credentials' }));
      return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Login successful', accessToken, refreshToken }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Error logging in' }));
  }
}