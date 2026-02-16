import React from "react";
import Slidebar from "../../components/Slidebar";
import { menuItems } from "./Slidebar_data";
import { Search, Bell, AlertTriangle, TrendingUp, Package, ShoppingCart } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard_admin = () => {
  // Dummy Data for Chart
  const chartData = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        label: "Weekly Sales",
        data: [12, 19, 15, 22, 28, 20, 15],
        backgroundColor: "#3b82f6",
        borderRadius: 5,
      },
    ],
  };

  const lowStockItems = [
    { flavor: "Salted Caramel", category: "Premium Dairy", stock: 12, status: "CRITICAL" },
    { flavor: "Mango Sorbet", category: "Vegan/Non-Dairy", stock: 28, status: "WARNING" },
    { flavor: "Dark Chocolate Chip", category: "Premium Dairy", stock: 15, status: "CRITICAL" },
    { flavor: "Pistachio Delight", category: "Premium Dairy", stock: 32, status: "WARNING" },
  ];

  return (
    <Slidebar title="CoolStock Admin" menuItems={menuItems}>
      {/* Top Navbar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-1/3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </span>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products, orders..."
          />
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} className="text-gray-500 cursor-pointer" />
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-bold">Alex Johnson</p>
              <p className="text-xs text-gray-500">ADMIN MANAGER</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
      <p className="text-gray-500 mb-6 text-sm">Monitor real-time inventory levels and order activity.</p>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Package className="text-blue-500" />} label="Total Products" value="124" trend="+2%" />
        <StatCard icon={<TrendingUp className="text-green-500" />} label="Available Stock" value="8,450" trend="+0.5%" />
        <StatCard icon={<ShoppingCart className="text-blue-400" />} label="Today's Orders" value="42" trend="+12%" />
        <StatCard icon={<AlertTriangle className="text-red-500" />} label="Low Stock Alerts" value="7" trend="-3%" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Low Stock Items</h3>
            <button className="text-blue-600 text-sm font-medium">View All</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400 border-b">
                <th className="pb-3 font-medium">PRODUCT FLAVOR</th>
                <th className="pb-3 font-medium">CATEGORY</th>
                <th className="pb-3 font-medium">IN STOCK</th>
                <th className="pb-3 font-medium">STATUS</th>
                <th className="pb-3 font-medium text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-4 font-semibold">{item.flavor}</td>
                  <td className="py-4 text-gray-500">{item.category}</td>
                  <td className="py-4">{item.stock}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-600 transition">RESTOCK</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sales Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-1">Sales Activity</h3>
          <p className="text-xs text-gray-400 mb-4">Weekly order volume comparison</p>
          <div className="h-48 mb-4">
            <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Peak Hour</span>
              <span className="font-bold">2:00 PM - 4:00 PM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Avg. Order Value</span>
              <span className="font-bold text-green-600">$18.42</span>
            </div>
            <button className="w-full mt-4 border border-blue-500 text-blue-500 py-2 rounded-lg text-xs font-bold hover:bg-blue-50">
              Download Full Report
            </button>
          </div>
        </div>
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