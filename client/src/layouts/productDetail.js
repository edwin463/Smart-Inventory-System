import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpenseForm from "../components/ExpenseForm";
import SalesForm from "../components/SalesForm";
import { useAuth } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${BASE_URL}/products/${id}`, { headers }).then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to load product")
      ),
      fetch(`${BASE_URL}/expenses/product/${id}`, { headers }).then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to load expenses")
      ),
      fetch(`${BASE_URL}/sales/product/${id}`, { headers }).then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to load sales")
      ),
    ])
      .then(([prod, exp, sal]) => {
        setProduct(prod);
        setExpenses(exp);
        setSales(sal);
      })
      .catch((err) => {
        console.error("❌ Error loading product details:", err);
        setError(err.toString());
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleExpenseSubmit = (formData) => {
    const payload = {
      ...formData,
      product_id: parseInt(id),
      amount: parseFloat(formData.amount),
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const endpoint = editingExpense
      ? `${BASE_URL}/expenses/${editingExpense.id}`
      : `${BASE_URL}/expenses/`;

    const method = editingExpense ? "PATCH" : "POST";

    fetch(endpoint, {
      method,
      headers,
      body: JSON.stringify(payload),
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Expense save failed"))
      .then((expense) => {
        if (editingExpense) {
          setExpenses((prev) =>
            prev.map((exp) => (exp.id === expense.id ? expense : exp))
          );
          setEditingExpense(null);
        } else {
          setExpenses((prev) => [...prev, expense]);
        }
      })
      .catch((err) => {
        console.error("❌ Error saving expense:", err);
        alert("Error saving expense");
      });
  };

  const handleDeleteExpense = (expenseId) => {
    fetch(`${BASE_URL}/expenses/${expenseId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete expense");
        setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
        if (editingExpense?.id === expenseId) {
          setEditingExpense(null);
        }
      })
      .catch((err) => {
        console.error("❌ Error deleting expense:", err);
        alert("Error deleting expense");
      });
  };

  const handleSaleSubmit = (formData) => {
    const payload = {
      product_id: parseInt(id),
      quantity: parseInt(formData.quantity),
    };

    fetch(`${BASE_URL}/sales/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Sale failed"))
      .then((newSale) => setSales((prev) => [...prev, newSale]))
      .catch((err) => {
        console.error("❌ Error recording sale:", err);
        alert("Error recording sale");
      });
  };

  if (!token) {
    return (
      <Box p={4}>
        <Alert severity="warning">Please log in to view this product.</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
        <Typography>Loading product...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!product) {
    return <Typography color="error">❌ Product not found.</Typography>;
  }

  return (
    <Box p={3}>
      <IconButton onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h4" gutterBottom>{product.name}</Typography>
      <Typography>Price: KES {product.price?.toFixed(2) ?? "—"}</Typography>
      <Typography>Stock: {product.stock}</Typography>
      <Typography>Sales Count: {product.sales_count ?? 0}</Typography>
      <Typography>Category: {product.category?.name || "—"}</Typography>
      <Typography>Supplier: {product.supplier?.name || "—"}</Typography>

      <Divider sx={{ my: 3 }} />

      <ExpenseForm onSubmit={handleExpenseSubmit} initialData={editingExpense || {}} />

      <Divider sx={{ my: 3 }} />

      <SalesForm onSubmit={handleSaleSubmit} />

      <Box mt={4}>
        <Typography variant="h6">💰 Logged Expenses</Typography>
        {expenses.length === 0 ? (
          <Typography>No expenses yet.</Typography>
        ) : (
          expenses.map((exp) => (
            <Paper key={exp.id} sx={{ p: 2, mb: 2 }}>
              <Typography>Description: {exp.description}</Typography>
              <Typography>
                Amount: KES {typeof exp.amount === "number" ? exp.amount.toFixed(2) : "N/A"}
              </Typography>
              <Typography>Category: {exp.category}</Typography>
              <IconButton onClick={() => setEditingExpense(exp)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteExpense(exp.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))
        )}
      </Box>

      <Box mt={4}>
        <Typography variant="h6">📦 Sales Records</Typography>
        {sales.length === 0 ? (
          <Typography>No sales yet.</Typography>
        ) : (
          sales.map((sale) => (
            <Paper key={sale.id} sx={{ p: 2, mb: 2 }}>
              <Typography>Quantity Sold: {sale.quantity}</Typography>
              <Typography>
                Total: KES {typeof sale.total_price === "number" ? sale.total_price.toFixed(2) : "N/A"}
              </Typography>
              <Typography>
                Date: {new Date(sale.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
}

export default ProductDetail;
