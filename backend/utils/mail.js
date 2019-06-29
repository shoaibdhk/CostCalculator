const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'a9dbe293ee73a7',
    pass: '96b44d9a7ef210'
  }
})

module.exports = {
  async sendWelcomeEmail(user, request) {
    let mailOptions = {
      to: user.email,
      from: 'shoaib@shoaibsharif.me',
      subject: 'Welcome to CostCalculator App',
      html: `
        <div> Hello ${user.name} </div>
        <div> in order to continue in our Apps, <a href='${request.headers.origin}/validateEmail?validateEmailToken=${user.validEmailToken}'>please click to validate your email</a> </div>
      `
    }
    return transport.sendMail(mailOptions)
  },
  sendForgetPassword(uniqueId, email, request) {
    var mailOptions = {
      to: email,
      from: 'naperg@naperg.io',
      subject: 'Forget Password - CostCalculator APP',
      html: `
      <div>hello</div>
      <div>Please find link to reset your password.
         ${request.headers.origin}/resetPassword?resetPasswordToken=${uniqueId}
      </div>
    `
    }
    transport.sendMail(mailOptions, function(err) {
      if (err) {
        console.log(err)
      }
    })
  }
}
