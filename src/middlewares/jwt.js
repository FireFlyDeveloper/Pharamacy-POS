const { verify } = require("../helpers/jwt");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split("Bearer ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const isValid = verify(token);

    if (!isValid) return res.status(403).json({ message: "Invalid token" });

    req.user = isValid;
    next();
}

module.exports = { authenticateToken };