import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import routes from "./routes";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Public routes (no MainLayout) */}
      {routes
        .filter((r) => !r.protected)
        .map(({ route, component, key }) => (
          <Route key={key} path={route} element={component} />
        ))}

      {/* Protected routes (with MainLayout) */}
      <Route element={<MainLayout />}>
        {routes
          .filter((r) => r.protected)
          .map(({ route, component, key }) => (
            <Route
              key={key}
              path={route}
              element={<PrivateRoute>{component}</PrivateRoute>}
            />
          ))}
      </Route>
    </Routes>
  );
}

export default App;
