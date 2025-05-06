import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

function ExpenseForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || "",
        amount: initialData.amount || "",
        category: initialData.category || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = {
      description: formData.description.trim(),
      category: formData.category.trim(),
      amount: parseFloat(formData.amount),
    };

    if (!trimmed.description || isNaN(trimmed.amount) || !trimmed.category) {
      alert("Please fill out all fields correctly.");
      return;
    }

    onSubmit(trimmed);
    setFormData({ description: "", amount: "", category: "" });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3, mt: 2 }}>
      <Typography variant="h6">
        {initialData?.id ? "Edit Expense" : "Add Expense for Product #"}
      </Typography>

      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        {initialData?.id ? "Update Expense" : "Save Expense"}
      </Button>
    </Box>
  );
}

ExpenseForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default ExpenseForm;
