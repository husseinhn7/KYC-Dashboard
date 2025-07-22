import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyJwt(token);
  if (!payload) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  req.user = payload;
  // console.log(
  //   `Authenticated user: ${JSON.stringify(req.user.region)} --------- ${
  //     req.user
  //   }`
  // );
  next();
}; 