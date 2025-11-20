const fs = require('fs')
const logger = require('../utils/logger')

/**
 * Middleware para validar certificados SSL/TLS del cliente
 */
const validateCertificate = (req, res, next) => {
  const cert = req.socket.getPeerCertificate()

  // Si no hay certificado del cliente y se requiere
  if (!cert || Object.keys(cert).length === 0) {
    logger.warn('Cliente sin certificado intentó conectar')
    // Si quieres requerir certificado, descomenta la siguiente línea:
    // return res.status(401).json({ error: 'Certificado de cliente requerido' })
    return next()
  }

  logger.info('Certificado del cliente recibido:', {
    subject: cert.subject,
    issuer: cert.issuer,
    valid_from: cert.valid_from,
    valid_to: cert.valid_to,
    fingerprint: cert.fingerprint
  })

  // Validar que el certificado no ha expirado
  const now = new Date()
  const validFrom = new Date(cert.valid_from)
  const validTo = new Date(cert.valid_to)

  if (now < validFrom || now > validTo) {
    logger.error('Certificado expirado o aún no válido')
    return res.status(401).json({ error: 'Certificado expirado o aún no válido' })
  }

  // Validar el Common Name (CN)
  const expectedCN = 'localhost' // Cambiar según tu configuración
  if (cert.subject.CN !== expectedCN) {
    logger.warn(`Common Name incorrecto. Esperado: ${expectedCN}, Recibido: ${cert.subject.CN}`)
    // Descomenta para rechazar:
    // return res.status(401).json({ error: 'Common Name del certificado no coincide' })
  }

  // Validar el emisor (CA)
  logger.info('Emisor del certificado:', cert.issuer)

  next()
}

/**
 * Verifica la validez de los certificados del servidor al inicio
 */
const verifyCertificates = (certDir) => {
  const certPath = `${certDir}/server.crt`
  const keyPath = `${certDir}/server.key`
  const caPath = `${certDir}/ca.crt`

  // Verificar que existen los archivos
  if (!fs.existsSync(certPath)) {
    throw new Error(`Certificado no encontrado: ${certPath}`)
  }
  if (!fs.existsSync(keyPath)) {
    throw new Error(`Llave privada no encontrada: ${keyPath}`)
  }

  logger.success('Certificados del servidor verificados')
  
  if (fs.existsSync(caPath)) {
    logger.info('CA del servidor encontrada')
  } else {
    logger.warn('CA del servidor no encontrada (opcional)')
  }

  return true
}

module.exports = { validateCertificate, verifyCertificates }
