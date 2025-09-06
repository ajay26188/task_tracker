// utils/mailer.ts
import nodemailer  from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email verification link to a user.
 * @param email - Recipient's email
 * @param token - JWT token to verify the email
 */

export const sendVerificationEmail = async (email: string, token: string) => {
  // Link user will click
  const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL_DEV;

    const link = `${baseUrl}/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM, 
    to: email,
    subject: "Verify your TaskTracker account",
    html: `
      <h2>Welcome to TaskTracker 👋</h2>
      <p>Thanks for signing up. Please verify your email by clicking below:</p>
      <a href="${link}" style="background:#4f46e5;color:#fff;padding:10px 20px;text-decoration:none;border-radius:8px;">
        Verify Email
      </a>
      <p>If you didn’t sign up, just ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Email could not be sent");
  }
};

/**
 * Send password reset link to a user.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL_PROD
      : process.env.FRONTEND_URL_DEV;

  const link = `${baseUrl}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your TaskTracker password',
    html: `
      <h2>Password Reset Request 🔑</h2>
      <p>You requested to reset your TaskTracker password. Click below to continue:</p>
      <a href="${link}" style="background:#e11d48;color:#fff;padding:10px 20px;text-decoration:none;border-radius:8px;">
        Reset Password
      </a>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Email could not be sent');
  }
};
