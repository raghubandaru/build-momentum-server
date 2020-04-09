const { clearHash } = require('../utils')

module.exports = async (req, res, next) => {
  await next()

  clearHash(req.user._id)
}
