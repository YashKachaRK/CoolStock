import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth and Protected Routing
import Login from "./components/Login";
import ProtectRoute from "./components/ProtectRoute";

// Admin Pages
import Dashboard_admin from "./pages/admin/Dashboard_admin";
import Order_admin from "./pages/admin/Order_admin";
import Products_admin from "./pages/admin/Products_admin";
import Salesman_admin from "./pages/admin/Salesman_admin";

// Sales Pages
import Dashboard_sales from "./pages/sales/Dashboard_sales";
// import Inventory_sales from "./pages/sales/Inventory_sales"; // Import when created
// import Order_sales from "./pages/sales/Order_sales"; // Import when created

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin_dashboard"
          element={
            <ProtectRoute>
              <Dashboard_admin />
            </ProtectRoute>
          }
        />
        <Route 
          path="/admin_users" 
          element={
            <ProtectRoute>
              <Salesman_admin />
            </ProtectRoute>
          } 
        />
        <Route 
          path="/admin_product" 
          element={
            <ProtectRoute>
              <Products_admin />
            </ProtectRoute>
          } 
        />
        <Route 
          path="/admin_orders" 
          element={
            <ProtectRoute>
              <Order_admin />
            </ProtectRoute>
          } 
        />

        {/* Sales Routes - Protected */}
        <Route
          path="/sale_dashboard"
          element={
            <ProtectRoute>
              <Dashboard_sales />
            </ProtectRoute>
          }
        />
        {/* Example Sales Sub-Routes
        <Route 
          path="/sale_inventory" 
          element={
            <ProtectRoute>
              <Inventory_sales />
            </ProtectRoute>
          } 
        /> 
        */}

        {/* Catch-all for 404 - Optional */}
        <Route path="*" element={<div className="flex h-screen items-center justify-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;