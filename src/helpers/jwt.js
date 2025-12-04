const jwt = require("jsonwebtoken");

const jwt_secret = process.env.JWT_SECRET;

function verify(token) {
    try {
        const result = jwt.verify(token, jwt_secret);
        return result;
    } catch {
        return false;
    }
}

function generate(options) {
    const token = jwt.sign(options, jwt_secret, { expiresIn: "1d" });

    return token;
}

module.exports = { verify, generate };