import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

function SalesChart({ products }) {
  const data = products.map((product) => ({
    name: product.name,
    sales: product.sales_count || 0, // 🔥 Use backend-calculated value
  }));

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Sales Overview
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

SalesChart.propTypes = {
  products: PropTypes.array.isRequired,
};

export default SalesChart;
