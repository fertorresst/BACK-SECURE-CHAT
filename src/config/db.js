const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  port: process.env.DB_PORT || 3306
})

const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('\n✅ Base de datos conectada exitosamente')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message)
    throw error
  }
}

module.exports = { pool, testConnection }
