import React, { useState } from "react";
import Slidebar from "../../components/Slidebar";
import { salesMenuItems } from "./Slidebar_sales";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import jsPDF from "jspdf";

function Inventory_sales() {
  const products = [
    { id: 1, name: "Classic Vanilla", price: 120, pcs: "8", stock: 5 },
    { id: 2, name: "Chocolate Deluxe", price: 150, pcs: "8", stock: 8 },
    { id: 3, name: "Strawberry Swirl", price: 130, pcs: "8", stock: 3 },
    { id: 4, name: "Mango Magic", price: 140, pcs: "8", stock: 0 },
  ];

  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    mobile: "",
    city: "",
  });

  // Static Shop + Salesman Details
  const shopDetails = {
    name: "ABC Ice Cream Distributors",
    address: "123 Market Road, Mumbai",
    phone: "+91 9876543210",
  };

  const salesmanDetails = {
    name: "Amit Verma",
    id: "SLS-101",
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.qty < product.stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
          ),
        );
      } else {
        alert("Stock limit reached!");
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, qty: 1 }]);
      }
    }
  };

  const updateQty = (id, type) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            if (type === "inc" && item.qty < item.stock) {
              return { ...item, qty: item.qty + 1 };
            }
            if (type === "dec") {
              return { ...item, qty: item.qty - 1 };
            }
          }
          return item;
        })
        .filter((item) => item.qty > 0),
    );
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  // ✅ Generate PDF Function
  const generateBill = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(shopDetails.name, 20, 20);
    doc.setFontSize(12);
    doc.text(shopDetails.address, 20, 30);
    doc.text("Phone: " + shopDetails.phone, 20, 38);

    doc.line(20, 45, 190, 45);

    // Customer Details
    doc.text("Customer Details:", 20, 55);
    doc.text("Name: " + customer.name, 20, 65);
    doc.text("Mobile: " + customer.mobile, 20, 73);
    doc.text("City: " + customer.city, 20, 81);
    doc.text("Address: " + customer.address, 20, 89);

    // Salesman Details
    doc.text("Salesman: " + salesmanDetails.name, 130, 65);
    doc.text("Employee ID: " + salesmanDetails.id, 130, 73);

    doc.line(20, 100, 190, 100);

    // Table Header
    let y = 110;
    doc.text("Product", 20, y);
    doc.text("Qty", 100, y);
    doc.text("Price", 120, y);
    doc.text("Total", 160, y);

    y += 10;

    cart.forEach((item) => {
      doc.text(item.name, 20, y);
      doc.text(String(item.qty), 100, y);
      doc.text("₹" + item.price, 120, y);
      doc.text("₹" + item.price * item.qty, 160, y);
      y += 10;
    });

    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(14);
    doc.text("Grand Total: ₹" + totalAmount, 140, y);

    doc.save("Sales_Invoice.pdf");

    alert("Order Placed Successfully!");
    setCart([]);
  };

  return (
    <Slidebar title="Sales Panel" menuItems={salesMenuItems}>
      <div className="p-4 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Take New Order</h1>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow border">
            <ShoppingCart size={20} className="text-blue-600" />
            <span className="font-semibold">
              {cart.length} Items | ₹{totalAmount}
            </span>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <h3 className="font-semibold">{product.name}</h3>
              <p>{product.pcs} PCS / Box</p>
              <p>Stock: {product.stock}</p>
              <p className="text-blue-600 font-bold">₹{product.price}</p>

              {product.stock > 0 ? (
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Add to Order
                </button>
              ) : (
                <div className="mt-4 w-full py-2 rounded-lg bg-red-100 text-red-600 text-center font-semibold">
                  Out of Stock
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow border mb-8">
            <h2 className="font-semibold mb-4">Order Details</h2>

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-3"
              >
                <span>{item.name}</span>

                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, "dec")}>
                    <Minus size={16} />
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, "inc")}>
                    <Plus size={16} />
                  </button>
                </div>

                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        )}

        {/* Customer Form */}
        {cart.length > 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
              Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition p-3 rounded-xl outline-none"
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
              </div>

              {/* Mobile */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="Enter mobile number"
                  className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition p-3 rounded-xl outline-none"
                  onChange={(e) =>
                    setCustomer({ ...customer, mobile: e.target.value })
                  }
                />
              </div>

              {/* City */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition p-3 rounded-xl outline-none"
                  onChange={(e) =>
                    setCustomer({ ...customer, city: e.target.value })
                  }
                />
              </div>

              {/* Address */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium text-gray-600 mb-2">
                  Address
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter full address"
                  className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition p-3 rounded-xl outline-none resize-none"
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Button */}
            <button
              onClick={generateBill}
              className="mt-8 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold text-lg shadow-md transition transform hover:scale-[1.02]"
            >
              Generate Bill & Place Order
            </button>
          </div>
        )}
      </div>
    </Slidebar>
  );
}

export default Inventory_sales;
