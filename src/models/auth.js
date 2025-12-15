const { hash } = require("../helpers/hash");

async function login(username) {
  const admin = process.env.admin_username;
  const staff = process.env.username;

  let result = null;

  if (username === admin) {
    const password = process.env.admin_password;
    const hashedPassword = await hash(password);

    result = {
      role: "admin",
      username: admin,
      password: hashedPassword,
    };
  } else if (username === staff) {
    const staff_pass = process.env.password;
    const hashedStaffPass = await hash(staff_pass);

    result = {
      role: "staff",
      username: staff,
      password: hashedStaffPass,
    };
  }

  return result;
}

module.exports = { login };
