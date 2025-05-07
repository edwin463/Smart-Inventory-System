import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    console.log("🧾 Fetching expenses from:", `${BASE_URL}/expenses/`);

    fetch(`${BASE_URL}/expenses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data) => setExpenses(data || []))
      .catch((err) => {
        console.error("❌ Failed to load expenses:", err);
        setError("Failed to load expenses. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <Box p={3}>
        <Alert severity="warning">Please log in to view expenses.</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        💸 Expenses Overview
      </Typography>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && expenses.length === 0 && !error && (
        <Typography>No expenses found.</Typography>
      )}

      {!loading && !error &&
        expenses.map((expense) => (
          <Paper key={expense.id} sx={{ p: 2, mb: 2 }}>
            <Typography>
              Description: {expense.description || "—"}
            </Typography>
            <Typography>
              Amount: KES {typeof expense.amount === "number" ? expense.amount.toFixed(2) : "0.00"}
            </Typography>
            <Typography>
              Category: {expense.category || "Uncategorized"}
            </Typography>
            {expense.product?.name && (
              <Typography>
                Product: {expense.product.name}
              </Typography>
            )}
          </Paper>
        ))}
    </Box>
  );
}

export default Expenses;
