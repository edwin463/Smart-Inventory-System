import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

function ProfitReport() {
  const { token } = useAuth();
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(`${BASE_URL}/reports/profit-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profit report");
        return res.json();
      })
      .then((data) => {
        setReport(data || []);
        setErrorMsg("");
      })
      .catch((err) => {
        console.error("❌ Error loading profit report:", err);
        setErrorMsg(err.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <Box p={4}>
        <Alert severity="warning">Please log in to view the profit report.</Alert>
      </Box>
    );
  }

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

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {report.length === 0 ? (
        <Typography>No profit data available.</Typography>
      ) : (
        report.map((item) => (
          <Paper key={item.product_id} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {item.product_name || "Unnamed Product"}
            </Typography>
            <Typography>
              💰 Total Revenue: KES {item.total_revenue?.toFixed(2) ?? "0.00"}
            </Typography>
            <Typography>
              🧾 Total Expenses: KES {item.total_expenses?.toFixed(2) ?? "0.00"}
            </Typography>
            <Typography>
              🟢 Profit:{" "}
              <strong style={{ color: item.profit >= 0 ? "green" : "red" }}>
                KES {item.profit?.toFixed(2) ?? "0.00"}
              </strong>
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default ProfitReport;
