import { env } from '../config/env.js';
import { transport } from '../config/smtp.js';

const sendMail = async ({ to, subject, html, text, attachments }) => {
  const mailOptions = {
    from: env.smtp.from,
    to,
    subject,
    html,
    text,
    attachments,
  };
  try {
    const info = await transport.sendMail(mailOptions);
    console.log('email.service :: sendMail :: message sent :: ', info.messageId);
    return info;
  } catch (error) {
    console.error('email.service :: sendMail :: error :: ', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const subject = 'Welcome to Post App';

    const html = `
    <h1>Welcome ${userName}</h1>
    <p>Your account successfuly created.</p>
    `;
    const text = `Welcome ${userName} Your account successfuly created.`;

    await sendMail({ to: userEmail, subject, html, text });
  } catch (error) {
    console.error('email.service :: sendWelcomeEmail :: error :: ', error);
    throw error;
  }
};

export const sendEmailVerification = async (userEmail, verifyLink) => {
  try {
    const subject = 'Verify your email address';

    const html = `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyLink}">${verifyLink}</a>
      <p>This link can be used only once.</p>
    `;
    const text = `${verifyLink}`;

    await sendMail({ to: userEmail, subject, html, text });
  } catch (error) {
    console.error('email.service :: sendEmailVerification :: error :: ', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (userEmail, resetLink) => {
  try {
    const subject = 'Reset your password';

    const html = `
      <h2>Password Reset</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to set a new password (valid for limited time):</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, you can ignore this email.</p>
    `;
    const text = `${resetLink}`;
    await sendMail({ to: userEmail, subject, html, text });
  } catch (error) {
    console.error('email.service :: sendPasswordResetEmail :: error :: ', error);
    throw error;
  }
};
