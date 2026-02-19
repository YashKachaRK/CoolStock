import React, { useState } from "react";
import Slidebar from "../../components/Slidebar";
import { salesMenuItems } from "./Slidebar_sales";
import { Search, Plus, Minus, Trash2, IndianRupee, CreditCard, Banknote } from "lucide-react";

function Order_sales() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for ice cream products
  const products = [
    { id: 1, name: "Vanilla Party Pack", price: 250, category: "Box", image: "https://placehold.co/60x60?text=Vanilla" },
    { id: 2, name: "Chocolate Cone", price: 60, category: "Cone", image: "https://placehold.co/60x60?text=Choco" },
    { id: 3, name: "Mango Delight", price: 120, category: "Cup", image: "https://placehold.co/60x60?text=Mango" },
    { id: 4, name: "Strawberry Swirl", price: 45, category: "Stick", image: "https://placehold.co/60x60?text=Berry" },
  ];

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <Slidebar title="Sales Panel" menuItems={salesMenuItems}>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        
        {/* Left Side: Product Selection */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">New Order</h1>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
              >
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                <h3 className="font-bold text-gray-800">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-blue-600 font-bold">₹{product.price}</span>
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-md uppercase text-gray-500">{product.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Billing Section */}
        <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <ShoppingBag size={20} className="text-blue-600" /> Current Order
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>No items added yet</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price} per unit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-200 rounded"><Minus size={14} /></button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-gray-200 rounded"><Plus size={14} /></button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (GST 5%)</span>
                <span>₹{(subtotal * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-800 border-t pt-2">
                <span>Total</span>
                <span>₹{(subtotal * 1.05).toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm">
                <Banknote size={18} /> Cash
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm">
                <CreditCard size={18} /> UPI/Card
              </button>
            </div>

            <button 
              disabled={cart.length === 0}
              className="w-full mt-4 bg-blue-600 disabled:bg-gray-300 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              Print Receipt & Finish
            </button>
          </div>
        </div>
      </div>
    </Slidebar>
  );
}

export default Order_sales;