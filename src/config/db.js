const mysql = require('mysql2/promise')
const logger = require('../utils/logger')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: process.env.DB_PORT || 3306
})

const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    logger.success('Base de datos conectada exitosamente')
    connection.release()
    return true
  } catch (error) {
    logger.error('Error al conectar con la base de datos', error)
    throw error
  }
}

module.exports = { pool, testConnection }
