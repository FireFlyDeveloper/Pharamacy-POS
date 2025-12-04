const { hash, compare } = require("../helpers/hash");
const { register, login, getCurrentUser, updatePassword } = require("../models/auth");
const { generate } = require("../helpers/jwt");

class AuthController {
    async register(req, res) {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ message: "Username and password required" });

        try {
            const hashedPassword = await hash(password);

            const result = await register(username, hashedPassword);

            res.status(201).json({ user: result });
        } catch (err) {
            if (err.code === "23505") {
                res.status(400).json({ message: "Username already exists" });
            } else {
                console.error(err);
                res.status(500).json({ message: "Server error" });
            }
        }
    }

    async login(req, res) {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ message: "Username and password required" });

        try {
            const result = await login(username);

            if (result.length === 0)
                return res.status(400).json({ message: "Invalid username or password" });

            const user = result;

            const match = await compare(password, user.password);
            if (!match) return res.status(400).json({ message: "Invalid username or password" });

            const token = generate({ id: user.id, username: user.username });

            res.json({ token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }

    async changePassword(req, res) {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword)
            return res.status(400).json({ message: "Old and new password required" });

        try {
            const user = await getCurrentUser(req.user.id);
            const match = await compare(oldPassword, user.password);

            if (!match) return res.status(400).json({ message: "Old password is incorrect" });

            const hashedNewPassword = await hash(newPassword);
            await updatePassword(hashedNewPassword, req.user.id);

            res.json({ message: "Password changed successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = { AuthController };