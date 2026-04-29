import jwt from 'jsonwebtoken';
import { ApiError } from './apiError';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';
const JWT_EXPIRES_IN = '1d';

export interface JwtPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired token');
  }
};
