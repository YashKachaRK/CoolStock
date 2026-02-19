import React, { useState } from "react";
import Slidebar from "../../components/Slidebar";
import { salesMenuItems } from "./Slidebar_sales";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function Order_sales() {
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("ABC Ice Cream Distributors", 20, 20);
    doc.setFontSize(12);
    doc.text("123 Market Road, Mumbai", 20, 30);
    doc.text("Phone: +91 9876543210", 20, 38);

    doc.line(20, 45, 190, 45);

    doc.text(`Order ID: ${order.id}`, 20, 55);
    doc.text(`Date: ${order.date}`, 20, 63);

    doc.text("Customer:", 20, 75);
    doc.text(order.customer.name, 20, 83);
    doc.text(order.customer.mobile, 20, 91);
    doc.text(order.customer.city, 20, 99);

    doc.text("Salesman: " + order.salesman.name, 130, 83);

    doc.line(20, 110, 190, 110);

    let y = 120;

    doc.text("Product", 20, y);
    doc.text("Qty", 100, y);
    doc.text("Price", 120, y);
    doc.text("Total", 160, y);

    y += 10;

    order.items.forEach((item) => {
      doc.text(item.name, 20, y);
      doc.text(String(item.qty), 100, y);
      doc.text("₹" + item.price, 120, y);
      doc.text("₹" + item.price * item.qty, 160, y);
      y += 10;
    });

    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(14);
    doc.text("Grand Total: ₹" + order.total, 140, y);

    doc.save(`Invoice_Order_${order.id}.pdf`);
  };

  const navigate = useNavigate();

  // ✅ Static Orders Data
  const orders = [
    {
      id: 1,
      customer: {
        name: "Rahul Sharma",
        mobile: "9876543210",
        city: "Mumbai",
      },
      salesman: {
        name: "Amit Verma",
      },
      date: "16 Feb 2026 | 10:30 AM",
      total: 390,
      items: [
        { id: 1, name: "Classic Vanilla", qty: 2, price: 120 },
        { id: 2, name: "Chocolate Deluxe", qty: 1, price: 150 },
      ],
    },
    {
      id: 2,
      customer: {
        name: "Priya Mehta",
        mobile: "9123456780",
        city: "Pune",
      },
      salesman: {
        name: "Amit Verma",
      },
      date: "15 Feb 2026 | 04:15 PM",
      total: 260,
      items: [{ id: 3, name: "Strawberry Swirl", qty: 2, price: 130 }],
    },
  ];

  return (
    <Slidebar title="Sales Panel" menuItems={salesMenuItems}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">All Orders</h1>

        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition"
            >
              {/* Top Section */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-400">
                    Order ID: #{order.id}
                  </p>

                  <h2 className="text-lg font-semibold text-gray-800">
                    {order.customer.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {order.customer.mobile}
                  </p>
                  <p className="text-sm text-gray-500">{order.customer.city}</p>
                  <p className="text-sm text-gray-400 mt-1">{order.date}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{order.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    Salesman: {order.salesman.name}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="mt-5 border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  Order Items
                </h3>

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-gray-700 mb-2"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* View Button */}
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => navigate(`/order-details/${order.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  <Eye size={16} />
                  View Details
                </button>

                <button
                  onClick={() => downloadInvoice(order)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slidebar>
  );
}

export default Order_sales;
