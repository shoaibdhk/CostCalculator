const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'a9dbe293ee73a7',
    pass: '96b44d9a7ef210'
  }
})
