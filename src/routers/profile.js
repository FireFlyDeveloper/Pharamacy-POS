const express = require("express");
const { authenticateToken } = require("../middlewares/jwt");
const { isAdmin } = require("../helpers/checker");

const router = express.Router();

router.get("/", authenticateToken, (req, res) => {
  const admin = isAdmin(req.user.username);
  return res.status(200).json({ isAdmin: admin });
});

module.exports = router;
