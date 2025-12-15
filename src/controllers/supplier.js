const {
  initTables,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSuppliers,
} = require("../models/supplier");

const createTable = async () => {
  await initTables();
};

createTable().catch((err) => {
  console.error("Error initializing tables:", err);
});

class SupplierController {
  async createSupplier(req, res) {
    const data = req.body;

    if (!data.name || !data.contact)
      return res
        .status(400)
        .json({ error: "Field (name and contact) is required" });

    try {
      const supplier = await addSupplier(data);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateSupplier(req, res) {
    const id = req.params.id;
    const data = req.body;

    if (!id) return res.status(400).json({ error: "Supplier ID is required" });
    if (Object.keys(data).length === 0)
      return res
        .status(400)
        .json({ error: "Field (name or contact) is required to update" });

    try {
      const supplier = await updateSupplier(id, data);
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteSupplier(req, res) {
    const id = req.params.id;

    if (!id) return res.status(400).json({ error: "Supplier ID is required" });

    try {
      await deleteSupplier(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSuppliers(_req, res) {
    try {
      const suppliers = await getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = { SupplierController };
