import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";

const BASE_URL = process.env.REACT_APP_API_URL;

function SalesOverview() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/reports/top-products`)
      .then((res) => res.json())
      .then((data) => {
        setSalesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales overview:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Sales Overview
      </Typography>

      <Divider sx={{ my: 2 }} />

      {loading ? (
        <CircularProgress />
      ) : salesData.length === 0 ? (
        <Typography>No sales data available.</Typography>
      ) : (
        salesData.map((item, index) => (
          <Paper key={index} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6">{item.product}</Typography>
            <Typography variant="body1">
              Units Sold: {item.units_sold}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default SalesOverview;
