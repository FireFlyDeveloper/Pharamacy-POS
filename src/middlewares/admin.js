function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.username !== process.env.admin_username) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}

module.exports = { authorizeAdmin };
