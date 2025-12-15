const express = require("express");
const { AuthController } = require("../controllers/auth");

const router = express.Router();
const auth = new AuthController();

router.post("/login", auth.login);

module.exports = router;
