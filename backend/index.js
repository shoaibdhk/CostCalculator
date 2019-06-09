const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const server = require('./src/server')

server.express.use(cookieParser())

server.express.use((req, res, next) => {
  let token = req.cookies.token
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)

    req.userId = userId
  }
  next()
})

server.express.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://costcalculator-prod.herokuapp.com/')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
server.start(
  {
    port: process.env.PORT,
    debug: false,
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  ({ port }) => {
    console.log(`GraphQL server working at http://localhost:${port}`)
  }
)
