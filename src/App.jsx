import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard_admin from "./pages/admin/Dashboard_admin";
import Dashboard_sales from "./pages/sales/Dashboard_sales";
import ProtectRoute from "./components/ProtectRoute";

// Admin
import Order_admin from "./pages/admin/Order_admin";
import Products_admin from "./pages/admin/Products_admin";
import Salesman_admin from "./pages/admin/Salesman_admin";

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
        <Route path="/admin_users" element={<Salesman_admin />} />
        <Route path="/admin_product" element={<Products_admin />} />
        <Route path="/admin_orders" element={<Order_admin />} />

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
