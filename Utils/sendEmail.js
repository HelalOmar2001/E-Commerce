const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter (service that sends email like gmail, mailgun, sendgrid, etc)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // 465 for secure connection (SSL) or 587 for non secure TLS
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define the email options (subject, body, etc)
  const mailOptions = {
    from: "E-shop App <helalomar2001@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
