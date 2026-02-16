import React from "react";
import Slidebar from "../../components/Slidebar";
import { Users, ShoppingCart, Package, DollarSign } from "lucide-react";
import { menuItems } from "./SLidebar_Data";
import DashboardCard from "./DashboardCard";
function Dashboard_admin() {
  return (
    <Slidebar
      title="Admin Panel"
      menuItems={menuItems}
      sidebarWidth="w-60"
    >
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the admin dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Users"
          value="1,245"
          icon={<Users className="text-blue-600" />}
        />
        <DashboardCard
          title="Orders"
          value="320"
          icon={<ShoppingCart className="text-green-600" />}
        />
        <DashboardCard
          title="Products"
          value="87"
          icon={<Package className="text-purple-600" />}
        />
        <DashboardCard
          title="Revenue"
          value="$12,430"
          icon={<DollarSign className="text-orange-600" />}
        />
      </div>
    </Slidebar>
  );
};

// Sub-component for the stat cards
const StatCard = ({ icon, label, value, trend, color = "green" }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${color === 'red' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
        {trend}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-gray-400 text-xs font-medium">{label}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  </div>
);

export default Dashboard_admin;