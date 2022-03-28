const jwt = require('jsonwebtoken')
const secret = process.env.SECRET || 'the secret'

module.exports = (req, res, next) => {
  next();
  const token = req.headers.authorization

  if (!token) {
    res.status(401).json({ message: 'token required' })
    return;
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).json({message: 'token invalid'})
    } else {
      req.token = decoded
      next()
    }
  })
};
