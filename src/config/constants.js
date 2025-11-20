module.exports = {
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: '8h',
  BCRYPT_ROUNDS: 10,
  CORS_ORIGINS: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://192.168.1.23:3000'
  ],
  CERTS_DIR: process.env.CERTS_DIR || './certs',
  
  // Configuración de certificados SSL/TLS
  SSL_CONFIG: {
    // Solicitar certificado del cliente (false = no requerir)
    REQUEST_CERT: process.env.SSL_REQUEST_CERT === 'true',
    
    // Rechazar clientes sin certificado válido (solo si REQUEST_CERT es true)
    REJECT_UNAUTHORIZED: process.env.SSL_REJECT_UNAUTHORIZED === 'true',
    
    // Validar Common Name del certificado
    VALIDATE_CN: process.env.SSL_VALIDATE_CN === 'true'
  }
}
