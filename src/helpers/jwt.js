const jwt = require("jsonwebtoken");

const jwt_secret = process.env.JWT_SECRET;

function verify(token, req) {
    jwt.verify(token, jwt_secret, (err, user) => {
        if (err) return false;

        req.user = user;
        return true;
    });
}

function generate(options) {
    const token = jwt.sign(options, jwt_secret, { expiresIn: "1d" });

    return token;
}

module.exports = { verify, generate };