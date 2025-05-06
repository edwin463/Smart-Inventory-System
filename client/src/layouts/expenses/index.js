import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";

const BASE_URL = process.env.REACT_APP_API_URL;

function Expenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    console.log("🧾 Fetching all expenses from:", `${BASE_URL}/expenses/`);
    fetch(`${BASE_URL}/expenses/`)
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
      })
      .catch((err) => {
        console.error("❌ Failed to load expenses:", err);
      });
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Expenses Overview
      </Typography>

      {expenses.length === 0 ? (
        <Typography>No expenses found.</Typography>
      ) : (
        expenses.map((expense) => (
          <Paper key={expense.id} sx={{ p: 2, mb: 2 }}>
            <Typography>Description: {expense.description}</Typography>
            <Typography>Amount: KES {expense.amount}</Typography>
            <Typography>Category: {expense.category}</Typography>
            {expense.product?.name && (
              <Typography>Product: {expense.product.name}</Typography>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
}

export default Expenses;
