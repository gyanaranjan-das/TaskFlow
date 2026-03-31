import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload { id, role }
 * @returns {string} Signed JWT token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    algorithm: 'HS256',
  });
};

/**
 * Generate refresh token (UUID) and its hash for DB storage
 * @returns {{ token: string, hashedToken: string, family: string }}
 */
export const generateRefreshToken = () => {
  const token = uuidv4();
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const family = uuidv4();
  return { token, hashedToken, family };
};

/**
 * Hash a refresh token for comparison
 * @param {string} token - Raw refresh token
 * @returns {string} Hashed token
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate a random crypto token (for email verification, password reset)
 * @returns {{ token: string, hashedToken: string }}
 */
export const generateCryptoToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashedToken };
};
