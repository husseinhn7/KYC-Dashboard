import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { signJwt } from '../utils/jwt';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const login = async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  const { email, password } = parse.data;
  let user = await User.findOne({ email });
  if (!user) {
    // Mock user for demo
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signJwt({ userId: user._id as string, role: user.role, region: user.region });
  res.json({ accessToken: token, role: user.role, region: user.region });
};

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = await User.findById(req.user.userId).select("-password");
  if (!user) return res.status(404).json({
    message: "User not found"
  });
  res.json(user);
}; 