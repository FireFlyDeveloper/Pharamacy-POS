const express = require("express");
const { authenticateToken } = require("../middlewares/jwt");
const { ProductsController } = require("../controllers/products");

const router = express.Router();
const productsController = new ProductsController();

router.post("/", authenticateToken, productsController.createProduct);
router.put("/:id", authenticateToken, productsController.updateProduct);
router.delete("/:id", authenticateToken, productsController.archiveProduct);
router.get(
  "/search",
  authenticateToken,
  productsController.getProductBySKUOrName,
);
router.get("/", authenticateToken, productsController.getProducts);
router.get(
  "/summary",
  authenticateToken,
  productsController.getInventorySummary,
);

module.exports = router;
