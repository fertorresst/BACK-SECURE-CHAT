const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS } = require('../config/constants')
const { validateCredentials } = require('../utils/validators')

class AuthService {
  async register(username, password) {
    const validation = validateCredentials(username, password)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }

    const existing = await User.findByUsername(username.trim())
    if (existing) {
      throw new Error('Usuario ya existe')
    }

    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    const id = await User.create(username.trim(), hash)
    
    return { id, username: username.trim() }
  }

  async login(username, password) {
    const validation = validateCredentials(username, password)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }

    const user = await User.findByUsername(username.trim())
    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas')
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    return {
      token,
      user: {
        id: user.id,
        username: user.username
      }
    }
  }
}

module.exports = new AuthService()
