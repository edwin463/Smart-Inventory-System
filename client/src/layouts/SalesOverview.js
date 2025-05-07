import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

function SalesOverview() {
  const { token } = useAuth();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${BASE_URL}/reports/top-products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sales overview");
        return res.json();
      })
      .then((data) => {
        setSalesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching sales overview:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        📊 Sales Overview
      </Typography>

      <Divider sx={{ my: 2 }} />

      {!token && <Typography>Please log in to view sales data.</Typography>}
      {loading && token && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && salesData.length === 0 && (
        <Typography>No sales data available.</Typography>
      )}

      {!loading &&
        !error &&
        salesData.map((item) => (
          <Paper key={item.product_id} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6">🛍️ {item.product}</Typography>
            <Typography>Units Sold: {item.units_sold}</Typography>
          </Paper>
        ))}
    </Box>
  );
}

export default SalesOverview;
