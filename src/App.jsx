import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard_admin from "./pages/admin/Dashboard_admin";
import Dashboard_sales from "./pages/sales/Dashboard_sales";
import ProtectRoute from "./components/ProtectRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />

        {/* Admin dashboard */}
        <Route
          path="/admin_dashboard"
          element={
            <ProtectRoute>
              <Dashboard_admin />
            </ProtectRoute>
          }
        />

        {/* Sales dashboard */}
        <Route
          path="/sale_dashboard"
          element={
            <ProtectRoute>
              <Dashboard_sales />
            </ProtectRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
