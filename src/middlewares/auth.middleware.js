import { env } from '../config/env.js';
import usersService from '../services/users.service.js';
import { AppError } from '../utils/errors/AppError.js';
import { verifyJwt } from '../utils/jwt.js';

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
      throw new AppError('Authorization header missing', 401);
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Invalid authorization format', 401);
    }

    const payload = verifyJwt({ token, secret: env.jwt.accessSecret });
    if (!payload?.sub) {
      throw new AppError('Invalid access token', 401);
    }

    const user = await usersService.getUserById(payload.sub);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
