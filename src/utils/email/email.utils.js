import nodemailer from 'nodemailer';
import EMAIL_CFG from '../../config/email.config.js';

const mailOptions = (to, subject, html) => ({
    from: EMAIL_CFG.ACCOUNT,
    html,
    subject,
    to
  })
  
  const transporter = nodemailer.createTransport({
    auth: {
      pass: EMAIL_CFG.PASS,
      user: EMAIL_CFG.ACCOUNT
    },
    port: EMAIL_CFG.PORT,
    service: EMAIL_CFG.SERVICE
  })
  
export { mailOptions, transporter };

