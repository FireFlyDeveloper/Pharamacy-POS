const jwt = process.env.JWT_SECRET;
const postgre = process.env.POSTGRESQL;
const admin_username = process.env.admin_username;
const admin_password = process.env.admin_password;
const username = process.env.username;
const password = process.env.password;

function checker() {
  if (
    !jwt ||
    !postgre ||
    !admin_username ||
    !admin_password ||
    !username ||
    !password
  ) {
    console.error("Error: Environment variable is not set.");
    process.exit(1);
  }
}

function isAdmin(user) {
  const admin_username = process.env.admin_username;
  return user && user === admin_username;
}

module.exports = { checker, isAdmin };
