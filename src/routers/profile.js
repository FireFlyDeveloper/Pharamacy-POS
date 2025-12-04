const express = require("express");
const { authenticateToken } = require("../middlewares/jwt");

const router = express.Router();

router.get("/", authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}`, user: req.user });
});

module.exports = router;
