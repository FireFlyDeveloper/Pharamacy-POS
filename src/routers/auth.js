const express = require("express");
const { AuthController } = require("../controllers/auth");
const { authenticateToken } = require("../middlewares/jwt");

const router = express.Router();
const auth = new AuthController();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/change-password", authenticateToken, auth.changePassword);

module.exports = router;