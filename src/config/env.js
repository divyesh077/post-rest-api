import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key, defaultValue) => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: Number(getEnv('PORT', 3000)),
  mongodb: {
    uri: getEnv('MONGODB_URI'),
  },
  jwt: {
    accessSecret: getEnv('JWT_ACCESS_SECRET'),
    accessExpiresIn: getEnv('JWT_ACCESS_EXPIRES_IN'),

    refreshSecret: getEnv('JWT_REFRESH_SECRET'),
    refreshExpiresIn: getEnv('JWT_REFRESH_EXPIRES_IN'),

    emailVerifySecret: getEnv('EMAIL_VERIFY_SECRET'),
    emailVerifyExpiresIn: getEnv('EMAIL_VERIFY_EXPIRES_IN'),

    passwordResetSecret: getEnv('PASSWORD_RESET_SECRET'),
    passwordResetExpiresIn: getEnv('PASSWORD_RESET_EXPIRES_IN'),
  },
  smtp: {
    host: getEnv('SMTP_HOST'),
    port: Number(getEnv('SMTP_PORT', 587)),
    security: Number(getEnv('SMTP_PORT', 587)) === 465,
    auth: {
      user: getEnv('SMTP_USER'),
      pass: getEnv('SMTP_PASS'),
    },
    from: getEnv('SMTP_FROM'),
  },
};
