const pg = require("pg");

const pool = new pg.Pool({
  connectionString: process.env.POSTGRESQL,
  ssl: true,
});

module.exports = pool;
