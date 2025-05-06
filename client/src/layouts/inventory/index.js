import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Box, Typography, Paper } from "@mui/material";
import ProductTable from "../../components/ProductTable";
import InventoryForm from "../../components/InventoryForm";
import SalesChart from "../../components/SalesChart";

const BASE_URL = process.env.REACT_APP_API_URL;

function Inventory() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const fetchProducts = () => {
    fetch(`${BASE_URL}/products/`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, [location]);

  const handleProductSubmit = (formData) => {
    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category_name: formData.category_name,
      supplier_name: formData.supplier_name,
    };

    fetch(`${BASE_URL}/products/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add product");
        return res.json();
      })
      .then((newProduct) => {
        setProducts((prev) => [...prev, newProduct]);
      })
      .catch((err) => console.error("POST error:", err));
  };

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete product");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => console.error("Delete error:", err));
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Add New Product
        </Typography>
        <InventoryForm onSubmit={handleProductSubmit} />
      </Paper>

      <ProductTable products={products} onDelete={handleDelete} />

      <Box mt={5}>
        <SalesChart products={products} />
      </Box>
    </Container>
  );
}

export default Inventory;
