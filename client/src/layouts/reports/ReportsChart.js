import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../context/AuthContext";
import { Alert } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsChart = () => {
  const { token } = useAuth();
  const [sales, setSales] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    // ✅ Get last day of the month (e.g., 30 for April, 28/29 for Feb)
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const start = `${year}-${month}-01`;
    const end = `${year}-${month}-${lastDay}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    fetch(`${process.env.REACT_APP_API_URL}/reports/revenue?start=${start}&end=${end}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch revenue");
        return res.json();
      })
      .then((data) => setSales(data.total_revenue || 0))
      .catch((err) => {
        console.error("❌ Revenue fetch failed:", err);
        setError("Error loading sales data.");
      });

    fetch(`${process.env.REACT_APP_API_URL}/reports/expenses?start=${start}&end=${end}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data) => setExpenses(data.total_expenses || 0))
      .catch((err) => {
        console.error("❌ Expense fetch failed:", err);
        setError("Error loading expenses data.");
      });
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Please log in to view this chart.
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  const data = {
    labels: ["This Month"],
    datasets: [
      {
        label: "Sales",
        data: [sales],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Expenses",
        data: [expenses],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Sales vs Expenses (This Month)",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ReportsChart;
