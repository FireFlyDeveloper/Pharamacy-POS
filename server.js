require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { checker } = require("./src/helpers/checker");
const authRoutes = require("./src/routers/auth");
const productsRoutes = require("./src/routers/products");
const supplierRoutes = require("./src/routers/supplier");
const salesRoutes = require("./src/routers/sales");

checker();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ message: "Inventory and POS API is running" });
});

app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/sales", salesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
