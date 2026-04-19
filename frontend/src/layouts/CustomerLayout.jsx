import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = (e) => { e.preventDefault(); navigate('/login'); };

  const navLinkClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `transition font-semibold text-sm ${isActive ? 'text-purple-600 border-b-2 border-purple-600 pb-0.5' : 'text-gray-500 hover:text-purple-600'}`;
  };

  const mobileNavLinkClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Customer Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍦</span>
          <div>
            <span className="text-lg md:text-xl font-black text-gray-800">CoolStock</span>
            <span className="text-xs text-gray-400 ml-2 hidden sm:inline">Customer Portal</span>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-4 text-sm font-semibold">
          <Link to="/customer/place_order" className={navLinkClass('/customer/place_order')}>📦 Place Order</Link>
          <Link to="/customer/track_order" className={navLinkClass('/customer/track_order')}>📍 Track Orders</Link>
          <Link to="/customer/profile" className={navLinkClass('/customer/profile')}>👤 My Profile</Link>
        </div>

        {/* Desktop logout */}
        <button onClick={handleLogout} className="hidden md:block bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-red-200 transition">
          🚪 Logout
        </button>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition text-xl text-gray-600">
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b shadow-md px-4 py-3 space-y-1 sticky top-14 z-30">
          <Link to="/customer/place_order" className={mobileNavLinkClass('/customer/place_order')} onClick={() => setMenuOpen(false)}>📦 Place Order</Link>
          <Link to="/customer/track_order" className={mobileNavLinkClass('/customer/track_order')} onClick={() => setMenuOpen(false)}>📍 Track Orders</Link>
          <Link to="/customer/profile" className={mobileNavLinkClass('/customer/profile')} onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
          <div className="pt-2 border-t">
            <button onClick={handleLogout} className="w-full py-2.5 bg-red-100 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-200 transition">
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Outlet />
    </div>
  );
}
