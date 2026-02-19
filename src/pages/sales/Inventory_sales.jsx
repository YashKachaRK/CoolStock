import React, { useState } from "react";
import Slidebar from "../../components/Slidebar";
import { salesMenuItems } from "./Slidebar_sales";
import { ShoppingCart, Plus, Minus } from "lucide-react";

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

  // Add to cart with stock limit
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

  // Update quantity
  const updateQty = (id, type) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            if (type === "inc") {
              if (item.qty < item.stock) {
                return { ...item, qty: item.qty + 1 };
              } else {
                alert("Only " + item.stock + " stock available!");
                return item;
              }
            } else {
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

  return (
    <Slidebar title="Sales Panel" menuItems={salesMenuItems}>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Take New Order
          </h1>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow border">
            <ShoppingCart size={20} className="text-blue-600" />
            <span className="font-semibold">
              {cart.length} Items | ₹{totalAmount}
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <h3 className="font-semibold text-black">
                {product.name}
              </h3>

              <p className="text-gray-500 font-bold mt-1">
                {product.pcs} PCS / Box
              </p>

              {/* Stock Display */}
              <p className="text-sm mt-1">
                Stock:
                <span
                  className={`ml-1 font-semibold ${
                    product.stock <= 3
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {product.stock}
                </span>
              </p>

              <p className="text-blue-600 font-bold mt-1">
                ₹{product.price}
              </p>

              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`mt-4 w-full py-2 rounded-lg transition ${
                  product.stock === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : "Add to Order"}
              </button>
            </div>
          ))}
        </div>

        {/* Cart Section */}
        {cart.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Order Details
            </h2>

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-3"
              >
                <span className="font-medium">{item.name}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, "dec")}
                    className="p-1 bg-gray-100 rounded"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-semibold">{item.qty}</span>

                  <button
                    onClick={() => updateQty(item.id, "inc")}
                    disabled={item.qty >= item.stock}
                    className={`p-1 rounded ${
                      item.qty >= item.stock
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-gray-100"
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <span className="font-bold">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        )}

        {/* Customer Form */}
        {cart.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                className="border p-2 rounded-lg"
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Mobile Number"
                className="border p-2 rounded-lg"
                onChange={(e) =>
                  setCustomer({ ...customer, mobile: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="City"
                className="border p-2 rounded-lg"
                onChange={(e) =>
                  setCustomer({ ...customer, city: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Address"
                className="border p-2 rounded-lg"
                onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
                }
              />
            </div>

            <button className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition">
              Generate Bill
            </button>
          </div>
        )}
      </div>
    </Slidebar>
  );
}

export default Inventory_sales;
