const validateCredentials = (username, password) => {
  const errors = []

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.push('El username es requerido')
  } else if (username.length < 3) {
    errors.push('El username debe tener al menos 3 caracteres')
  } else if (username.length > 50) {
    errors.push('El username no puede exceder 50 caracteres')
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.push('La contraseña es requerida')
  } else if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

module.exports = { validateCredentials }
