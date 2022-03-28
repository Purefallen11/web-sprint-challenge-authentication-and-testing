const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const router = require('express').Router();


const User = require('../user/user-model')

const secret = process.env.SECRET || 'the secret'


router.post('/register', async (req, res) => {
  res.end('implement register, please!');
  
  try {
    const { username, password } = req.body
    const newUser = await User.insert({
      username, password: bcrypt.hashSync(password, 8)
    })
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
});

router.post('/login', async (req, res) => {
  try {
    const { body: { password }, user } = req
    if (bcrypt.compareSync(password, user.password)) {
      res.json({message: `welcome, ${user.username}`, token: generateToken(user)})
    } else {
      res.status(401).json({message: 'invalid credentials'})
    }
  } catch (err) {
    res.status(500).json({message: err.message})
  }
  
});

module.exports = router;
