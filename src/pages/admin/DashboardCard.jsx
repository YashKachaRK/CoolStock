import React from "react";

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
      <div className="bg-gray-100 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
}

export default DashboardCard;
