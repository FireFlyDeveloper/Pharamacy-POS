const {
  initTables,
  addProduct,
  updateProduct,
  archiveProduct,
  getProductBySKUOrName,
  getProducts,
  getInventorySummary,
} = require("../models/products");

const createTable = async () => {
  await initTables();
};

createTable().catch((err) => {
  console.error("Error initializing tables:", err);
});

class ProductsController {
  async createProduct(req, res) {
    const data = req.body;

    if (!data.name || !data.sku || !data.price || !data.expiry_date)
      return res
        .status(400)
        .json({ error: "Field (name, sku and price) is required" });

    try {
      const product = await addProduct(data);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    const id = req.params.id;
    const data = req.body;

    if (!id) return res.status(400).json({ error: "Product ID is required" });
    if (Object.keys(data).length === 0)
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });

    try {
      const product = await updateProduct(id, data);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async archiveProduct(req, res) {
    const id = req.params.id;

    if (!id) return res.status(400).json({ error: "Product ID is required" });

    try {
      await archiveProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductBySKUOrName(req, res) {
    const sku = req.query.query;

    if (!sku)
      return res.status(400).json({ error: "Product SKU or name is required" });

    try {
      const product = await getProductBySKUOrName(sku);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProducts(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    try {
      const products = await getProducts({ page, limit });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInventorySummary(req, res) {
    try {
      const products = await getInventorySummary();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = { ProductsController };
