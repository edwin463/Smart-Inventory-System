import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import ProductTable from "../../components/ProductTable";
import InventoryForm from "../../components/InventoryForm";
import SalesChart from "../../components/SalesChart";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

function Inventory() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { token } = useAuth();

  const fetchProducts = () => {
    fetch(`${BASE_URL}/products/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data || []))
      .catch((err) => {
        console.error("Error loading products:", err);
        setError("Failed to load products. Try again later.");
      });
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [location, token]);

  const handleProductSubmit = (formData) => {
    setError(null);
    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category_name: formData.category_name,
      supplier_name: formData.supplier_name,
    };

    fetch(`${BASE_URL}/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((data) => {
          throw new Error(data.error || "Failed to add product");
        });
        return res.json();
      })
      .then((newProduct) => {
        setProducts((prev) => [...prev, newProduct]);
      })
      .catch((err) => {
        console.error("POST error:", err);
        setError(err.message || "Failed to add product.");
      });
  };

  const handleDelete = (id) => {
    setError(null);
    fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete product");
        return res.json();
      })
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => {
        console.error("Delete error:", err);
        setError("Failed to delete product.");
      });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
