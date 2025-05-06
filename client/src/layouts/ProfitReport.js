import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

const BASE_URL = process.env.REACT_APP_API_URL;

function ProfitReport() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/reports/profit-summary`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Profit data loaded:", data);
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading profit report:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
        <Typography mt={2}>Loading profit report...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        📈 Profit Report
      </Typography>

      {report.length === 0 ? (
        <Typography>No profit data available.</Typography>
      ) : (
        report.map((item) => (
          <Paper key={item.product_id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{item.product_name}</Typography>
            <Typography>Total Revenue: {item.total_revenue}</Typography>
            <Typography>Total Expenses: {item.total_expenses}</Typography>
            <Typography>
              Profit:{" "}
              <strong style={{ color: item.profit >= 0 ? "green" : "red" }}>
                {item.profit}
              </strong>
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default ProfitReport;
