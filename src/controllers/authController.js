const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Faltan datos' })

    const existing = await User.findByUsername(username)
    if (existing) return res.status(409).json({ error: 'Usuario ya existe' })

    const hash = await bcrypt.hash(password, 10)
    const id = await User.create(username, hash)
    return res.json({ id, username })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error interno' })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findByUsername(username)
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' })

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '8h' })
    return res.json({ token, user: { id: user.id, username: user.username } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error interno' })
  }
}

module.exports = { register, login }
