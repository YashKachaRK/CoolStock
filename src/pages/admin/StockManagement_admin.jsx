import React from "react";
import Slidebar from "../../components/Slidebar";
import { menuItems } from "./Slidebar_data";
import { Search, Plus, RotateCw, Box, AlertTriangle } from "lucide-react";

const StockManagement_admin = () => {
  return (
    <Slidebar title="CoolStock Admin" menuItems={menuItems}>
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-2">
        Inventory / <span className="text-blue-500">Add / Update Stock</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-800 mb-1">Stock Management</h1>
      <p className="text-sm text-gray-500 mb-8">
        Record incoming deliveries or adjust existing inventory levels for your shop.
      </p>

      {/* Main Form Card */}
      <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form className="space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ice Cream Product</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-gray-400" />
              </span>
              <select className="block w-full py-2.5 pl-10 pr-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 appearance-none">
                <option>Search ice cream flavors...</option>
                <option>Classic Vanilla</option>
                <option>Dark Chocolate</option>
                <option>Strawberry Swirl</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Quantity (Boxes)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="e.g. 50"
                  className="block w-full py-2.5 px-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                  Units
                </span>
              </div>
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Effective Date</label>
              <input
                type="date"
                className="block w-full py-2.5 px-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="2023-10-27"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              rows="4"
              placeholder="e.g. Delivery from Main Warehouse A"
              className="block w-full py-2.5 px-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition shadow-md"
            >
              <Plus size={20} />
              Add Stock
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-500 font-bold py-3 rounded-lg hover:bg-blue-50 transition"
            >
              <RotateCw size={20} />
              Update Stock
            </button>
          </div>
        </form>
      </div>

      {/* Info Status Bar */}
      <div className="max-w-4xl mt-6 flex flex-col md:flex-row items-center justify-center gap-8 py-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Box size={18} className="text-blue-500" />
          <span>Current Total: <span className="font-bold">1,240 Boxes</span></span>
        </div>
        <div className="h-4 w-[1px] bg-gray-200 hidden md:block"></div>
        <div className="flex items-center gap-2 text-gray-700">
          <AlertTriangle size={18} className="text-blue-500" />
          <span><span className="font-bold">3 Items</span> low in stock</span>
        </div>
      </div>
    </Slidebar>
  );
};

export default StockManagement_admin;