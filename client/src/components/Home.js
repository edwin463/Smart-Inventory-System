import React from "react";
import {
  Box,
  Button,
  Typography,
  Chip
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GradientBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #f8e1f4 0%, #ede7f6 100%)",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(6),
  position: "relative",
}));

const HeroCard = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  padding: theme.spacing(6),
  maxWidth: "1200px",
  width: "100%",
  gap: theme.spacing(4),
  overflow: "hidden",
}));

const Illustration = styled("img")({
  maxWidth: "500px",
  width: "100%",
  height: "auto",
});

const TopRightBox = styled(Box)({
  position: "absolute",
  top: 20,
  right: 20,
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExplore = () => {
    if (user) {
      navigate("/inventory");
    } else {
      navigate("/login");
    }
  };

  return (
    <GradientBackground>
      {/* Top-right UI */}
      <TopRightBox>
        {user ? (
          <>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {user.email}
            </Typography>
            {user.is_admin && <Chip label="Admin" size="small" color="warning" />}
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                borderColor: "#7e57c2",
                color: "#7e57c2",
                fontWeight: "bold",
                textTransform: "none",
                ":hover": {
                  borderColor: "#6a1b9a",
                  color: "#6a1b9a",
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/register")}
              sx={{
                borderColor: "#7e57c2",
                color: "#7e57c2",
                fontWeight: "bold",
                textTransform: "none",
                ":hover": {
                  borderColor: "#6a1b9a",
                  color: "#6a1b9a",
                },
              }}
            >
              Register
            </Button>
          </>
        )}
      </TopRightBox>

      {/* Hero Section */}
      <HeroCard>
        <Box sx={{ maxWidth: 500 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2, color: "#3f3d56" }}>
            Smart Inventory System
          </Typography>
          <Typography sx={{ color: "#555", fontSize: "1.1rem", mb: 3 }}>
            Effortlessly track stock levels, manage sales, and monitor business performance in real-time. Our Smart Inventory App brings simplicity and efficiency to your operations.
          </Typography>
          <Button
            variant="contained"
            onClick={handleExplore}
            sx={{
              backgroundColor: "#7e57c2",
              borderRadius: "50px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              ":hover": { backgroundColor: "#6a1b9a" },
            }}
          >
            Explore Now
          </Button>
        </Box>

        <Illustration
          src="/african-american-worker-writing-inventory-list-while-checking-stock-storage-room.jpg"
          alt="Inventory Illustration"
        />
      </HeroCard>
    </GradientBackground>
  );
}

export default Home;
