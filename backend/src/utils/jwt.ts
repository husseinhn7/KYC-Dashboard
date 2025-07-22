import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface JwtPayload {
  userId: string;
  role: string;
  region?: string;
}

export const signJwt = (payload: JwtPayload, expiresIn = '1h') => {
  return jwt.sign({ ...payload }, JWT_SECRET, {  expiresIn : "2h" });
};

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}; 