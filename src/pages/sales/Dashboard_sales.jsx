import React from "react";
import Slidebar from "../../components/Slidebar";
import { salesMenuItems } from "./Slidebar_sales";

function Dashboard_sales() {
  return (
    <Slidebar title="Sales Panel" menuItems={salesMenuItems}>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to Sales Dashboard</h1>
        <p>This is where you manage your daily sales and orders.</p>
      </div>
    </Slidebar>
  );
}

export default Dashboard_sales;