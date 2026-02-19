import React from "react";
import Slidebar from "../../components/Slidebar";
import { salesMenuItems } from "./Slidebar_sales";
import { ShoppingCart, IndianRupee, Users, Clock } from "lucide-react";

function Dashboard_sales() {
  // Dummy Data
  const stats = [
    {
      title: "Today's Orders",
      value: 18,
      icon: <ShoppingCart size={22} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Today's Revenue",
      value: "₹12,450",
      icon: <IndianRupee size={22} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Customers",
      value: 5,
      icon: <Users size={22} />,
      color: "bg-purple-100 text-purple-600",
    },
 
  ];

  const recentOrders = [
    {
      id: "ORD-2101",
      customer: "Shree Ice Cream",
      city: "Ahmedabad",
      amount: 3200,
      status: "Completed",
    },
    {
      id: "ORD-2102",
      customer: "Cool Point",
      city: "Surat",
      amount: 1850,
      status: "Pending",
    },
    {
      id: "ORD-2103",
      customer: "Sweet Mart",
      city: "Rajkot",
      amount: 2400,
      status: "Completed",
    },
  ];

  return (
    <Slidebar title="Sales Panel" menuItems={salesMenuItems}>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Sales Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your daily sales performance and customer orders.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </h2>
              </div>
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">
              Recent Orders
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {order.city}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
