import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Login from "./components/Login";
import ProtectRoute from "./components/ProtectRoute";
import StockManagement_admin from "./pages/admin/StockManagement_admin";

// Admin Pages
import Dashboard_admin from "./pages/admin/Dashboard_admin";
import Order_admin from "./pages/admin/Order_admin";
import Products_admin from "./pages/admin/Products_admin";
import Salesman_admin from "./pages/admin/Salesman_admin";

// Sales Pages
import Dashboard_sales from "./pages/sales/Dashboard_sales";
import Inventory_sales from "./pages/sales/Inventory_sales";
import Order_sales from "./pages/sales/Order_sales";
import OrderDetails_sales from "./pages/sales/OrderDetails_sales";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
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
        <Route path="/admin_stock_update" element={<ProtectRoute><StockManagement_admin /></ProtectRoute>} />
        {/* Admin Section */}
        <Route path="/admin_dashboard" element={<ProtectRoute><Dashboard_admin /></ProtectRoute>} />
        <Route path="/admin_users" element={<ProtectRoute><Salesman_admin /></ProtectRoute>} />
        <Route path="/admin_product" element={<ProtectRoute><Products_admin /></ProtectRoute>} />
        <Route path="/admin_orders" element={<ProtectRoute><Order_admin /></ProtectRoute>} />

        {/* Sales Section */}
        <Route path="/sale_dashboard" element={<ProtectRoute><Dashboard_sales /></ProtectRoute>} />
        <Route path="/new_orders" element={<ProtectRoute><Inventory_sales /></ProtectRoute>} />
        <Route path="/sale_orders" element={<ProtectRoute><Order_sales /></ProtectRoute>} />
        <Route path="/order-details/:id" element={<ProtectRoute><OrderDetails_sales /></ProtectRoute>} />
        {/* 404 Redirect - Optional but helpful */}
        <Route path="*" element={<div className="p-10 text-center">404: Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;