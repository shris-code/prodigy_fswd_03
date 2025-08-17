// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Fetch products
app.get("/api/products", (req, res) => {
  fs.readFile(path.join(__dirname, "data", "products.json"), "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error loading products");
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
