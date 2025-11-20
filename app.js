const express = require('express')
const cors = require('cors')
const authRoutes = require('./src/routes/authRoutes')
const { CORS_ORIGINS } = require('./src/config/constants')
const logger = require('./src/utils/logger')

const app = express()

app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true
}))
app.use(express.json())

app.use('/api', authRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Secure Chat API', version: '1.0.0' })
})

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  logger.error('Error no manejado', err)
  res.status(500).json({ error: 'Error del servidor' })
})

module.exports = app
