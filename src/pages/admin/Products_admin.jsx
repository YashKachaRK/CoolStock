import React from "react";
import { useNavigate } from "react-router-dom";
import Slidebar from "../../components/Slidebar";
import { menuItems } from "./Slidebar_data";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";


const Products_admin = () => {
  const navigate = useNavigate();

  // Dummy data for ice cream products
  const products = [
    { id: 1, name: "Classic Vanilla", size: "5L Box", price: 25.00, status: "Active", image: "https://placehold.co/40x40?text=Vanilla" },
    { id: 2, name: "Mint Choco Chip", size: "10L Box", price: 45.00, status: "Inactive", image: "https://placehold.co/40x40?text=Mint" },
    { id: 3, name: "Strawberry Swirl", size: "5L Box", price: 28.00, status: "Active", image: "https://placehold.co/40x40?text=Berry" },
    { id: 4, name: "Dark Chocolate", size: "Pint", price: 12.00, status: "Active", image: "https://placehold.co/40x40?text=Choco" },
  ];


  return (
    <Slidebar title="CoolStock Admin" menuItems={menuItems}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-sm text-gray-500">Manage your ice cream flavors, sizes, and pricing.</p>
        </div>
        
        {/* Link to Stock Management Page */}
        <button 
          onClick={() => navigate("/admin_stock_update")} 
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </span>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Search ice cream flavors..."
          />
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button className="px-4 py-1.5 text-sm font-medium bg-white rounded-md shadow-sm">All</button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700">Active</button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700">Inactive</button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold">Box Size</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                      <span className="font-semibold text-gray-700">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.size}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      product.status === "Active" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gray-100 text-gray-500"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate("/admin_stock_update")}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <p>Showing 1 to 4 of 24 results</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition">&lt;</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded shadow-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition">&gt;</button>
          </div>
        </div>
      </div>
    </Slidebar>
  );
};

export default Products_admin;