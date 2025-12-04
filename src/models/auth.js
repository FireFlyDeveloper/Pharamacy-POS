const pool = require("../database/PostgreSQL");

async function register(username, password) {
    const result = await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
        [username, password]
    );

    return result.rows[0];
}

async function login(username) {
    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);

    return result.rows[0];
}

async function getCurrentUser(id) {
    const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    return result.rows[0];
}

async function updatePassword(hashedNewPassword, id) {
    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hashedNewPassword, id]);
}

module.exports = { register, login, getCurrentUser, updatePassword }; 