import jwt from 'jsonwebtoken';

export const signJwt = ({ payload, secret, expiresIn }) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyJwt = ({ token, secret }) => {
  return jwt.verify(token, secret);
};
