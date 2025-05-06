import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import PropTypes from "prop-types";

function InventoryForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    price: initialData.price || "",
    stock: initialData.stock || "",
    category_name: initialData.category_name || "",
    supplier_name: initialData.supplier_name || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    // Reset form
    setFormData({
      name: "",
      price: "",
      stock: "",
      category_name: "",
      supplier_name: "",
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" mb={2}>
        Add / Update Product
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Category"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Supplier"
            name="supplier_name"
            value={formData.supplier_name}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>

      <Box mt={3}>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </Box>
  );
}

InventoryForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default InventoryForm;
