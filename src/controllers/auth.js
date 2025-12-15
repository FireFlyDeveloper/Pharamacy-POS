const { compare } = require("../helpers/hash");
const { login } = require("../models/auth");
const { generate } = require("../helpers/jwt");

class AuthController {
  async login(req, res) {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password required" });

    try {
      const result = await login(username);

      if (result.length === 0)
        return res
          .status(400)
          .json({ message: "Invalid username or password" });

      const user = result;

      const match = await compare(password, user.password);
      if (!match)
        return res
          .status(400)
          .json({ message: "Invalid username or password" });

      const token = generate({ id: user.role, username: user.username });

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = { AuthController };
