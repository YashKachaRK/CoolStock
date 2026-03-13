import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';
import ManagerLayout from './layouts/ManagerLayout';
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerProfile from './pages/manager/Profile';
import DeliveryLayout from './layouts/DeliveryLayout';
import DeliveryDashboard from './pages/delivery/Dashboard';
import DeliveryProfile from './pages/delivery/Profile';
import CashierLayout from './layouts/CashierLayout';
import CashierDashboard from './pages/cashier/Dashboard';
import CashierProfile from './pages/cashier/Profile';
import CustomerLayout from './layouts/CustomerLayout';
import PlaceOrder from './pages/customer/PlaceOrder';
import TrackOrder from './pages/customer/TrackOrder';
import CustomerProfile from './pages/customer/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="view_products" element={<div className="p-8">View Products</div>} />
          <Route path="recent_orders" element={<div className="p-8">Recent Orders</div>} />
          <Route path="view_employees" element={<div className="p-8">View Employees</div>} />
          <Route path="view_customers" element={<div className="p-8">View Customers</div>} />
        </Route>
        
        {/* Manager routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="profile" element={<ManagerProfile />} />
          <Route path="view_products" element={<div className="p-8">Inventory</div>} />
          <Route path="target_orders" element={<div className="p-8">Target Orders</div>} />
        </Route>
        
        {/* Delivery routes */}
        <Route path="/delivery" element={<DeliveryLayout />}>
          <Route path="dashboard" element={<DeliveryDashboard />} />
          <Route path="profile" element={<DeliveryProfile />} />
        </Route>
        
        {/* Cashier routes */}
        <Route path="/cashier" element={<CashierLayout />}>
          <Route path="dashboard" element={<CashierDashboard />} />
          <Route path="profile" element={<CashierProfile />} />
        </Route>
        
        {/* Customer routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="place_order" element={<PlaceOrder />} />
          <Route path="track_order" element={<TrackOrder />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
