const sgMail = require('@sendgrid/mail')

const sendgridAPIkey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIkey)

function sendResetPasswordEmail(email, link, name) {
  sgMail.send({
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'Build Momentum Account Reset Password',
    html: `<p>Hi ${name},</p>
    <p>Your reset password link is here <a href=${link}>Click here to reset password</a><p>
    <p>For security purposes above link is valid only for just an hour.</p>
    `
  })
}

module.exports = {
  sendResetPasswordEmail
}
