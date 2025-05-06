import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

function SalesForm({ onSubmit }) {
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedQuantity = parseInt(quantity);

    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
      onSubmit({ quantity: parsedQuantity });
      setQuantity("");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h6">Record a Sale</Typography>
      <TextField
        label="Quantity Sold"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button variant="contained" type="submit">
        Record Sale
      </Button>
    </Box>
  );
}

SalesForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SalesForm;
