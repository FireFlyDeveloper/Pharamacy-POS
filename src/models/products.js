const pool = require("../database/PostgreSQL");

async function createProductTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      sku TEXT UNIQUE,
      category TEXT,
      supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      price NUMERIC(10,2) NOT NULL,
      expiry_date DATE,
      is_archived BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("Products table ready");
}

async function initTables() {
  await createProductTable();
}

async function addProduct({
  name,
  sku,
  category,
  supplier_id,
  stock = 0,
  price,
  expiry_date = null,
}) {
  const result = await pool.query(
    `INSERT INTO products (name, sku, category, supplier_id, stock, price, expiry_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, sku, category, supplier_id, stock, price, expiry_date],
  );
  return result.rows[0];
}

async function updateProduct(
  id,
  { name, category, supplier_id, stock, price },
) {
  const result = await pool.query(
    `UPDATE products
     SET name = $1,
         category = $2,
         supplier_id = $3,
         stock = $4,
         price = $5,
         updated_at = NOW()
     WHERE id = $6 AND is_archived = FALSE
     RETURNING *`,
    [name, category, supplier_id, stock, price, id],
  );
  return result.rows[0];
}

async function archiveProduct(id) {
  const result = await pool.query(
    `DELETE FROM products
     WHERE id = $1
     RETURNING *`,
    [id],
  );
  return result.rows[0];
}

async function getProductBySKUOrName(query) {
  const result = await pool.query(
    `SELECT * FROM products
     WHERE (sku = $1 OR LOWER(name) LIKE LOWER($2)) 
       AND is_archived = FALSE`,
    [query, `%${query}%`],
  );
  return result.rows;
}

async function getProducts({ page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;

  const dataResult = await pool.query(
    `SELECT *
     FROM products
     WHERE is_archived = FALSE
     ORDER BY name
     LIMIT $1 OFFSET $2`,
    [limit + 1, offset],
  );

  const hasNextPage = dataResult.rows.length > limit;
  const products = hasNextPage
    ? dataResult.rows.slice(0, limit)
    : dataResult.rows;

  return {
    data: products,
    next_page: hasNextPage,
  };
}

async function getInventorySummary() {
  const totalResult = await pool.query(
    `SELECT COUNT(*) AS total FROM products WHERE is_archived = FALSE`,
  );
  const totalProducts = parseInt(totalResult.rows[0].total, 10);

  const lowStockResult = await pool.query(
    `SELECT * FROM products WHERE is_archived = FALSE AND stock <= 10 ORDER BY stock ASC`,
  );
  const lowStockCount = lowStockResult.rows.length;

  const expiredResult = await pool.query(
    `SELECT * FROM products WHERE is_archived = FALSE AND expiry_date IS NOT NULL AND expiry_date < NOW() ORDER BY expiry_date ASC`,
  );
  const expiredCount = expiredResult.rows.length;

  const soonToExpireResult = await pool.query(
    `SELECT * FROM products
     WHERE is_archived = FALSE
       AND expiry_date IS NOT NULL
       AND expiry_date <= NOW() + INTERVAL '30 days'
       AND expiry_date >= NOW()
     ORDER BY expiry_date ASC`,
  );

  const valueResult = await pool.query(
    `SELECT SUM(stock * price) AS total_value FROM products WHERE is_archived = FALSE`,
  );
  const inventoryValue = parseFloat(valueResult.rows[0].total_value || 0);

  return {
    summary: {
      total_products: totalProducts,
      low_stock: lowStockCount,
      expired: expiredCount,
      inventory_value: `₱${inventoryValue.toFixed(2)}`,
    },
    details: {
      expired_medicines: expiredCount
        ? expiredResult.rows
        : "No expired medicines.",
      low_stock_items: lowStockCount
        ? lowStockResult.rows
        : "No low stock items.",
      soon_to_expire: soonToExpireResult.rows.length
        ? soonToExpireResult.rows
        : "No medicines expiring soon.",
    },
  };
}

module.exports = {
  initTables,
  addProduct,
  updateProduct,
  archiveProduct,
  getProductBySKUOrName,
  getProducts,
  getInventorySummary,
};
