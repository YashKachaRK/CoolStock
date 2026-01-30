import React from 'react'
import Slidebar from "../../components/Slidebar";
import { menuItems } from "../admin/SLidebar_Data";
function Salesman_admin() {
  return (
    <div className="bg-gray-200">
      <Slidebar 
      title="Admin Panel"
      menuItems={menuItems}
      sidebarWidth="w-60">
        <h1 className="text-2xl font-bold mb-4">Salesman Dashboard</h1>
       
      </Slidebar>
    </div>
  )
}

export default Salesman_admin