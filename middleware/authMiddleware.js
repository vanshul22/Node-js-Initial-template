// authMiddleware.js
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    // Get the token from the request headers or query parameters.
    const token = req.headers['auth-token'] || req.query.token;

    if (!token) return res.status(401).json({ error: 'Unauthorized: Token Missing' });

    // Verify the token
    jwt.verify(token, jwtSecretKey, (err, user) => {
        if (err) return res.status(403).json({ error: err.message });

        req.user = { userId: user.userId }; // Attach the user object to the request for later use
        next();
    });
}

module.exports = authenticateToken;