require('dotenv').config()
const fs = require('fs')
const https = require('https')
const app = require('./app')
const socketio = require('socket.io')
const { testConnection } = require('./src/config/db')

const PORT = process.env.PORT || 3001
const certsDir = './certs'

if (!fs.existsSync(`${certsDir}/server.key`) || !fs.existsSync(`${certsDir}/server.crt`)) {
  console.error('Faltan certificados en ./certs. Copia server.key y server.crt desde secure-certificates/server/')
  process.exit(1)
}

const options = {
  key: fs.readFileSync(`${certsDir}/server.key`),
  cert: fs.readFileSync(`${certsDir}/server.crt`),
  ca: fs.existsSync(`${certsDir}/ca.crt`) ? fs.readFileSync(`${certsDir}/ca.crt`) : undefined,
  requestCert: false
}

const server = https.createServer(options, app)

// socket.io sobre HTTPS (WSS)
const io = socketio(server, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
})

// validar JWT en handshake
io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token
  if (!token) return next(new Error('no token'))
  try {
    const jwt = require('jsonwebtoken')
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    socket.user = { id: payload.id, username: payload.username }
    next()
  } catch (err) {
    next(new Error('invalid token'))
  }
})

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.user.username)
  io.emit('mensaje', JSON.stringify({ user: 'system', text: `${socket.user.username} se ha unido.`, ts: Date.now() }))

  socket.on('mensaje', (msg) => {
    const payload = { user: socket.user.username, text: msg, ts: Date.now() }
    io.emit('mensaje', JSON.stringify(payload))
  })

  socket.on('disconnect', () => {
    io.emit('mensaje', JSON.stringify({ user: 'system', text: `${socket.user.username} se ha desconectado.`, ts: Date.now() }))
  })
})

// Iniciar servidor después de validar DB
const startServer = async () => {
  try {
    await testConnection()
    server.listen(PORT, () => console.log(`✅ Server HTTPS+WSS en https://localhost:${PORT}`))
  } catch (error) {
    console.error('No se pudo iniciar el servidor debido a error en DB')
    process.exit(1)
  }
}

startServer()
