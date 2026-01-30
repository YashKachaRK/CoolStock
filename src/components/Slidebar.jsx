import React, { useState } from "react";
import { Menu, X } from "lucide-react";

function Slidebar({
  title = "Admin Panel",
  menuItems = [],
  sidebarWidth = "w-60",
  children,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded h-[50px] w-[50px] flex items-center justify-center hover:bg-gray-700 transition"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen ${sidebarWidth} bg-white text-gray-900
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300 z-50`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 mt-2 p-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition hover:rounded-lg"
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 mt-20 md:mt-0">
        {children}
      </main>
    </div>
  );
}

export default Slidebar;
