import React from "react";
import Slidebar from "../../components/Slidebar";
import { Home, Settings, Users } from "lucide-react";
import { menuItems } from "../admin/SLidebar_Data";
function Dashboard_admin() {
  
  return (
    <div className="bg-gray-200">
      <Slidebar 
      title="Admin Panel"
      menuItems={menuItems}
      sidebarWidth="w-60">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>
          Welcome to the admin dashboard. Here you can manage the application
          settings and user accounts.
        </p>
      </Slidebar>
    </div>
  );
}

export default Dashboard_admin;
