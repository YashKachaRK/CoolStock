import React from "react";
import { useNavigate } from "react-router-dom";
import Slidebar from "../../components/Slidebar";
import { menuItems } from "../admin/SLidebar_Data";
import { FileText, Eye } from "lucide-react";

function Order_admin() {
  const navigate = useNavigate();

  // Dummy Order Data
  const orders = [
    {
      id: "ORD-1001",
      date: "12 Feb 2026",
      salesman: "Rahul Patel",
      customer: "A1 Ice Cream Shop",
      city: "Ahmedabad",
      amount: 4500,
      status: "Completed",
    },
    {
      id: "ORD-1002",
      date: "14 Feb 2026",
      salesman: "Amit Shah",
      customer: "Cool Mart",
      city: "Surat",
      amount: 3200,
      status: "Pending",
    },
    {
      id: "ORD-1003",
      date: "15 Feb 2026",
      salesman: "Ravi Kumar",
      customer: "Sweet Corner",
      city: "Rajkot",
      amount: 5100,
      status: "Completed",
    },
  ];

  return (
    <Slidebar title="CoolStock Admin" menuItems={menuItems}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Order Management
          </h1>
          <p className="text-sm text-gray-500">
            View and manage all customer orders.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Order Date</th>
                <th className="px-6 py-4 font-semibold">Salesman</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">City</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-blue-600">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.salesman}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.city}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    ₹{order.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => navigate("/admin_view_order")}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Eye size={18} />
                      </button>

                      {/* PDF Button */}
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <FileText size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <p>Showing 1 to {orders.length} of 24 orders</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition">
              &lt;
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded shadow-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </Slidebar>
  );
}

export default Order_admin;
