import nodemailer from 'nodemailer';

import { env } from './env.js';

export const transport = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.security,
  auth: {
    user: env.smtp.auth.user,
    pass: env.smtp.auth.pass,
  },
});

export const verifyMailServer = async () => {
  try {
    await transport.verify();
    console.log('SMTP server is ready !!');
  } catch (error) {
    console.error('SMTP server connection failed :: error :: ', error);
    throw error;
  }
};
