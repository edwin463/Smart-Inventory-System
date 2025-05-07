import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

function Sales() {
  const { token } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(`${BASE_URL}/sales/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load sales");
        return res.json();
      })
      .then((data) => setSales(data || []))
      .catch((err) => {
        console.error("❌ Failed to load all sales:", err);
        setErrorMsg("Failed to load sales. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <Box p={3}>
        <Alert severity="warning">Please log in to view your sales.</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📦 All Sales Records
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : errorMsg ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMsg}
        </Alert>
      ) : sales.length === 0 ? (
        <Typography>No sales yet.</Typography>
      ) : (
        sales.map((sale) => (
          <Paper key={sale.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">
              {sale.product?.name || "Unnamed Product"}
            </Typography>
            <Typography>🧮 Quantity Sold: {sale.quantity}</Typography>
            <Typography>
              💰 Total Price: KES {sale.total_price?.toFixed(2) ?? "0.00"}
            </Typography>
            <Typography>
              🕒 Date:{" "}
              {sale.timestamp
                ? new Date(sale.timestamp).toLocaleString()
                : "N/A"}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default Sales;
