import React from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {user?.is_admin && (
        <Chip
          label="Admin Access"
          color="warning"
          sx={{ mb: 2, fontWeight: "bold" }}
        />
      )}

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "16px",
          backgroundColor: "#fefefe",
          mb: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Welcome, <strong>{user?.email}</strong>
        </Typography>
        <Typography>
          You have administrator privileges. Use this dashboard to manage
          users, view advanced reports, and monitor system-wide activity.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#f3e5f5" }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Total Registered Users
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                58 {/* You can dynamically fetch this from your backend */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#e1f5fe" }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Monthly Revenue
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                KES 245,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#fbe9e7" }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Stock Alerts
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                7 Low-stock Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
