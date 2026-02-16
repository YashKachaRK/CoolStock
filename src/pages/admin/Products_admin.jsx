import React from "react";
import { useNavigate } from "react-router-dom";
import Slidebar from "../../components/Slidebar";
import { menuItems } from "./SLidebar_Data";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

const Products_admin = () => {
  const navigate = useNavigate();

  const products = [
    { id: 1, name: "Classic Vanilla", size: "5 PLS / BOX", price: 25.0, status: "Active", image: "https://placehold.co/60x60?text=Vanilla" },
    { id: 2, name: "Mint Choco Chip", size: "10L Box", price: 45.0, status: "Inactive", image: "https://placehold.co/60x60?text=Mint" },
    { id: 3, name: "Strawberry Swirl", size: "5L Box", price: 28.0, status: "Active", image: "https://placehold.co/60x60?text=Berry" },
    { id: 4, name: "Dark Chocolate", size: "Pint", price: 12.0, status: "Active", image: "https://placehold.co/60x60?text=Choco" },
  ];

  return (
    <Slidebar title="CoolStock Admin" menuItems={menuItems}>
      <div className="bg-gray-50 min-h-screen p-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Product Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage flavors, box sizes, pricing and availability.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin_stock_update")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* ================= SEARCH + FILTER ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative w-full md:w-1/2">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            />
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl">
            <FilterButton label="All" active />
            <FilterButton label="Active" />
            <FilterButton label="Inactive" />
          </div>
        </div>

        {/* ================= PRODUCT TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b">
                  <th className="px-8 py-4 font-semibold">Product</th>
                  <th className="px-8 py-4 font-semibold">Box Size</th>
                  <th className="px-8 py-4 font-semibold">Price</th>
                  <th className="px-8 py-4 font-semibold">Status</th>
                  <th className="px-8 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Product ID: #{product.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-sm text-gray-500">
                      {product.size}
                    </td>

                    <td className="px-8 py-5 text-sm font-semibold text-gray-800">
                      ${product.price.toFixed(2)}
                    </td>

                    <td className="px-8 py-5">
                      <StatusBadge status={product.status} />
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <ActionButton
                          icon={<Edit2 size={16} />}
                          color="blue"
                          onClick={() => navigate("/admin_stock_update")}
                        />
                        <ActionButton
                          icon={<Trash2 size={16} />}
                          color="red"
                        />
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="px-8 py-5 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>Showing 1–4 of 24 products</p>

            <div className="flex items-center gap-2">
              <PaginationButton label="‹" />
              <PaginationButton label="1" active />
              <PaginationButton label="2" />
              <PaginationButton label="3" />
              <PaginationButton label="›" />
            </div>
          </div>

        </div>

      </div>
    </Slidebar>
  );
};

/* ================= COMPONENTS ================= */

const FilterButton = ({ label, active }) => (
  <button
    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition ${
      active
        ? "bg-white shadow text-gray-800"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {label}
  </button>
);

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      status === "Active"
        ? "bg-green-100 text-green-600"
        : "bg-gray-200 text-gray-600"
    }`}
  >
    {status}
  </span>
);

const ActionButton = ({ icon, color, onClick }) => {
  const colorStyles =
    color === "blue"
      ? "hover:bg-blue-50 hover:text-blue-600"
      : "hover:bg-red-50 hover:text-red-600";

  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-400 rounded-lg transition ${colorStyles}`}
    >
      {icon}
    </button>
  );
};

const PaginationButton = ({ label, active }) => (
  <button
    className={`px-3 py-1.5 rounded-lg border text-sm transition ${
      active
        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
        : "border-gray-200 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

export default Products_admin;
