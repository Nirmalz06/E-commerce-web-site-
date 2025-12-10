// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Load products from JSON
const productsPath = path.join(__dirname, "data", "products.json");
let products = [];

function loadProducts() {
  try {
    const data = fs.readFileSync(productsPath, "utf-8");
    products = JSON.parse(data);
  } catch (err) {
    console.error("Error reading products.json:", err);
    products = [];
  }
}

loadProducts();

// API: get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// API: get product by id
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// Fallback: serve index.html for root
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Trizoverze running at http://localhost:${PORT}`);
});
