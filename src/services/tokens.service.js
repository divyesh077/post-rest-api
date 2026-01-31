import mongoose from 'mongoose';

import { env } from '../config/env.js';
import { Token } from '../models/tokens.model.js';
import { hashToken } from '../utils/crypto.js';
import { signJwt, verifyJwt } from '../utils/jwt.js';

/* ---------- helpers ---------- */

const getExpiryDate = (ms) => new Date(Date.now() + ms);

const findActiveTokenByHash = ({ tokenHash, type }) => {
  return Token.findOne({
    tokenHash,
    type,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
};

/* ---------- JWT generation ---------- */

const generateAccessToken = ({ userId, role }) =>
  signJwt({
    payload: { sub: userId, role },
    secret: env.jwt.accessSecret,
    expiresIn: env.jwt.accessExpiresIn,
  });

const generateRefreshToken = ({ userId, role }) =>
  signJwt({
    payload: { sub: userId, role },
    secret: env.jwt.refreshSecret,
    expiresIn: env.jwt.refreshExpiresIn,
  });

const generateEmailVerificationToken = ({ userId, role }) =>
  signJwt({
    payload: { sub: userId, role },
    secret: env.jwt.emailVerifySecret,
    expiresIn: env.jwt.emailVerifyExpiresIn,
  });

const generatePasswordResetToken = ({ userId, role }) =>
  signJwt({
    payload: { sub: userId, role },
    secret: env.jwt.passwordResetSecret,
    expiresIn: env.jwt.passwordResetExpiresIn,
  });

/* ---------- DB store ---------- */

const storeToken = async ({ rawToken, userId, type, ttlMs, meta }) => {
  const tokenHash = hashToken(rawToken);

  return Token.create({
    tokenHash,
    type,
    userId,
    expiresAt: getExpiryDate(ttlMs),
    meta,
  });
};

const storeRefreshToken = (data) =>
  storeToken({
    rawToken: data.refreshToken,
    userId: data.userId,
    type: 'REFRESH_TOKEN',
    ttlMs: env.jwt.refreshTtlMs,
    meta: data.meta,
  });

const storeEmailVerificationToken = (data) =>
  storeToken({
    rawToken: data.token,
    userId: data.userId,
    type: 'EMAIL_VERIFY_TOKEN',
    ttlMs: env.jwt.emailVerifyTtlMs,
    meta: data.meta,
  });

const storePasswordResetToken = (data) =>
  storeToken({
    rawToken: data.token,
    userId: data.userId,
    type: 'PASSWORD_RESET_TOKEN',
    ttlMs: env.jwt.passwordResetTtlMs,
    meta: data.meta,
  });

/* ---------- revoke ---------- */

const revokeRefreshToken = ({ tokenHash }) =>
  Token.updateOne(
    { tokenHash, type: 'REFRESH_TOKEN', revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );

const revokeAllUserRefreshTokens = ({ userId }) =>
  Token.updateMany(
    { userId, type: 'REFRESH_TOKEN', revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );

/* ---------- one-time consume ---------- */

const consumeEmailVerificationToken = async ({ token }) => {
  const tokenHash = hashToken(token);
  const doc = await findActiveTokenByHash({
    tokenHash,
    type: 'EMAIL_VERIFY_TOKEN',
  });
  if (!doc) return null;

  await Token.updateOne({ _id: doc._id }, { $set: { revokedAt: new Date() } });
  return doc;
};

const consumePasswordResetToken = async ({ token }) => {
  const tokenHash = hashToken(token);
  const doc = await findActiveTokenByHash({
    tokenHash,
    type: 'PASSWORD_RESET_TOKEN',
  });
  if (!doc) return null;

  await Token.updateOne({ _id: doc._id }, { $set: { revokedAt: new Date() } });
  return doc;
};

/* ---------- JWT verify ---------- */

const verifyRefreshTokenJwt = ({ refreshToken }) =>
  verifyJwt({ token: refreshToken, secret: env.jwt.refreshSecret });

/* ---------- atomic rotation ---------- */

const rotateRefreshToken = async ({ oldRefreshToken, userId, role, meta }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldHash = hashToken(oldRefreshToken);

    const res = await Token.updateOne(
      {
        tokenHash: oldHash,
        type: 'REFRESH_TOKEN',
        revokedAt: null,
        expiresAt: { $gt: new Date() },
      },
      { $set: { revokedAt: new Date() } },
      { session }
    );

    if (res.modifiedCount === 0) {
      throw new Error('Invalid or already used refresh token');
    }

    const newRefreshToken = generateRefreshToken({ userId, role });

    const newHash = hashToken(newRefreshToken);
    await new Token({
      tokenHash: newHash,
      type: 'REFRESH_TOKEN',
      userId,
      expiresAt: getExpiryDate(env.jwt.refreshTtlMs),
      meta,
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    return newRefreshToken;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/* ---------- export API ---------- */

export default {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,

  storeRefreshToken,
  storeEmailVerificationToken,
  storePasswordResetToken,

  findActiveTokenByHash,
  verifyRefreshTokenJwt,

  revokeRefreshToken,
  revokeAllUserRefreshTokens,

  consumeEmailVerificationToken,
  consumePasswordResetToken,

  rotateRefreshToken,
};
