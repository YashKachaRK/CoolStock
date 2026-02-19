import React from "react";
import Slidebar from "../../components/Slidebar";
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { menuItems } from "./SLidebar_Data";

const Dashboard_admin = () => {
  return (
    <Slidebar title="Admin Panel" menuItems={menuItems} sidebarWidth="w-60">
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back 👋 Here's what's happening today.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Users"
            value="1,245"
            icon={<Users size={22} />}
            color="blue"
          />

          <StatCard
            title="Total Orders"
            value="320"
            icon={<ShoppingCart size={22} />}
            color="green"
          />

          <StatCard
            title="Products"
            value="87"
            icon={<Package size={22} />}
            color="purple"
          />

          <StatCard
            title="Revenue"
            value="$12,430"
            icon={<DollarSign size={22} />}
            color="orange"
          />
        </div>

        {/* Recent Orders + Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b">
                <tr>
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Salesman</th>{" "}
                  {/* New Column */}
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <OrderRow
                  id="#1024"
                  name="John Doe"
                  salesman="Michael Scott"
                  amount="$120"
                  status="Completed"
                />
                <OrderRow
                  id="#1025"
                  name="Emma Watson"
                  salesman="Dwight Schrute"
                  amount="$75"
                  status="Pending"
                />
                <OrderRow
                  id="#1026"
                  name="David Smith"
                  salesman="Jim Halpert"
                  amount="$210"
                  status="Completed"
                />
              </tbody>
            </table>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>

            <div className="space-y-4">
              <ProductRow name="Ice Cream" sales="120 Sales" percent="80%" />
              <ProductRow name="Chocolate" sales="95 Sales" percent="65%" />
              <ProductRow name="Cake" sales="70 Sales" percent="50%" />
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Low Stock Products
            </h2>

            <div className="space-y-4">
              <LowStockRow name="Strawberry Ice Cream" stock="5 left" />
              <LowStockRow name="Vanilla Cake" stock="3 left" />
              <LowStockRow name="Dark Chocolate" stock="7 left" />
            </div>
          </div>
        </div>
      </div>
    </Slidebar>
  );
};

/* ===================== */
/* Stat Card Component */
/* ===================== */

const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>
        </div>

        <div className={`p-3 rounded-xl ${colorMap[color]}`}>{icon}</div>
      </div>

      <div className="flex items-center text-green-500 text-sm mt-4">
        <TrendingUp size={16} className="mr-1" />
        +12% this month
      </div>
    </div>
  );
};

/* ===================== */
/* Order Row */
/* ===================== */
function OrderRow({ id, name, salesman, amount, status }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3">{id}</td>
      <td>{name}</td>
      <td>{salesman}</td> {/* New Cell */}
      <td>{amount}</td>
      <td>
        <span
          className={`px-2 py-1 rounded text-xs ${
            status === "Completed"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}

/* ===================== */
/* Product Row */
/* ===================== */

const ProductRow = ({ name, sales, percent }) => {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{name}</span>
        <span className="text-gray-500">{sales}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: percent }}
        ></div>
      </div>
    </div>
  );
};


const LowStockRow = ({ name, stock }) => {
  return (
    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-red-500">Low Stock</p>
      </div>
      <span className="text-sm font-semibold text-red-600">
        {stock}
      </span>
    </div>
  );
};


export default Dashboard_admin;
