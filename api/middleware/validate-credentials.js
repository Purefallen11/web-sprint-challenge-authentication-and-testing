module.exports = function (req, res, next) {
    if (
        !req.body.username ||
        !req.body.password ||
        (typeof req.body.username !== 'string') ||
        (typeof req.body.password !== 'string') ||
        (req.body.username.length < 2) ||
        (req.body.password.length < 2)
    ) {
        req.status(400).json({message: 'username and password required'})
    } else {
        next()
    }
}