require('dotenv').config()
const fs = require('fs')
const https = require('https')
const app = require('./app')
const { testConnection } = require('./src/config/db')
const { initializeSocket } = require('./src/config/socket')
const { PORT, CERTS_DIR, SSL_CONFIG } = require('./src/config/constants')
const { verifyCertificates } = require('./src/middleware/certValidation')
const logger = require('./src/utils/logger')

// Verificar certificados SSL
if (!fs.existsSync(`${CERTS_DIR}/server.key`) || !fs.existsSync(`${CERTS_DIR}/server.crt`)) {
  logger.error('Faltan certificados SSL en ./certs')
  process.exit(1)
}

// Verificar validez de certificados
try {
  verifyCertificates(CERTS_DIR)
} catch (error) {
  logger.error('Error al verificar certificados', error)
  process.exit(1)
}

// Configuración HTTPS
const httpsOptions = {
  key: fs.readFileSync(`${CERTS_DIR}/server.key`),
  cert: fs.readFileSync(`${CERTS_DIR}/server.crt`),
  ca: fs.existsSync(`${CERTS_DIR}/ca.crt`) ? fs.readFileSync(`${CERTS_DIR}/ca.crt`) : undefined,
  requestCert: SSL_CONFIG.REQUEST_CERT,
  rejectUnauthorized: SSL_CONFIG.REJECT_UNAUTHORIZED
}

const server = https.createServer(httpsOptions, app)

// Inicializar WebSocket
initializeSocket(server)

// Iniciar servidor
const startServer = async () => {
  try {
    await testConnection()
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Puerto ${PORT} ya está en uso`)
      } else {
        logger.error('Error del servidor', err)
      }
      process.exit(1)
    })
    
    server.listen(PORT, () => {
      logger.success(`Servidor HTTPS+WSS ejecutándose en puerto ${PORT}`)
    })
  } catch (error) {
    logger.error('No se pudo iniciar el servidor', error)
    process.exit(1)
  }
}

startServer()
