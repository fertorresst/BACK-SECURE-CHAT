const socketio = require('socket.io')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, CORS_ORIGINS } = require('./constants')
const logger = require('../utils/logger')

const initializeSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: CORS_ORIGINS,
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  // Middleware de autenticación JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) {
      return next(new Error('No se proporcionó token'))
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET)
      socket.user = { id: payload.id, username: payload.username }
      next()
    } catch (err) {
      next(new Error('Token inválido'))
    }
  })

  io.on('connection', (socket) => {
    logger.info(`Usuario conectado: ${socket.user.username}`)
    
    io.emit('mensaje', JSON.stringify({
      user: 'system',
      text: `${socket.user.username} se ha unido`,
      ts: Date.now()
    }))

    socket.on('mensaje', (msg) => {
      const payload = {
        user: socket.user.username,
        text: msg,
        ts: Date.now()
      }
      io.emit('mensaje', JSON.stringify(payload))
    })

    socket.on('disconnect', () => {
      logger.info(`Usuario desconectado: ${socket.user.username}`)
      io.emit('mensaje', JSON.stringify({
        user: 'system',
        text: `${socket.user.username} se ha desconectado`,
        ts: Date.now()
      }))
    })
  })

  return io
}

module.exports = { initializeSocket }
