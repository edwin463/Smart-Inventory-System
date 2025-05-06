import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Button,
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
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });

    fetch(`${BASE_URL}/expenses/product/${id}`)
      .then((res) => res.json())
      .then(setExpenses);

    fetch(`${BASE_URL}/sales/product/${id}`)
      .then((res) => res.json())
      .then(setSales);
  }, [id]);

  const handleExpenseSubmit = (formData) => {
    const payload = {
      ...formData,
      product_id: parseInt(id),
      amount: parseFloat(formData.amount),
    };

    const headers = {
      "Content-Type": "application/json",
    };
    if (user?.token) headers["Authorization"] = `Bearer ${user.token}`;

    if (editingExpense) {
      fetch(`${BASE_URL}/expenses/${editingExpense.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((updatedExpense) => {
          const updated = expenses.map((exp) =>
            exp.id === updatedExpense.id ? updatedExpense : exp
          );
          setExpenses(updated);
          setEditingExpense(null);
        });
    } else {
      fetch(`${BASE_URL}/expenses/`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((newExpense) => setExpenses((prev) => [...prev, newExpense]));
    }
  };

  const handleDeleteExpense = (expenseId) => {
    fetch(`${BASE_URL}/expenses/${expenseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
        if (editingExpense && editingExpense.id === expenseId) {
          setEditingExpense(null);
        }
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
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((newSale) => setSales((prev) => [...prev, newSale]));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!product) return <Typography color="error">❌ Product not found.</Typography>;

  return (
    <Box p={3}>
      <IconButton onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h4" gutterBottom>{product.name}</Typography>
      <Typography>Price: {product.price}</Typography>
      <Typography>Stock: {product.stock}</Typography>
      <Typography>Category: {product.category?.name || "—"}</Typography>
      <Typography>Supplier: {product.supplier?.name || "—"}</Typography>

      <Divider sx={{ my: 3 }} />

      <ExpenseForm onSubmit={handleExpenseSubmit} initialData={editingExpense || {}} />

      <Divider sx={{ my: 3 }} />

      <SalesForm onSubmit={handleSaleSubmit} />

      <Box mt={4}>
        <Typography variant="h6">Logged Expenses</Typography>
        {expenses.length === 0 ? (
          <Typography>No expenses yet.</Typography>
        ) : (
          expenses.map((exp) => (
            <Paper key={exp.id} sx={{ p: 2, mb: 2 }}>
              <Typography>Description: {exp.description}</Typography>
              <Typography>Amount: {exp.amount}</Typography>
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
        <Typography variant="h6">Sales Records</Typography>
        {sales.length === 0 ? (
          <Typography>No sales yet.</Typography>
        ) : (
          sales.map((sale) => (
            <Paper key={sale.id} sx={{ p: 2, mb: 2 }}>
              <Typography>Quantity Sold: {sale.quantity}</Typography>
              <Typography>Total: {sale.total_price}</Typography>
              <Typography>Date: {sale.timestamp}</Typography>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
}

export default ProductDetail;
