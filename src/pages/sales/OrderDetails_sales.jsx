import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slidebar from "../../components/Slidebar";
import { salesMenuItems } from "./Slidebar_sales";
import { ArrowLeft } from "lucide-react";

function OrderDetails_sales() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Same static orders data (for now)
  const orders = [
    {
      id: 1,
      customer: {
        name: "Rahul Sharma",
        mobile: "9876543210",
        city: "Mumbai",
        address: "Andheri West",
      },
      salesman: {
        name: "Amit Verma",
        id: "SLS-101",
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
        address: "Baner Road",
      },
      salesman: {
        name: "Amit Verma",
        id: "SLS-101",
      },
      date: "15 Feb 2026 | 04:15 PM",
      total: 260,
      items: [
        { id: 3, name: "Strawberry Swirl", qty: 2, price: 130 },
      ],
    },
  ];

  const order = orders.find((o) => o.id === parseInt(id));

  if (!order) {
    return <div className="p-10">Order Not Found</div>;
  }

  return (
    <Slidebar title="Sales Panel" menuItems={salesMenuItems}>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Order #{order.id}
              </h2>
              <p className="text-sm text-gray-500">{order.date}</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                ₹{order.total}
              </p>
            </div>
          </div>

          {/* Customer + Salesman */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Customer Details
              </h3>
              <p>{order.customer.name}</p>
              <p>{order.customer.mobile}</p>
              <p>{order.customer.city}</p>
              <p>{order.customer.address}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Salesman Details
              </h3>
              <p>{order.salesman.name}</p>
              <p>ID: {order.salesman.id}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">
              Order Items
            </h3>

            <div className="border rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 bg-gray-100 p-3 font-semibold text-sm">
                <div>Product</div>
                <div className="text-center">Qty</div>
                <div className="text-center">Price</div>
                <div className="text-right">Total</div>
              </div>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-4 p-3 border-t text-sm"
                >
                  <div>{item.name}</div>
                  <div className="text-center">{item.qty}</div>
                  <div className="text-center">₹{item.price}</div>
                  <div className="text-right">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Slidebar>
  );
}

export default OrderDetails_sales;
