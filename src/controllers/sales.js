const {
  initTables,
  addSale,
  getDailySales,
  getWeeklySales,
  getMonthlySales,
  getAnnualSales,
  getSalesByDateRange,
  addBulkSales,
} = require("../models/sales");

const createTable = async () => {
  await initTables();
};

createTable().catch((err) => {
  console.error("Error initializing tables:", err);
});

class SalesController {
  async getDailySales(req, res) {
    const { date } = req.params;
    const { page, limit } = req.query;
    try {
      const sales = await getDailySales(date, page || 1, limit || 20);
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWeeklySales(req, res) {
    try {
      const { page, limit } = req.query;
      const sales = await getWeeklySales(page || 1, limit || 20);
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMonthlySales(req, res) {
    const { month, year } = req.params;
    const { page, limit } = req.query;
    try {
      const sales = await getMonthlySales(month, year, page || 1, limit || 20);
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAnnualSales(req, res) {
    const { year } = req.params;
    const { page, limit } = req.query;
    try {
      const sales = await getAnnualSales(year, page || 1, limit || 20);
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSalesByDateRange(req, res) {
    const { startDate, endDate } = req.params;
    const { page, limit } = req.query;
    try {
      const sales = await getSalesByDateRange(
        startDate,
        endDate,
        page || 1,
        limit || 20,
      );
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addBulkSales(req, res) {
    const sales = req.body;

    if (!Array.isArray(sales) || sales.length === 0) {
      return res.status(400).json({
        error: "Request body must be a non-empty array of sales",
      });
    }

    try {
      const addedSales = await addBulkSales(sales);
      res.status(201).json(addedSales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = { SalesController };
