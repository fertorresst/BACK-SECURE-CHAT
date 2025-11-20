const authService = require('../services/authService')
const logger = require('../utils/logger')

const register = async (req, res) => {
  try {
    const { username, password } = req.body
    const result = await authService.register(username, password)
    
    logger.success('Usuario registrado', { username: result.username })
    return res.status(201).json(result)
  } catch (err) {
    logger.error('Error en registro', err)
    
    if (err.message.includes('ya existe')) {
      return res.status(409).json({ error: err.message })
    }
    if (err.message.includes('requerido') || err.message.includes('caracteres')) {
      return res.status(400).json({ error: err.message })
    }
    
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const result = await authService.login(username, password)
    
    logger.success('Login exitoso', { username })
    return res.json(result)
  } catch (err) {
    logger.error('Error en login', err)
    
    if (err.message.includes('inválidas') || err.message.includes('Credenciales')) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }
    if (err.message.includes('requerido') || err.message.includes('caracteres')) {
      return res.status(400).json({ error: err.message })
    }
    
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

module.exports = { register, login }
