import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function DeliveryLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = (e) => { e.preventDefault(); navigate('/login'); };

  const navLinkClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center gap-3 py-2.5 px-4 rounded-xl transition font-semibold text-sm ${isActive ? 'bg-orange-600' : 'hover:bg-orange-600'}`;
  };

  const NavLinks = () => (
    <>
      <Link to="/delivery/dashboard" className={navLinkClass('/delivery/dashboard')} onClick={() => setSidebarOpen(false)}><span>🏠</span> My Orders</Link>
      <Link to="/delivery/profile" className={navLinkClass('/delivery/profile')} onClick={() => setSidebarOpen(false)}><span>👤</span> My Profile</Link>
    </>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-orange-700 text-white flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛵</span>
          <div>
            <p className="text-sm font-black leading-none">CoolStock</p>
            <p className="text-xs text-orange-200 leading-none">Delivery Panel</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-orange-600 transition text-xl">☰</button>
      </div>

      {/* Backdrop */}
      {sidebarOpen && <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-64 bg-orange-700 text-white z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div>
          <div className="p-5 border-b border-orange-600 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛵</span>
              <div>
                <h2 className="text-lg font-black">CoolStock</h2>
                <p className="text-xs text-orange-200">Delivery Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-lg hover:bg-orange-600 transition text-orange-200 hover:text-white text-xl">✕</button>
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
