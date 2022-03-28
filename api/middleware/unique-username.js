const User = require('../user/user-model')

module.exports = async function (req, res, next) {
    const { username } = req.body
    const user = await User.getByUsername(username)

    if (user) {
        res.status(400).json({message: 'username taken'})
    } else {
        next()
    }
}