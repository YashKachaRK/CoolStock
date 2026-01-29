import React, { useState } from "react";

function Slidebar({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
      >
        ☰
      </button>

      {/* Overlay (Mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white text-gray-900
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300 z-50`}
      >

        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        <nav className=" space-y-2">
          <a
            href="#"
            className="group flex items-center gap-3 px-4 py-3 hover:bg-blue-50 hover:text-blue-600  "
          >
            <span>🏠</span>
            <span className="text-sm opacity-0 group md:opacity-100 transition">
              Dashboard
            </span>
          </a>

          <a
            href="#"
            className="group flex items-center gap-3 px-4 py-3 hover:bg-blue-50  hover:text-blue-600 "
          >
            <span>⚙️</span>
            <span className="text-sm opacity-0 group-hover:opacity-100 md:opacity-100 transition">
              Settings
            </span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 mt-10 md:mt-0">
        {children}
      </main>
    </div>
  );
}

export default Slidebar;
