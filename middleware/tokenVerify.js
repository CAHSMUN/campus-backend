const jwt = require('jsonwebtoken');

// function to verify auth token
module.exports = function (req, res, next) {
    const token = req.header('auth-token'); // checks if there is this header
    if(!token) return res.status(401).send('Not authorized');

    try { 
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.tokenData = verified;
    } catch (error) {
        res.status(400).send('Invalid token');
    }
    next();
}