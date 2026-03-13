import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const navLinkClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center gap-3 py-2.5 px-4 rounded-xl transition font-semibold text-sm ${
      isActive ? 'bg-slate-700' : 'hover:bg-slate-700'
    }`;
  };

  const NavLinks = () => (
    <>
      <p className="text-xs text-slate-500 uppercase font-bold px-3 pt-2 pb-1">Overview</p>
      <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')} onClick={() => setSidebarOpen(false)}>
        <span>🏠</span> Dashboard
      </Link>

      <p className="text-xs text-slate-500 uppercase font-bold px-3 pt-4 pb-1">Management</p>
      <Link to="/admin/manage_stock" className={navLinkClass('/admin/manage_stock')} onClick={() => setSidebarOpen(false)}>
        <span>📦</span> Manage Stock
      </Link>
      <Link to="/admin/recent_orders" className={navLinkClass('/admin/recent_orders')} onClick={() => setSidebarOpen(false)}>
        <span>🧾</span> Recent Orders
      </Link>
      <Link to="/admin/view_employees" className={navLinkClass('/admin/view_employees')} onClick={() => setSidebarOpen(false)}>
        <span>👥</span> Manage Staff
      </Link>
      <Link to="/admin/view_customers" className={navLinkClass('/admin/view_customers')} onClick={() => setSidebarOpen(false)}>
        <span>🏪</span> Manage Customers
      </Link>

      <p className="text-xs text-slate-500 uppercase font-bold px-3 pt-4 pb-1">Account</p>
      <Link to="/admin/profile" className={navLinkClass('/admin/profile')} onClick={() => setSidebarOpen(false)}>
        <span>👤</span> My Profile
      </Link>
    </>
  );

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-800 text-white flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍦</span>
          <div>
            <p className="text-sm font-black leading-none">CoolStock</p>
            <p className="text-xs text-slate-400 leading-none">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-slate-700 transition text-xl"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar (drawer on mobile, fixed on desktop) ── */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-slate-800 text-white z-50
        flex flex-col justify-between overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Sidebar header */}
        <div>
          <div className="p-5 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍦</span>
              <div>
                <h2 className="text-lg font-black">CoolStock</h2>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </div>
            {/* Close button — mobile only */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg hover:bg-slate-700 transition text-slate-400 hover:text-white text-xl"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="mt-4 space-y-1 px-3">
            <NavLinks />
          </nav>
        </div>

        {/* Logout */}
        <div className="mb-5 px-4 pb-2 mt-4">
          <button
            onClick={handleLogout}
            className="w-full block py-3 px-4 bg-red-600 rounded-xl hover:bg-red-700 transition text-center font-bold text-sm"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ── Main content area ── */}
      <div className="md:ml-64 pt-14 md:pt-0 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
