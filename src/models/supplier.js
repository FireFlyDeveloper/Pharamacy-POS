const pool = require("../database/PostgreSQL");

async function createSupplierTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      contact TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("Suppliers table ready");
}

async function initTables() {
  await createSupplierTable();
}

async function addSupplier({ name, contact }) {
  const result = await pool.query(
    `INSERT INTO suppliers (name, contact)
     VALUES ($1, $2)
     RETURNING *`,
    [name, contact],
  );
  return result.rows[0];
}

async function updateSupplier(id, { name, contact }) {
  const result = await pool.query(
    `UPDATE suppliers
     SET name = $1,
         contact = $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [name, contact, id],
  );
  return result.rows[0];
}

async function deleteSupplier(id) {
  const result = await pool.query(
    `DELETE FROM suppliers
     WHERE id = $1
     RETURNING *`,
    [id],
  );
  return result.rows[0];
}

async function getSuppliers() {
  const result = await pool.query(
    `SELECT * FROM suppliers
     ORDER BY name`,
  );
  return result.rows;
}

module.exports = {
  initTables,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSuppliers,
};
