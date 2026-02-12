import React from "react";
import Slidebar from "../../components/Slidebar";
import { salesMenuItems } from "./Slidebar_sales";

function Inventory_sales() {
  return (
    <Slidebar title="Sales Panel" menuItems={salesMenuItems}>
      <h1 className="text-2xl font-bold mb-4">Ice Cream Inventory</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600">Table or Grid of stock items goes here.</p>
        {/* You can map through your stock data here later */}
      </div>
    </Slidebar>
  );
}

export default Inventory_sales;