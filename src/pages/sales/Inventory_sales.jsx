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
            item.id === product.id
              ? { ...item, qty: item.qty + 1 }
              : item
          )
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
        .filter((item) => item.qty > 0)
    );
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
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
            <div key={product.id} className="bg-white p-5 rounded-xl shadow border">
              <h3 className="font-semibold">{product.name}</h3>
              <p>{product.pcs} PCS / Box</p>
              <p>Stock: {product.stock}</p>
              <p className="text-blue-600 font-bold">₹{product.price}</p>

              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="mt-4 w-full py-2 rounded-lg bg-blue-500 text-white"
              >
                Add to Order
              </button>
            </div>
          ))}
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow border mb-8">
            <h2 className="font-semibold mb-4">Order Details</h2>

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-3">
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
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="font-semibold mb-4">Customer Information</h2>

            <input
              type="text"
              placeholder="Customer Name"
              className="border p-2 rounded-lg w-full mb-3"
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Mobile"
              className="border p-2 rounded-lg w-full mb-3"
              onChange={(e) =>
                setCustomer({ ...customer, mobile: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="City"
              className="border p-2 rounded-lg w-full mb-3"
              onChange={(e) =>
                setCustomer({ ...customer, city: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Address"
              className="border p-2 rounded-lg w-full mb-3"
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />

            <button
              onClick={generateBill}
              className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg font-semibold"
            >
              Generate Bill
            </button>
          </div>
        )}
      </div>
    </Slidebar>
  );
}

export default Inventory_sales;
