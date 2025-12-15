const express = require("express");
const { authenticateToken } = require("../middlewares/jwt");
const { authorizeAdmin } = require("../middlewares/admin");
const { SalesController } = require("../controllers/sales");

const router = express.Router();
const sales = new SalesController();

router.get(
  "/daily/:date",
  authenticateToken,
  authorizeAdmin,
  sales.getDailySales,
);
router.get("/weekly", authenticateToken, authorizeAdmin, sales.getWeeklySales);
router.get(
  "/monthly/:month/:year",
  authenticateToken,
  authorizeAdmin,
  sales.getMonthlySales,
);
router.get(
  "/annual/:year",
  authenticateToken,
  authorizeAdmin,
  sales.getAnnualSales,
);
router.get(
  "/range/:startDate/:endDate",
  authenticateToken,
  authorizeAdmin,
  sales.getSalesByDateRange,
);
router.post("/bulk", authenticateToken, sales.addBulkSales);

module.exports = router;
