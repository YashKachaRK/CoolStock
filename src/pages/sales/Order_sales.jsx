import React from "react";
import Slidebar from "../../components/Slidebar";
import { salesMenuItems } from "./Slidebar_sales";

function Order_sales() {
  return (
    <Slidebar title="Sales Panel" menuItems={salesMenuItems}>
      <h1 className="text-2xl font-bold mb-4">New Sale / Billing</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Billing form and item selection goes here.</p>
      </div>
    </Slidebar>
  );
}

export default Order_sales;