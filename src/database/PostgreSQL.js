const pg = require("pg");

const pool = new pg.Pool({
  connectionString: process.env.POSTGRESQL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;