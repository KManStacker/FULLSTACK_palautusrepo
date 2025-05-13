require('dotenv').config()

const PORT = process.env.PORT
if (!PORT) {
    console.error('PORT not defined in .env')
}

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
if (!MONGODB_URI) {
    console.error('MONGODB_URI not defined in .env')
}

const SECRET = process.env.SECRET
if (!SECRET) {
    console.error('SECRET not defined in .env')
}

module.exports = { PORT, MONGODB_URI }