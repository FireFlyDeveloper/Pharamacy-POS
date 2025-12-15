const pool = require("../database/PostgreSQL");

async function createSalesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit_price NUMERIC(10,2) NOT NULL,
      total_price NUMERIC(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("Sales table ready");
}

async function initTables() {
  await createSalesTable();
}

function getPagination(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return { limit, offset };
}

async function buildPaginatedResponse({
  whereClause,
  whereParams,
  page,
  limit,
}) {
  const { offset } = getPagination(page, limit);

  const totalsQuery = `
    SELECT
      COUNT(*)::INT AS total_transaction,
      COALESCE(SUM(s.total_price), 0)::NUMERIC AS total_sales
    FROM sales s
    ${whereClause}
  `;

  const dataQuery = `
    SELECT
      s.*,
      p.name AS product_name,
      p.sku,
      p.category
    FROM sales s
    JOIN products p ON p.id = s.product_id
    ${whereClause}
    ORDER BY s.created_at DESC
    LIMIT $${whereParams.length + 1}
    OFFSET $${whereParams.length + 2}
  `;

  const totalsResult = await pool.query(totalsQuery, whereParams);
  const dataResult = await pool.query(dataQuery, [
    ...whereParams,
    limit,
    offset,
  ]);

  const totalTransaction = totalsResult.rows[0].total_transaction;
  const totalSales = totalsResult.rows[0].total_sales;

  return {
    total_sales: Number(totalSales),
    total_transaction: totalTransaction,
    sales: {
      hasNextPage: offset + dataResult.rows.length < totalTransaction,
      limit,
      data: dataResult.rows,
    },
  };
}

async function getDailySales(date, page = 1, limit = 20) {
  return buildPaginatedResponse({
    whereClause: `WHERE DATE(s.created_at) = DATE($1)`,
    whereParams: [date],
    page,
    limit,
  });
}

async function getWeeklySales(page = 1, limit = 20) {
  return buildPaginatedResponse({
    whereClause: `WHERE s.created_at >= NOW() - INTERVAL '7 days'`,
    whereParams: [],
    page,
    limit,
  });
}

async function getMonthlySales(month, year, page = 1, limit = 20) {
  return buildPaginatedResponse({
    whereClause: `
      WHERE EXTRACT(MONTH FROM s.created_at) = $1
        AND EXTRACT(YEAR FROM s.created_at) = $2
    `,
    whereParams: [month, year],
    page,
    limit,
  });
}

async function getAnnualSales(year, page = 1, limit = 20) {
  return buildPaginatedResponse({
    whereClause: `WHERE EXTRACT(YEAR FROM s.created_at) = $1`,
    whereParams: [year],
    page,
    limit,
  });
}

async function getSalesByDateRange(startDate, endDate, page = 1, limit = 20) {
  return buildPaginatedResponse({
    whereClause: `WHERE s.created_at BETWEEN $1 AND $2`,
    whereParams: [startDate, endDate],
    page,
    limit,
  });
}

async function addSale({ product_id, quantity }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const productResult = await client.query(
      `SELECT price, stock
       FROM products
       WHERE id = $1 AND is_archived = FALSE`,
      [product_id],
    );

    if (productResult.rowCount === 0) {
      throw new Error("Product not found or archived");
    }

    const { price, stock } = productResult.rows[0];

    if (stock < quantity) {
      throw new Error("Insufficient stock");
    }

    const totalPrice = price * quantity;

    await client.query(
      `UPDATE products
       SET stock = stock - $1,
           updated_at = NOW()
       WHERE id = $2`,
      [quantity, product_id],
    );

    const saleResult = await client.query(
      `INSERT INTO sales (product_id, quantity, unit_price, total_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [product_id, quantity, price, totalPrice],
    );

    await client.query("COMMIT");
    return saleResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function addBulkSales(sales) {
  if (!Array.isArray(sales) || sales.length === 0) {
    throw new Error("Sales must be a non-empty array");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const insertedSales = [];

    for (const { product_id, quantity } of sales) {
      const productResult = await client.query(
        `SELECT price, stock
         FROM products
         WHERE id = $1 AND is_archived = FALSE`,
        [product_id],
      );

      if (productResult.rowCount === 0) {
        throw new Error(`Product ${product_id} not found or archived`);
      }

      const { price, stock } = productResult.rows[0];

      if (stock < quantity) {
        throw new Error(`Insufficient stock for product ${product_id}`);
      }

      const totalPrice = price * quantity;

      await client.query(
        `UPDATE products
         SET stock = stock - $1,
             updated_at = NOW()
         WHERE id = $2`,
        [quantity, product_id],
      );

      const saleResult = await client.query(
        `INSERT INTO sales (product_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [product_id, quantity, price, totalPrice],
      );

      insertedSales.push(saleResult.rows[0]);
    }

    await client.query("COMMIT");
    return insertedSales;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  initTables,
  addSale,
  addBulkSales,
  getDailySales,
  getWeeklySales,
  getMonthlySales,
  getAnnualSales,
  getSalesByDateRange,
};
