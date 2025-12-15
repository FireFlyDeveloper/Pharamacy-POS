const bcrypt = require("bcrypt");

async function hash(password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
}

async function compare(password, hashedPassword) {
  const match = await bcrypt.compare(password, hashedPassword);

  return match;
}

module.exports = { hash, compare };
