// backend/config/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL.HOST,
  port: process.env.EMAIL.PORT, // SMTP port (587 for TLS/StartTLS)
  secure: false, // true for 465 (SSL), false for other ports
  auth: {
    user: process.env.EMAIL.USER,
    pass: process.env.EMAIL.PASS,
  },
});

module.exports = transporter;
