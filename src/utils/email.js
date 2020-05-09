const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `Traveler app <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //SEND GRID
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendTemplate(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        name: this.name,
        url: this.url,
        subject
      }
    );

    // 2) Define email option
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send the email
    await this.newTransport().sendMail(emailOptions);
  }

  async sendConfirm() {
    await this.sendTemplate('confirm', 'Confirm email, and Welcome! 💜');
  }

  async sendPasswordReset() {
    await this.sendTemplate(
      'passwordReset',
      'Reset your password without problems! 💜 (Your token is valid 10 minutes)'
    );
  }
}

module.exports = Email;
