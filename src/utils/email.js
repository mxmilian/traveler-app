const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // 2) Define the email options
  console.log(options);
  const emailOptions = {
    from: 'Traveller app',
    to: options.email,
    subject: options.subject,
    message: options.message
  };

  // 3) Actually send the email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
