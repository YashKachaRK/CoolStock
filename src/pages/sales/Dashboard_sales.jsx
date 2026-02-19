import React from "react";
import Slidebar from "../../components/Slidebar";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  IndianRupee, 
  TrendingUp, 
  Plus 
} from "lucide-react";
import { salesMenuItems } from "./Slidebar_sales"; // Matching your variable name

const Dashboard_sales = () => {
  // Sample data for your Salesman view
  const recentOrders = [
    { id: "#S101", customer: "Rajesh Kumar", amount: "₹450", status: "Delivered" },
    { id: "#S102", customer: "Anita Desai", amount: "₹1,200", status: "Processing" },
    { id: "#S103", customer: "Vijay Shah", amount: "₹850", status: "Delivered" },
  ];

  const stockAlerts = [
    { name: "Vanilla Party Pack", stock: "24 Units", status: "In Stock" },
    { name: "Chocolate Cone", stock: "5 Units", status: "Low Stock" },
    { name: "Mango Delight", stock: "0 Units", status: "Out of Stock" },
  ];

  return (
    <Slidebar title="Sales Panel" menuItems={salesMenuItems} sidebarWidth="w-60">
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Sales Overview</h1>
            <p className="text-gray-500 mt-1">Track your daily sales and check inventory.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-md">
            <Plus size={20} />
            New Order
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SalesStatCard title="Today's Sales" value="₹4,250" icon={<IndianRupee size={22} />} color="blue" />
          <SalesStatCard title="Orders Done" value="12" icon={<CheckCircle size={22} />} color="green" />
          <SalesStatCard title="Pending" value="3" icon={<Clock size={22} />} color="orange" />
          <SalesStatCard title="Items Sold" value="48" icon={<ShoppingBag size={22} />} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">My Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b text-left">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium">{order.id}</td>
                      <td className="py-4 text-gray-600">{order.customer}</td>
                      <td className="py-4 font-bold">{order.amount}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          order.status === "Delivered" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Alerts */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Stock Alerts</h2>
            <div className="space-y-4">
              {stockAlerts.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.stock} left</p>
                  </div>
                  <span className={`text-[10px] font-bold ${item.status === "In Stock" ? "text-green-500" : "text-red-500"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Slidebar>
  );
};

/* Sub-component for Stats */
const SalesStatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
      </div>
    </div>
  );
};

export default Dashboard_sales;