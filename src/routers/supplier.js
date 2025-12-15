const express = require("express");
const { authenticateToken } = require("../middlewares/jwt");
const { SupplierController } = require("../controllers/supplier");

const router = express.Router();
const supplier = new SupplierController();

router.post("/", authenticateToken, supplier.createSupplier);
router.put("/:id", authenticateToken, supplier.updateSupplier);
router.delete("/:id", authenticateToken, supplier.deleteSupplier);
router.get("/", authenticateToken, supplier.getSuppliers);

module.exports = router;
