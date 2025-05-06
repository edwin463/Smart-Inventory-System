import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL;

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
    setAdminSecret("");
    setErrorMsg("");
    setSuccessMsg("");
    window.sessionStorage.clear();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const body = {
        email,
        password,
        ...(adminSecret && { admin_secret: adminSecret }),
      };

      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("✅ Registration response:", data);

      if (res.ok) {
        setSuccessMsg("🎉 Registered successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}

        <form onSubmit={handleRegister} autoComplete="off">
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            name="new-email"
            autoComplete="new-email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            name="new-password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Admin Code (optional)"
            type="text"
            fullWidth
            margin="normal"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            helperText="Enter secret code to register as admin (if available)"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;
