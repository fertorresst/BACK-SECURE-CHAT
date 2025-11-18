const express = require('express')
const cors = require('cors')
const authRoutes = require('./src/routes/authRoutes')

const app = express()

app.use(cors({
  origin: "https://localhost:3000",
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => res.send('Secure chat backend'))

module.exports = app
