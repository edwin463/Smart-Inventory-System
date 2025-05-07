import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
  AppBar,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import routes from "../routes";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

function MainLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          {routes
            .filter(
              (route) =>
                route.type === "collapse" &&
                (route.adminOnly ? user?.is_admin : true)
            )
            .map(({ name, route, key, icon, adminOnly }) => (
              <ListItem
                button
                key={key}
                component={NavLink}
                to={route}
                sx={{ "&.active": { backgroundColor: "#e0e0e0" } }}
              >
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {name}
                      {adminOnly && user?.is_admin && (
                        <Chip
                          label="Admin"
                          size="small"
                          color="warning"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div">
              Smart Inventory App
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {user?.email && (
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {user.email}
                </Typography>
              )}
              <Button
                onClick={() => {
                  logout();
                  navigate("/", { replace: true });
                }}
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
