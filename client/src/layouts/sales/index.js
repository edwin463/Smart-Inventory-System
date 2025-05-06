import React, { useEffect, useState } from "react";
import { Typography, Paper, Box } from "@mui/material";

const BASE_URL = process.env.REACT_APP_API_URL;

function Sales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/sales/all`)
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.error("Failed to load all sales:", err));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        All Sales Records
      </Typography>
      {sales.length === 0 ? (
        <Typography>No sales yet.</Typography>
      ) : (
        sales.map((sale) => (
          <Paper key={sale.id} sx={{ p: 2, mb: 2 }}>
            <Typography>Product: {sale.product?.name || "—"}</Typography>
            <Typography>Quantity Sold: {sale.quantity}</Typography>
            <Typography>Total Price: Ksh {sale.total_price}</Typography>
            <Typography>Date: {sale.timestamp}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default Sales;
