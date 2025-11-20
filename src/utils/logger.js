const logger = {
  info: (message, data = null) => {
    if (data) {
      console.log(`ℹ️  ${message}`, data)
    } else {
      console.log(`ℹ️  ${message}`)
    }
  },

  success: (message, data = null) => {
    if (data) {
      console.log(`✅ ${message}`, data)
    } else {
      console.log(`✅ ${message}`)
    }
  },

  error: (message, error = null) => {
    console.error(`❌ ${message}`)
    if (error && error.stack) {
      console.error(error.stack)
    }
  },

  warn: (message, data = null) => {
    if (data) {
      console.warn(`⚠️  ${message}`, data)
    } else {
      console.warn(`⚠️  ${message}`)
    }
  }
}

module.exports = logger
