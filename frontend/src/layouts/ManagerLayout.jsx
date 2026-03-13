import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function ManagerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = (e) => { e.preventDefault(); navigate('/login'); };

  const navLinkClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center gap-3 py-2.5 px-4 rounded-xl transition font-semibold text-sm ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`;
  };

  const NavLinks = () => (
    <>
      <Link to="/manager/dashboard" className={navLinkClass('/manager/dashboard')} onClick={() => setSidebarOpen(false)}><span>🏠</span> Dashboard</Link>
      <Link to="/manager/view_products" className={navLinkClass('/manager/view_products')} onClick={() => setSidebarOpen(false)}><span>📦</span> Inventory</Link>
      <Link to="/manager/target_orders" className={navLinkClass('/manager/target_orders')} onClick={() => setSidebarOpen(false)}><span>📋</span> Orders</Link>
      <Link to="/manager/profile" className={navLinkClass('/manager/profile')} onClick={() => setSidebarOpen(false)}><span>👤</span> My Profile</Link>
    </>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-indigo-900 text-white flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <div>
            <p className="text-sm font-black leading-none">CoolStock</p>
            <p className="text-xs text-indigo-300 leading-none">Manager Panel</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-indigo-700 transition text-xl">☰</button>
      </div>

      {/* Backdrop */}
      {sidebarOpen && <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-64 bg-indigo-900 text-white z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div>
          <div className="p-5 border-b border-indigo-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h2 className="text-lg font-black">CoolStock</h2>
                <p className="text-xs text-indigo-300">Manager Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-lg hover:bg-indigo-700 transition text-indigo-300 hover:text-white text-xl">✕</button>
          </div>
          <nav className="mt-4 space-y-1 px-3"><NavLinks /></nav>
        </div>
        <div className="mb-5 px-4 mt-4">
          <button onClick={handleLogout} className="w-full py-3 px-4 bg-red-600 rounded-xl hover:bg-red-700 transition text-center font-bold text-sm">🚪 Logout</button>
        </div>
      </div>

      <div className="md:ml-64 pt-14 md:pt-0 min-h-screen"><Outlet /></div>
    </div>
  );
}
