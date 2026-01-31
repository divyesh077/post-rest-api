import bcrypt from 'bcryptjs';

import { sendEmailVerification, sendPasswordResetEmail, sendWelcomeEmail } from './mail.service.js';
import tokensService from './tokens.service.js';
import { env } from '../config/env.js';
import { User } from '../models/users.model.js';
import usersService from '../services/users.service.js';
import { hashToken } from '../utils/crypto.js';
import { AppError } from '../utils/errors/AppError.js';
import { verifyJwt } from '../utils/jwt.js';
const signup = async ({ userData, meta }) => {
  try {
    const { username, email, password } = userData;
    const user = await usersService.createUser({
      username,
      email,
      password,
    });

    const accessToken = tokensService.generateAccessToken({
      userId: user._id,
      role: user.role,
    });
    const refreshToken = tokensService.generateRefreshToken({
      userId: user._id,
      role: user.role,
    });

    await tokensService.storeRefreshToken({
      refreshToken,
      userId: user._id,
      meta,
    });

    await sendWelcomeEmail(email, username);
    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.error('AuthService :: signup :: error :: ', error);
    throw error;
  }
};

const signin = async ({ email, password, meta }) => {
  try {
    const user = await usersService.getUserByEmailWithThrowError(email);

    const isPasswordMatch = await user.isPasswordMatch(password);

    if (!isPasswordMatch) {
      throw new AppError('Password not matched', 403);
    }

    const accessToken = tokensService.generateAccessToken({
      userId: user._id,
      role: user.role,
    });
    const refreshToken = tokensService.generateRefreshToken({
      userId: user._id,
      role: user.role,
    });

    await tokensService.storeRefreshToken({
      refreshToken,
      userId: user._id,
      meta,
    });

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.error('AuthService :: signin :: error :: ', error);
    throw error;
  }
};

const signout = async ({ refreshToken }) => {
  try {
    const tokenHash = hashToken(refreshToken);
    return await tokensService.revokeRefreshToken({ tokenHash });
  } catch (error) {
    console.error('AuthService :: signout :: error :: ', error);
    throw error;
  }
};

const signoutAllDevices = async ({ userId }) => {
  try {
    return await tokensService.revokeAllUserRefreshTokens({ userId });
  } catch (error) {
    console.error('AuthService :: signoutAllDevices :: error :: ', error);
    throw error;
  }
};

const refresh = async ({ refreshToken, meta }) => {
  try {
    const payload = tokensService.verifyRefreshTokenJwt({ refreshToken });
    const userId = payload?.sub;
    const role = payload?.role;

    if (!userId) {
      throw new AppError('UnAuthorized', 403);
    }

    const newAcceessToken = tokensService.generateAccessToken({
      userId,
      role,
    });

    const newRefreshToken = await tokensService.rotateRefreshToken({
      oldRefreshToken: refreshToken,
      userId,
      role,
      meta,
    });

    return {
      accessToken: newAcceessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error('AuthService :: refresh :: error :: ', error);
    throw error;
  }
};

const sendVerificationEmail = async ({ email, meta }) => {
  try {
    const user = await usersService.getUserByEmailWithThrowError(email);

    const { _id: userId, role } = user;

    const token = tokensService.generateEmailVerificationToken({ userId, role });

    await tokensService.storeEmailVerificationToken({ token: token, userId, meta });

    const verifyLink = `http://localhost:${env.port}/verify-email?token=${token}`;
    await sendEmailVerification(email, verifyLink);

    return verifyLink;
  } catch (error) {
    console.error('AuthService :: sendVerificationEmail :: error :: ', error);
    throw error;
  }
};

const verifyEmail = async ({ emailVerifyToken }) => {
  try {
    const payload = verifyJwt({ token: emailVerifyToken, secret: env.jwt.emailVerifySecret });

    const userId = payload?.sub;
    if (!userId) {
      throw new AppError('User NOT FOUND UnAuthorized');
    }

    const tokenDoc = await tokensService.consumeEmailVerificationToken({ token: emailVerifyToken });
    if (!tokenDoc) {
      throw new AppError('Invalid or expired verification link');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      throw new AppError('User not found');
    }

    return updatedUser;
  } catch (error) {
    console.error('AuthService :: verifyEmail :: error :: ', error);
    throw error;
  }
};

const forgotPassword = async ({ email, meta }) => {
  try {
    const { _id: userId, role } = await usersService.getUserByEmailWithThrowError(email);

    const token = tokensService.generatePasswordResetToken({
      userId,
      role,
    });

    await tokensService.storePasswordResetToken({ token, userId, meta });

    const resetLink = `http://localhost:${env.port}/reset-password?token=${token}`;

    await sendPasswordResetEmail(email, resetLink);
    return resetLink;
  } catch (error) {
    console.error('AuthService :: forgotPassword :: error :: ', error);
    throw error;
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const payload = verifyJwt({ token, secret: env.jwt.passwordResetSecret });
    if (!payload?.sub) {
      throw new AppError('Unauthorized');
    }

    const tokenDoc = await tokensService.consumePasswordResetToken({ token });

    if (!tokenDoc) {
      throw new AppError('Invalid or expired reset link');
    }
    const { userId } = tokenDoc;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { password: hash });

    await tokensService.revokeAllUserRefreshTokens({ userId });
  } catch (error) {
    console.error('AuthService :: resetPassword :: error :: ', error);
    throw error;
  }
};

export default {
  signup,
  signin,
  signout,
  signoutAllDevices,
  refresh,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
