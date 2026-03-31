import nodemailer from 'nodemailer';
import logger from './logger.js';

/**
 * Send email using Nodemailer
 * Gracefully handles missing SMTP configuration
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML body
 * @param {string} [options.text] - Plain text fallback
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, FROM_NAME } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    logger.warn(`⚠️  Email not sent (SMTP not configured). To: ${to}, Subject: ${subject}`);
    logger.info(`Email content would be: ${text || html}`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587'),
      secure: parseInt(SMTP_PORT || '587') === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${FROM_NAME || 'TaskFlow'}" <${FROM_EMAIL || SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`❌ Email send failed: ${error.message}`);
    return false;
  }
};

export default sendEmail;
