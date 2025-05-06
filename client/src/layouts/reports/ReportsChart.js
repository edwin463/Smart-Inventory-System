// client/src/layouts/reports/ReportsChart.js
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsChart = () => {
  const { token } = useAuth();
  const [sales, setSales] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const start = `${year}-${month}-01`;
    const end = `${year}-${month}-31`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    fetch(`${process.env.REACT_APP_API_URL}/reports/revenue?start=${start}&end=${end}`, { headers })
      .then((res) => res.json())
      .then((data) => setSales(data.total_revenue || 0));

    fetch(`${process.env.REACT_APP_API_URL}/reports/expenses?start=${start}&end=${end}`, { headers })
      .then((res) => res.json())
      .then((data) => setExpenses(data.total_expenses || 0));
  }, [token]);

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
